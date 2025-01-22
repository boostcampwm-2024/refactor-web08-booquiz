import { PubSub } from './interfaces/pub-sub.interface';
import { Message } from './interfaces/message.interface';
import { MessageHandler } from './types';

export class MessageBroker<T> implements PubSub<T> {
    constructor(
        private readonly publishers: Map<string, Map<string, MessageHandler<T>>>,
    ) {}

    public async addPublisher(id: string) {
        if (this.publishers.has(id)) {
            throw new Error(`Publisher with ID ${id} already exists`);
        }

        this.publishers.set(id, new Map());
    }

    public async removePublisher(id: string) {
        if (!this.publishers.has(id)) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        this.publishers.delete(id);
    }

    public async publish(id: string, message: Message<T>) {
        const subscribers = this.getSubscribers(id);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        return Promise.all([...subscribers.values()].map(handler => handler(message)));
    }

    public async subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<T>) {
        const subscribers = this.getSubscribers(publisherId);
        subscribers.set(subscriberId, handler);
    }

    public async unsubscribe(publisherId: string, subscriberId: string) {
        const subscribers = this.getSubscribers(publisherId);
        subscribers.delete(subscriberId);
    }

    private getSubscribers(id: string) {
        if (!this.publishers.has(id)) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }
        return this.publishers.get(id);
    }
}