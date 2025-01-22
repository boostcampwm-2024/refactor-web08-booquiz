import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ChatRepositoryMemory } from './repository/chat.memory.repository';
import { ChatMessage, Player } from '@web08-booquiz/shared';
import { PubSub } from '../core/pub-sub/interfaces/pub-sub.interface';

@Injectable()
export class ChatService {
    constructor(
        @Inject('ChatRepository')
        private readonly chatRepository: ChatRepositoryMemory,
        @Inject('PubSub')
        private readonly pubSub: PubSub<'chat' | 'leave', ChatMessage>
    ) {
    }

    async set(id: string) {
        await this.chatRepository.set(id);
        await this.pubSub.addPublisher(id);
    }

    async get(id: string) {
        if (!(await this.chatRepository.has(id))) {
            throw new NotFoundException('퀴즈 존에 대한 채팅이 존재하지 않습니다.');
        }
        return this.chatRepository.get(id);
    }

    async delete(id: string) {
        await this.chatRepository.delete(id);
        await this.pubSub.removePublisher(id);
    }

    async join(chatId: string, player: Player, handleSendMessage: (data: ChatMessage) => void) {
        const unsubscribe = await this.pubSub.subscribe(chatId, player.id, async (message) => {
            const { topic, data } = message;
            const { clientId } = data;

            switch (topic) {
                case 'chat':
                    handleSendMessage(data);
                    return this.add(chatId, data);
                case 'leave':
                    if (clientId === player.id) {
                        return unsubscribe();
                    }
            }
        });
    }

    async send(chatId: string, chatMessage: ChatMessage) {
        await this.pubSub.publish(chatId, {
            topic: 'chat',
            data: chatMessage,
        });
    }

    async leave(chatId: string, clientId: string) {
        await this.pubSub.publish(chatId, {
            topic: 'leave',
            data: {
                clientId,
                nickname: '',
                message: '',
            },
        })
    }

    private async add(id: string, chatMessage: ChatMessage) {
        if (!(await this.chatRepository.has(id))) {
            throw new NotFoundException('퀴즈 존에 대한 채팅이 존재하지 않습니다.');
        }

        await this.chatRepository.add(id, chatMessage);
    }
}
