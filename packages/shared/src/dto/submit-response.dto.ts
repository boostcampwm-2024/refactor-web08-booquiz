
export class SubmitResponseDto {
    constructor(
        public readonly fastestPlayerIds: string[],
        public readonly submittedCount: number,
        public readonly totalPlayerCount: number,
        public readonly chatMessages: ChatMessage[],
    ) {}
}
