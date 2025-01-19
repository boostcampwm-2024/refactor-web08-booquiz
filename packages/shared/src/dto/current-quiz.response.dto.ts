import {QUIZ_ZONE_STAGE} from "../constants";

export interface ResponseCurrentQuiz {
    readonly question: string;
    readonly stage: QUIZ_ZONE_STAGE;
    readonly currentIndex: number;
    readonly playTime: number;
    readonly startTime: number;
    readonly deadlineTime: number;
}
