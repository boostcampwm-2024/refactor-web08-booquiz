import {QuizDetailsResponseDto} from "./quiz-details.response.dto";

export interface RequestCreateQuizSet {
    quizSetName: string;
    quizDetails: QuizDetailsResponseDto[];
    recommended?: boolean;
}
