import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { PlayService } from './play.service';
import { Server } from 'ws';
import { QuizSubmitDto } from './dto/quiz-submit.dto';
import { QuizJoinDto } from './dto/quiz-join.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { WebSocketWithSession } from '../core/SessionWsAdapter';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { ChatService } from '../chat/chat.service';
import { Broker, ChatMessage, SendEventMessage } from '@web08-booquiz/shared';

/**
 * 퀴즈 게임에 대한 WebSocket 연결을 관리하는 Gateway입니다.
 * 클라이언트가 퀴즈 진행, 제출, 타임아웃 및 결과 요약과 관련된 이벤트를 처리합니다.
 */
@WebSocketGateway({ path: '/play' })
export class PlayGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject('ClientInfoStorage')
        private readonly clients: Map<String, WebSocketWithSession>,
        private readonly playService: PlayService,
        private readonly chatService: ChatService,
        @Inject('Broker')
        private readonly broker: Broker<SendEventMessage<any>>,
    ) {}

    /**
     * WebSocket 서버 초기화 시, 퀴즈 진행 및 요약 이벤트를 처리하는 핸들러를 설정합니다.
     *
     * @param server - WebSocket 서버 인스턴스
     */
    afterInit(server: Server) {
        server.on('nextQuiz', (quizZoneId: string) => this.playNextQuiz(quizZoneId));
        server.on('summary', (quizZoneId: string) => this.summary(quizZoneId));
    }

    private sendToClient(clientId: string, event: string, data?: any) {
        const socket = this.clients.get(clientId);

        if (socket === undefined) {
            throw new NotFoundException('사용자의 접속 정보를 찾을 수 없습니다.')
        }

        socket.send(JSON.stringify({ event, data }));
    }

    /**
     * 클라이언트가 퀴즈 방에 참여했다는 메세지를 방의 다른 참여자들에게 전송합니다.
     *
     * @param client - 클라이언트 소켓
     * @param quizJoinDto - 퀴즈 참여 정보(퀴즈 존 ID)
     */
    @SubscribeMessage('join')
    async join(
        @ConnectedSocket() client: WebSocketWithSession,
        @MessageBody() quizJoinDto: QuizJoinDto,
    ): Promise<SendEventMessage<ResponsePlayerDto[]>> {
        const sessionId = client.session.id;
        const { quizZoneId } = quizJoinDto;

        const { currentPlayer, players } = await this.playService.joinQuizZone(
            quizZoneId,
            sessionId,
        );

        const { id, nickname } = currentPlayer;

        await this.subscribePlay(quizZoneId, client);

        await this.chatService.join(quizZoneId, currentPlayer, (message: ChatMessage) => {
            client.send(JSON.stringify({event: 'chat', data: message}));
        });

        await this.broker.publish(quizZoneId, { event: 'someone_join', sender: id, data: {id, nickname} });

        return {
            event: 'join',
            sender: id,
            data: players.map(({ id, nickname }) => ({ id, nickname }))
        };
    }

    @SubscribeMessage('changeNickname')
    async changeNickname(
        @ConnectedSocket() client: WebSocketWithSession,
        @MessageBody() changedNickname: string,
    ): Promise<SendEventMessage<string>> {
        const { id, quizZoneId } = client.session;

        await this.playService.changeNickname(quizZoneId, id, changedNickname);

        await this.broker.publish(quizZoneId, {event: 'changeNickname', sender: id, data: {id, changedNickname}});

        return {
            event: 'changeNickname',
            sender: id,
            data: 'OK',
        };
    }

    /**
     * 퀴즈 게임을 시작하는 메시지를 클라이언트로 전송합니다.
     *
     * @param client - WebSocket 클라이언트
     */
    @SubscribeMessage('start')
    async start(@ConnectedSocket() client: WebSocketWithSession) {
        const { id, quizZoneId } = client.session;

        await this.playService.startQuizZone(quizZoneId, id);

        await this.broker.publish(quizZoneId, {event: 'start', sender: quizZoneId, data: 'OK'});

        this.server.emit('nextQuiz', quizZoneId);
    }

    /**
     * 다음 퀴즈를 시작하고 클라이언트에 전달합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async playNextQuiz(quizZoneId: string) {
        try {
            const { nextQuiz, currentQuizResult } = await this.playService.playNextQuiz(
                quizZoneId,
                async () => {
                    await this.broker.publish(quizZoneId, {event: 'quizTimeOut', sender: quizZoneId, data: undefined});
                    this.server.emit('nextQuiz', quizZoneId);
                },
            );

            await this.broker.publish(quizZoneId, {
                event: 'nextQuiz', sender: quizZoneId, data: { nextQuiz, currentQuizResult }
            });
        } catch (error) {
            if (error instanceof RuntimeException) {
                await this.finishQuizZone(quizZoneId);
            } else {
                throw error;
            }
        }
    }

    private async finishQuizZone(quizZoneId: string) {
        await this.broker.publish(quizZoneId, {event: 'finish', sender: quizZoneId, data: undefined});
        this.server.emit('summary', quizZoneId);
    }

    /**
     * 클라이언트가 퀴즈 답안을 제출한 경우 호출됩니다.
     *
     * @param client - WebSocket 클라이언트
     * @param quizSubmit - 퀴즈 제출 데이터
     * @returns {Promise<SendEventMessage<string>>} 제출 완료 메시지
     */
    @SubscribeMessage('submit')
    async submit(
        @ConnectedSocket() client: WebSocketWithSession,
        @MessageBody() quizSubmit: QuizSubmitDto,
    ): Promise<SendEventMessage<SubmitResponseDto>> {
        const { id, quizZoneId } = client.session;

        const {
            isLastSubmit,
            fastestPlayerIds,
            submittedCount,
            totalPlayerCount,
        } = await this.playService.submit(quizZoneId, id, {
            ...quizSubmit,
            receivedAt: Date.now(),
        });

        if (isLastSubmit) {
            this.server.emit('nextQuiz', quizZoneId);
        } else {
            await this.broker.publish(quizZoneId, {event: 'someone_submit', sender: id, data: { id, submittedCount }});
        }

        return {
            event: 'submit',
            sender: id,
            data: {
                fastestPlayerIds, submittedCount, totalPlayerCount,
                chatMessages: await this.chatService.get(quizZoneId)
            },
        };
    }

    /**
     * 퀴즈 진행이 끝나면 요약 결과를 퀴즈 존의 모든 플레이어에게 전송합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async summary(quizZoneId: string) {
        const summaries = await this.playService.summaryQuizZone(quizZoneId);
        const endSocketTime = summaries[0].endSocketTime;

        summaries.map(async ({ id, score, submits, quizzes, ranks, endSocketTime }) => {
            this.sendToClient(id, 'summary', { score, submits, quizzes, ranks, endSocketTime });
        });

        this.clearQuizZone(quizZoneId, endSocketTime - Date.now());
    }

    /**
     * 퀴즈 방을 나갔다는 메시지를 클라이언트로 전송합니다.
     *
     * - 방장이 나가면 퀴즈 존을 삭제하고 모든 플레이어에게 방장이 나갔다고 알립니다.
     * - 일반 플레이어가 나가면 퀴즈 존에서 나가고 다른 플레이어에게 나갔다고 알립니다.
     * @param quizZoneId - 퀴즈가 끝난 퀴즈존 id
     * @param time - 소켓 연결 종료 시간 종료 시간
     */
    private clearQuizZone(quizZoneId: string, time: number) {
        setTimeout(async () => {
            await this.playService.clearQuizZone(quizZoneId);
            await this.broker.publish(quizZoneId, {event: 'close', sender: quizZoneId, data: undefined});
            await this.chatService.delete(quizZoneId);
        }, time);
    }

    /**
     * 퀴즈 방을 나갔다는 메시지를 클라이언트로 전송합니다.
     *
     * - 방장이 나가면 퀴즈 존을 삭제하고 모든 플레이어에게 방장이 나갔다고 알립니다.
     * - 일반 플레이어가 나가면 퀴즈 존에서 나가고 다른 플레이어에게 나갔다고 알립니다.
     * @param client - WebSocket 클라이언트
     */
    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client: WebSocketWithSession) {
        const { id, quizZoneId } = client.session;

        const { isHost } = await this.playService.leaveQuizZone(quizZoneId, id);

        if (isHost) {
            await this.broker.publish(quizZoneId, {event: 'close', sender: quizZoneId, data: undefined});
            this.clearQuizZone(quizZoneId, 0);
        } else {
            await this.broker.publish(quizZoneId, {event: 'someone_leave', sender: id, data: undefined});
            await this.chatService.leave(quizZoneId, id);
        }

        return { event: 'leave', data: 'OK' };
    }

    @SubscribeMessage('chat')
    async chat(
        @ConnectedSocket() client: WebSocketWithSession,
        @MessageBody() message: ChatMessage,
    ) {
        await this.chatService.send(client.session.quizZoneId, message);
    }

    private async subscribePlay(quizZoneId: string, client: WebSocketWithSession) {
        const clientId = client.session.id;

        this.clients.set(clientId, client);

        try {
            await this.broker.addPublisher(quizZoneId);
        } catch (error) {}
        const unsubscribe = await this.broker.subscribe(
            quizZoneId, clientId, async (message) => {
            const {event, sender} = message;

            if (sender !== clientId) {
                client.send(JSON.stringify(message));
            } else if (event === 'someone_leave') {
                await unsubscribe();
                this.clients.delete(clientId);
                client.close();
            }
        });
    }
}
