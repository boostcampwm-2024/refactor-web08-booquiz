import { Injectable } from '@nestjs/common';
import { MessageQueue } from '../common/pub-sub/message-queue';

@Injectable()
export class MessageQueueService<T> extends MessageQueue<T>{
    constructor(maxRetries: number = 3, retryDelay: number = 1000) {
        super(maxRetries, retryDelay);
    }
}
