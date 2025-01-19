/**
 * 퀴즈존을 생성할 때 사용하는 DTO 클래스
 *
 * 퀴즈존 ID는 다음 규칙을 따릅니다:
 * - 5-10글자 길이
 * - 숫자와 알파벳 조합
 * - 중복 불가 (중복 체크 로직 추가 예정)
 */

export class CreateQuizZoneDto {
    readonly quizZoneId: string;
    readonly title: string;
    readonly description: string;
    readonly limitPlayerCount: number;
    readonly quizSetId: number;
}
