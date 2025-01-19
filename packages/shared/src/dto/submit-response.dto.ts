interface ChatMessage {
}

export interface SubmitResponseDto {
    fastestPlayerIds: string[],
    submittedCount: number,
    totalPlayerCount: number,
    chatMessages: ChatMessage[],
}
