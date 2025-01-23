import { Message } from './interfaces/message.interface';

export type MessageHandler<TTopic, TData> = (message: Message<TTopic, TData>) => void | Promise<void>;