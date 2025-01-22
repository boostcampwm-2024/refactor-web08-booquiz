import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import { QuizZoneModule } from '../quiz-zone/quiz-zone.module';
import { ChatModule } from 'src/chat/chat.module';
import { ReactiveMessageBroker } from '../core/pub-sub/reactive-message-broker';

@Module({
    imports: [QuizZoneModule, ChatModule],
    providers: [
        PlayGateway,
        {
            provide: 'PlayInfoStorage',
            useValue: new Map(),
        },
        {
            provide: 'ClientInfoStorage',
            useValue: new Map(),
        },
        {
            provide: 'PubSub',
            useValue: new ReactiveMessageBroker,
        },
        PlayService,
    ],
    exports: [PlayService]
})
export class PlayModule {}
