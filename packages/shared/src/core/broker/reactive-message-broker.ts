import { Subject } from 'rxjs';
import { Broker } from './interfaces/broker.interface';
import { MessageHandler } from './types';

export class ReactiveMessageBroker<TMessage> implements Broker<TMessage> {
    constructor(
        private publishers: Map<string, Subject<TMessage>> = new Map(),
    ) {}

    public async addPublisher(id: string) {
        if (this.publishers.has(id)) {
            throw new Error(`Publisher with ID ${id} already exists`);
        }

        this.publishers.set(id, new Subject<TMessage>());
    }

    public async removePublisher(id: string) {
        const publisher = this.publishers.get(id);
        if (!publisher) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        publisher.complete();
        this.publishers.delete(id);
    }

    public async publish(id: string, message: TMessage) {
        const publisher = this.publishers.get(id);

        if (!publisher) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        publisher.next(message);
    }

    public async subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<TMessage>
    ) {
        const publisher = this.publishers.get(publisherId);

        if (!publisher) {
            throw new Error(`Publisher with ID ${publisherId} does not exist`);
        }

        const subscription = publisher.subscribe({
            next: handler,
            error: (error: any) => console.error(`Error in subscription ${publisherId}:${subscriberId} :`, error)
        });

        return async () => subscription.unsubscribe();
    }
}