export interface MessageWithTopic<TTopic, TData> {
    topic: TTopic;
    data: TData;
}