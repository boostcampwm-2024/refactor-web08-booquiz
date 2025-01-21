import { Message } from "./interfaces/Message";
import { Publisher } from "./publisher";
import { Subscription, SubscriptionHandler } from "./interfaces/subscription.interface";
import { randomUUID } from 'node:crypto';

interface DeliveryStatus {
    success: boolean;
    retries: number;
}

export class MessageQueue<T> {
    private queues: Map<string, Message<T>[]> = new Map();
    private subscriptions: Map<string, Subscription<T>[]> = new Map();
    private publishers: Map<string, Publisher<T>> = new Map();
    private processing: Map<string, boolean> = new Map();

    constructor(
        private readonly maxRetries: number = 3,
        private readonly retryDelay: number = 1000
    ) {}

    registerPublisher(publisherId: string): Publisher<T> {
        if (this.publishers.has(publisherId)) {
            throw new Error(`Publisher with ID ${publisherId} already exists`);
        }

        const publisher = new Publisher<T>(publisherId, this);

        this.publishers.set(publisherId, publisher);

        return publisher;
    }

    removePublisher(publisherId: string): void {
        this.publishers.delete(publisherId);
    }

    async publish(message: Message<T>): Promise<void> {
        if (!this.queues.has(message.topic)) {
            this.queues.set(message.topic, []);
        }

        this.queues.get(message.topic).push(message);

        await this.processQueue(message.topic);
    }

    subscribe(topic: string, handler: SubscriptionHandler<T>): () => void {
        const subscriptions = this.getSubscriptions(topic);
        const subscription: Subscription<T> = {
            id: randomUUID(),
            topic,
            handler,
        };

        return () => {
            if (subscriptions) {
                const index = subscriptions.findIndex(s => s.id === subscription.id);
                if (index !== -1) {
                    subscriptions.splice(index, 1);
                }
                if (subscriptions.length === 0) {
                    this.subscriptions.delete(topic);
                }
            }
        };
    }

    private getSubscriptions(topic: string) {
        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, []);
        }

        return this.subscriptions.get(topic);
    }

    private async processQueue(topic: string): Promise<void> {
        if (!this.shouldProcessQueue(topic)) {
            return;
        }

        this.processing.set(topic, true);

        try {
            const queue = this.queues.get(topic)!;
            while (queue.length > 0) {
                await this.processMessage(queue[0], topic);
                queue.shift();
            }
        } finally {
            this.processing.set(topic, false);
        }
    }

    private shouldProcessQueue(topic: string) {
        return !this.processing.get(topic)
            && (this.queues.get(topic)?.length ?? 0) > 0;
    }

    private async processMessage(message: Message<T>, topic: string) {
        const subscribers = this.subscriptions.get(topic) ?? [];
        const deliveryStatus = this.initializeDeliveryStatus(subscribers);

        await this.deliverToAllSubscribers(message, subscribers, deliveryStatus, topic);
        this.logFailedDeliveries(deliveryStatus, topic);
    }

    private initializeDeliveryStatus(subscribers: Subscription<T>[]) {
        const deliveryStatus = new Map<string, DeliveryStatus>();

        subscribers.forEach(sub => {
            deliveryStatus.set(sub.id, { success: false, retries: 0 });
        });

        return deliveryStatus;
    }

    private async deliverToAllSubscribers(
        message: Message<T>,
        subscribers: Subscription<T>[],
        deliveryStatus: Map<string, DeliveryStatus>,
        topic: string
    ) {
        let hasMoreRetries = true;

        while (hasMoreRetries) {
            const pendingSubscribers = this.getPendingSubscribers(subscribers, deliveryStatus);

            if (pendingSubscribers.length === 0) {
                hasMoreRetries = false;
                continue;
            }

            await this.attemptDelivery(message, pendingSubscribers, deliveryStatus, topic);
        }
    }

    private getPendingSubscribers(
        subscribers: Subscription<T>[],
        deliveryStatus: Map<string, DeliveryStatus>
    ): Subscription<T>[] {
        return subscribers.filter(sub => {
            const status = deliveryStatus.get(sub.id)!;
            return !status.success && status.retries < this.maxRetries;
        });
    }

    private async attemptDelivery(
        message: Message<T>,
        subscribers: Subscription<T>[],
        deliveryStatus: Map<string, DeliveryStatus>,
        topic: string
    ): Promise<void> {
        await Promise.all(
            subscribers.map(sub => this.deliverToSubscriber(message, sub, deliveryStatus, topic))
        );
    }

    private async deliverToSubscriber(
        message: Message<T>,
        subscriber: Subscription<T>,
        deliveryStatus: Map<string, DeliveryStatus>,
        topic: string
    ): Promise<void> {
        const status = deliveryStatus.get(subscriber.id)!;

        try {
            await subscriber.handler(message);
            status.success = true;
        } catch (error) {
            status.retries++;

            if (status.retries >= this.maxRetries) {
                console.error(
                    `Failed to deliver message to subscriber ${subscriber.id} in topic ${topic} after ${this.maxRetries} retries:`,
                    error
                );
            } else {
                await this.delay(this.retryDelay);
            }
        }
        deliveryStatus.set(subscriber.id, status);
    }

    private logFailedDeliveries(deliveryStatus: Map<string, DeliveryStatus>, topic: string): void {
        deliveryStatus.forEach((status, subId) => {
            if (!status.success) {
                console.warn(`Message delivery failed for subscriber ${subId} in topic ${topic}`);
            }
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    clearTopic(topic: string): void {
        this.queues.delete(topic);
        this.subscriptions.delete(topic);
    }
}
