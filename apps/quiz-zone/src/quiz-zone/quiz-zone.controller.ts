import { Controller } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';

@Controller('quiz-zone')
export class QuizZoneController {
    constructor(private readonly quizZoneService: QuizZoneService) {}
}