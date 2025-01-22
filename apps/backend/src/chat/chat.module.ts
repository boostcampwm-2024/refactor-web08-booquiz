import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatRepositoryMemory } from './repository/chat.memory.repository';
import { ChatService } from './chat.service';
import { MessageBroker } from '../core/pub-sub/message-broker';

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
            useClass: MessageBroker,
        }
    ],
    exports: [ChatService],
})
export class ChatModule {}
