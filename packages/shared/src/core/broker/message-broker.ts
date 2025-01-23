import { Broker } from './interfaces/broker.interface';
import { MessageHandler } from './types';

export class MessageBroker<TMessage> implements Broker<TMessage> {
    constructor(
        private readonly publishers: Map<string, Map<string, MessageHandler<TMessage>>> = new Map(),
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

    public async publish(id: string, message: TMessage) {
        const subscribers = this.publishers.get(id);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        await Promise.all([...subscribers.values()].map(handler => handler(message)));
    }

    public async subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<TMessage>) {
        const subscribers = this.publishers.get(publisherId);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${publisherId} does not exist`);
        }

        subscribers.set(subscriberId, handler);

        return () => this.unsubscribe(publisherId, subscriberId);
    }

    private async unsubscribe(publisherId: string, subscriberId: string) {
        const subscribers = this.publishers.get(publisherId);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${publisherId} does not exist`);
        }

        subscribers.delete(subscriberId);
    }
}