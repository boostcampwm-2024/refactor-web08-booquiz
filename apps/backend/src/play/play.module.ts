import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import { QuizZoneModule } from '../quiz-zone/quiz-zone.module';
import { ChatModule } from 'src/chat/chat.module';
import {HttpModule} from "@nestjs/axios";
import {QuizZoneClient} from "./repository/quiz-zone-client";
@Module({
    imports: [QuizZoneModule, ChatModule, HttpModule],
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
        PlayService,
        {
            provide: 'QuizZoneClient',
            useClass: QuizZoneClient,
        }
    ],
})
export class PlayModule {}
