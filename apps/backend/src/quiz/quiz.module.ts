import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entity/quiz.entitiy';
import { QuizSet } from './entity/quiz-set.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizRepository } from './repository/quiz.repository';
import { QuizSetRepository } from './repository/quiz-set.repository';
import { QuizSetController } from './quiz-set.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz, QuizSet])],
    controllers: [QuizController, QuizSetController],
    providers: [QuizService, QuizRepository, QuizSetRepository],
    exports: [QuizService],
})
export class QuizModule {}
