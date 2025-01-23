export interface Message<TTopic, TData> {
    topic: TTopic;
    data: TData;
}