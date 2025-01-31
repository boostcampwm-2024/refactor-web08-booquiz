export type PlayEvent = UnicastPlayEvent | BroadcastPlayEvent;

export type UnicastPlayEvent = 'join' | 'changeNickname' | 'submit' | 'leave';

export type BroadcastPlayEvent =
    'someone_join' | 'someone_leave' | 'changeNickname' |
    'start' | 'nextQuiz' |
    'someone_submit' | 'quizTimeOut' |
    'finish' | 'summary' | 'close';
/**
 * 웹소켓 서버가 사용자에게 응답할 메시지 형식을 정의합니다.
 * 
 * @property event - 클라이언트에게 전송할 이벤트 이름
 * @property data - 클라이언트에게 전송할 데이터
 */
export interface SendEventMessage<TEvent, TMessage> {
    event: TEvent;
    sender: string;
    data: TMessage;
}