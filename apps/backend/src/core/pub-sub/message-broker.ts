import { PubSub } from './interfaces/pub-sub.interface';
import { Message } from './interfaces/message.interface';
import { MessageHandler } from './types';

export class MessageBroker<TTopic, TData> implements PubSub<TTopic, TData> {
    constructor(
        private readonly publishers: Map<string, Map<string, MessageHandler<TTopic, TData>>> = new Map(),
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

    public async publish(id: string, message: Message<TTopic, TData>) {
        const subscribers = this.getSubscribers(id);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        await Promise.all([...subscribers.values()].map(handler => handler(message)));
    }

    public async subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<TTopic, TData>) {
        const subscribers = this.getSubscribers(publisherId);
        subscribers.set(subscriberId, handler);
        return () => this.unsubscribe(publisherId, subscriberId);
    }

    private async unsubscribe(publisherId: string, subscriberId: string) {
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