import { Message } from './Message';

export type SubscriptionHandler<T> = (message: Message<T>) => void | Promise<void>;

export interface Subscription<T> {
    id: string;
    topic: string;
    handler: SubscriptionHandler<T>;
}

