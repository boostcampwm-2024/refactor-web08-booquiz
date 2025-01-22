export interface Message<T> {
    topic: string;
    data: T;
}