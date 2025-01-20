import {QuizSet} from "@web08-booquiz/shared";

export class SearchQuizSetResponseDTO {

    readonly quizSetDetails: QuizSetDetails[];
    readonly total: number;
    readonly currentPage: number;
}

export class QuizSetDetails {
    readonly id: number;
    readonly name: string;

    static from(quizSet : QuizSet) : QuizSetDetails {
        return {
            id: quizSet.id,
            name: quizSet.name,
        };
    }
}