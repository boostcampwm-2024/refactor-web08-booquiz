import {QUIZ_TYPE} from "../constants";

export interface UpdateQuizRequestDto {
    question: string;
    answer: string;
    playTime: number;
    quizType: QUIZ_TYPE;
}
