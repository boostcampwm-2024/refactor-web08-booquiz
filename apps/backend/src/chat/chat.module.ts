import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatRepositoryMemory } from './repository/chat.memory.repository';
import { ChatService } from './chat.service';
import { ReactiveMessageBroker } from '../core/pub-sub/reactive-message-broker';

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
            provide: 'PubSub',
            useClass: ReactiveMessageBroker,
        }
    ],
    exports: [ChatService],
})
export class ChatModule {}
