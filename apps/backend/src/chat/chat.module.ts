import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatRepositoryMemory } from './repository/chat.memory.repository';
import { ChatService } from './chat.service';
import { ReactiveMessageBroker } from '@web08-booquiz/shared';

@Module({
    controllers: [ChatController],
    providers: [
        ChatService,
        {
            provide: 'ChatStorage',
            useValue: new Map(),
        },
        {
            provide: 'ChatRepository',
            useClass: ChatRepositoryMemory,
        },
        {
            provide: 'Broker',
            useClass: ReactiveMessageBroker,
        }
    ],
    exports: [ChatService],
})
export class ChatModule {}
