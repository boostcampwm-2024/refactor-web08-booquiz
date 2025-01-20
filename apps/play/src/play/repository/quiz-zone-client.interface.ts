import {QuizZone} from "@web08-booquiz/shared";

export interface IQuizZoneClient {

    findOne(quizZoneId: string): Promise<QuizZone>;

    clearQuizZone(quizZoneId: string): Promise<void>;

    updateQuizZone(quizZoneId: string, quizZone: QuizZone): Promise<void>;
}
