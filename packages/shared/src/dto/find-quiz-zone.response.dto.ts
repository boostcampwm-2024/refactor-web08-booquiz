import {QUIZ_ZONE_STAGE} from "../constants";
import {ResponseCurrentQuiz} from "./current-quiz.response.dto";
import {Rank} from "../entities/rank.entity";
import {Quiz} from "../entities/quiz.entity";
import {SubmittedQuiz} from "../entities/submitted-quiz.entity";
import {Player} from "../entities/player.entity";
import {ChatMessage} from "../entities/chat-message.entity";

/**
 * 퀴즈 존을 찾기 위한 DTO
 *
 * @property currentPlayer - 현재 플레이어
 * @property title - 퀴즈 존의 제목
 * @property description - 퀴즈 존의 설명
 * @property quizCount - 퀴즈 존의 퀴즈 개수
 * @property stage - 퀴즈 존의 진행 상태
 * @property hostId - 퀴즈 존의 호스트 ID
 * @property currentQuiz - 현재 출제 중인 퀴즈
 * @property maxPlayers - 퀴즈 존의 최대 플레이어 수
 */
export interface ResponseFindQuizZone {
    readonly currentPlayer: Player;
    readonly title: string;
    readonly description: string;
    readonly quizCount: number;
    readonly stage: QUIZ_ZONE_STAGE;
    readonly hostId: string;
    readonly currentQuiz?: ResponseCurrentQuiz;
    readonly maxPlayers?: number;
    readonly chatMessages?: ChatMessage[];

    readonly ranks?: Rank[];
    readonly endSocketTime?: number;
    readonly score?: number;
    readonly quizzes?: Quiz[];
    readonly submits?: SubmittedQuiz[];
}
