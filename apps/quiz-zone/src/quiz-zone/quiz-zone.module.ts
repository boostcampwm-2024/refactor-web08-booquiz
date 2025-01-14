import { Module } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { QuizZoneController } from './quiz-zone.controller';

@Module({
    imports: [],
    controllers: [QuizZoneController],
    providers: [QuizZoneService],
})
export class QuizZoneModule {}