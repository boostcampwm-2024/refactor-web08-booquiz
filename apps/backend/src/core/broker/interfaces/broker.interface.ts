import { Message } from './message.interface'
import { MessageHandler } from '../types';

type Unsubscribe = () => Promise<void>;

export interface Broker<TTopic, TData> {
    subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<TTopic, TData>): Promise<Unsubscribe>;

    addPublisher(publisherId: string): Promise<void>;

    removePublisher(publisherId: string): Promise<void>;

    publish(publisherId: string, message: Message<TTopic, TData>): Promise<void>;
}