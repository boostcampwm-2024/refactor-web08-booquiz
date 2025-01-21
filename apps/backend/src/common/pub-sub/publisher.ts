import { randomUUID } from 'node:crypto';
import { MessageQueue } from './message-queue';

export class Publisher<T> {
    constructor(
        public readonly id: string,
        private readonly messageQueue: MessageQueue<T>
    ) {}

    async publish(topic: string, data: T): Promise<void> {
        const now = Date.now();
        const message = {
            id: `${this.id}-${now}-${randomUUID()}`,
            topic,
            data,
            publisherId: this.id,
            timestamp: now,
        };

        await this.messageQueue.publish(message);
    }
}