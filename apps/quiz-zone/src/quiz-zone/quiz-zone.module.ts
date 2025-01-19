import { Module } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneRedisRepository } from './quiz-zone.redis.repository';
import { CustomHttpModule } from '../http/http.module';
import { CustomHttpService } from '../http/http.service';

@Module({
    imports: [CustomHttpModule],
    controllers: [QuizZoneController],
    providers: [
        QuizZoneService,
        {
            provide: 'QuizZoneRepository',
            useClass: QuizZoneRedisRepository,
        },
    ],
    exports: [QuizZoneService],
})
export class QuizZoneModule {}