import { Message } from './message.interface'
import { MessageHandler } from '../types';

export interface PubSub<T> {
    subscribe(publisherId: string, subscriberId: string, handler: MessageHandler<T>): Promise<void>;

    unsubscribe(publisherId: string, subscriberId: string): Promise<void>;

    addPublisher(publisherId: string): Promise<void>;

    removePublisher(publisherId: string): Promise<void>;

    publish(publisherId: string, message: Message<T>): Promise<void>;
}