import {QuizSetDetailsResponseDto} from "./quiz-set-details.response.dto";

export interface SearchQuizSetResponseDto {
    readonly quizSetDetails: QuizSetDetailsResponseDto[];
    readonly total: number;
    readonly currentPage: number;
}

