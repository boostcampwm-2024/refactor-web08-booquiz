export interface Message<T> {
    id: string;
    topic: string;
    data: T;
    publisherId: string;
    timestamp: number;
}