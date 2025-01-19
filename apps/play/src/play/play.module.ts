import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import {HttpModule} from "@nestjs/axios";
import {QuizZoneClient} from "./repository/quiz-zone-client";
@Module({
  imports: [HttpModule],
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
