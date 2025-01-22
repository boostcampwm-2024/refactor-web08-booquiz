import { Module } from '@nestjs/common';
import { MessageQueueService } from './message-queue.service';

@Module({
    providers: [{
        provide: MessageQueueService,
        useFactory: () => {
            return new MessageQueueService(3, 1000);
        }
    }],
    exports: [MessageQueueService],
})
export class MessageQueueModule {}
