import { MessageHandler } from '../types';

type Unsubscribe = () => Promise<void>;

export interface Broker<TMessage> {
    subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<TMessage>): Promise<Unsubscribe>;

    addPublisher(publisherId: string): Promise<void>;

    removePublisher(publisherId: string): Promise<void>;

    publish(publisherId: string, message: TMessage): Promise<void>;
}