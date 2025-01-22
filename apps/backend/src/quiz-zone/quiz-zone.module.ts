import { forwardRef, Module } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneRepositoryMemory } from './repository/quiz-zone.memory.repository';
import { QuizModule } from '../quiz/quiz.module';
import { ChatModule } from 'src/chat/chat.module';
import { PlayModule } from '../play/play.module';

@Module({
    controllers: [QuizZoneController],
    imports: [QuizModule, ChatModule, forwardRef(() => PlayModule)],
    providers: [
        QuizZoneService,
        {
            provide: 'QuizZoneRepository',
            useClass: QuizZoneRepositoryMemory,
        },
        {
            provide: 'QuizZoneStorage',
            useValue: new Map(),
        },
    ],
    exports: [QuizZoneService],
})
export class QuizZoneModule {}
