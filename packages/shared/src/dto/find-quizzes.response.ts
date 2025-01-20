import {QUIZ_TYPE} from "../constants";

export interface FindQuizzesResponse {
    question: string;
    answer: string;
    playTime: number;
    quizType: QUIZ_TYPE;
    id: number;
}
