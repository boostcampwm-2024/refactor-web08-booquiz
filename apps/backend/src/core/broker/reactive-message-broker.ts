import { Subject } from 'rxjs';
import { Message } from './interfaces/message.interface';
import { Broker } from './interfaces/broker.interface';

export class ReactiveMessageBroker<TTopic, TData> implements Broker<TTopic, TData> {
    constructor(
        private publishers: Map<string, Subject<Message<TTopic, TData>>> = new Map(),
    ) {}

    public async addPublisher(id: string) {
        if (this.publishers.has(id)) {
            throw new Error(`Publisher with ID ${id} already exists`);
        }

        this.publishers.set(id, new Subject<Message<TTopic, TData>>());
    }

    public async removePublisher(id: string) {
        const publisher = this.publishers.get(id);
        if (!publisher) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        publisher.complete();
        this.publishers.delete(id);
    }

    public async publish(id: string, message: Message<TTopic, TData>) {
        const publisher = this.publishers.get(id);

        if (!publisher) {
            throw new Error(`Publisher with ID ${id} does not exist`);
        }

        publisher.next(message);
    }

    public async subscribe(
        publisherId: string,
        subscriberId: string,
        handler: (message: Message<TTopic, TData>) => void
    ) {
        const publisher = this.publishers.get(publisherId);

        if (!publisher) {
            throw new Error(`Publisher with ID ${publisherId} does not exist`);
        }

        const subscription = publisher.subscribe({
            next: handler,
            error: (error) => console.error(`Error in subscription ${publisherId}:${subscriberId} :`, error)
        });

        return async () => subscription.unsubscribe();
    }
}