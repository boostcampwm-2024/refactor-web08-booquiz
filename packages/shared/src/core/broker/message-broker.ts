import { Broker } from './interfaces/broker.interface';
import { MessageHandler } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface Subscriber<TMessage> {
    id: string;
    handler: MessageHandler<TMessage>;
}

export class MessageBroker<TMessage> implements Broker<TMessage> {
    constructor(
        private readonly publishers: Map<string, Subscriber<TMessage>[]> = new Map(),
    ) {}

    public async addPublisher(id: string) {
        if (this.publishers.has(id)) {
            throw new Error(`Publisher with ID ${id} already exists`);
        }

        this.publishers.set(id, []);
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

        await Promise.all(subscribers.map((subscriber) => subscriber.handler(message)));
    }

    public async subscribe(publisherId: string, handler: MessageHandler<TMessage>) {
        const subscribers = this.publishers.get(publisherId);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${publisherId} does not exist`);
        }

        const subscriberId = uuidv4();
        this.publishers.set(publisherId, [...subscribers, {id: subscriberId, handler}]);

        return () => this.unsubscribe(publisherId, subscriberId);
    }

    private async unsubscribe(publisherId: string, subscriberId: string) {
        const subscribers = this.publishers.get(publisherId);

        if (subscribers === undefined) {
            throw new Error(`Publisher with ID ${publisherId} does not exist`);
        }

        this.publishers.set(publisherId, subscribers.filter((subscriber) => subscriber.id !== subscriberId));
    }
}