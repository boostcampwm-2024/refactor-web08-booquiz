import { QUIZ_TYPE } from '../../constant';

export class FindQuizzesResponseDto {
    readonly question: string;
    readonly answer: string;
    readonly playTime: number;
    readonly quizType: QUIZ_TYPE;
    readonly id: number;
}
