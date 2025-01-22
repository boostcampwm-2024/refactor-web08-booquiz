import { Message } from './interfaces/message.interface';

export type MessageHandler<T> = (message: Message<T>) => void | Promise<void>;