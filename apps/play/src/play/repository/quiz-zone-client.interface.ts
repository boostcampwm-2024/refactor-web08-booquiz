import { QuizZone } from "src/quiz-zone/entities/quiz-zone.entity";

export interface IQuizZoneClient {

    findOne(quizZoneId: string): Promise<QuizZone>;

    clearQuizZone(quizZoneId: string): Promise<void>;

    updateQuizZone(quizZoneId: string, quizZone: QuizZone): Promise<void>;
}
