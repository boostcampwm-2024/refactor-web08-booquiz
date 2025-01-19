import {Quiz} from "./quiz.entity";

export interface QuizSet {
    id: number;
    name: string;
    recommended: boolean;
    quizzes: Quiz[];
}
