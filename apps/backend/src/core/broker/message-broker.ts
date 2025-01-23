import { Broker } from './interfaces/broker.interface';
import { MessageHandler } from './types';

export class MessageBroker<TMessage> implements Broker<TMessage> {
    constructor(
        private readonly subscribers: Map<string, Map<string, MessageHandler<TMessage>>> = new Map(),
    ) {}

    public async addPublisher(id: string) {
        if (this.subscribers.has(id)) {
            throw new Error(`Publisher with ID ${id} already exists`);
        }

        this.subscribers.set(id, new Map());
    }

    public async removePublisher(id: string) {
        if (!this.subscribers.has(id)) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        this.subscribers.delete(id);
    }

    public async publish(id: string, message: TMessage) {
        const subscribers = this.getSubscribers(id);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        await Promise.all([...subscribers.values()].map(handler => handler(message)));
    }

    public async subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<TMessage>) {
        const subscribers = this.getSubscribers(publisherId);
        subscribers.set(subscriberId, handler);
        return () => this.unsubscribe(publisherId, subscriberId);
    }

    private async unsubscribe(publisherId: string, subscriberId: string) {
        const subscribers = this.getSubscribers(publisherId);
        subscribers.delete(subscriberId);
    }

    private getSubscribers(id: string) {
        if (!this.subscribers.has(id)) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }
        return this.subscribers.get(id);
    }
}