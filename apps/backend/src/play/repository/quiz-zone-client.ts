import { Injectable } from "@nestjs/common";
import { firstValueFrom } from 'rxjs';
import {IQuizZoneClient} from "./quiz-zone-client.interface";
import { QuizZone } from "src/quiz-zone/entities/quiz-zone.entity";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class QuizZoneClient implements IQuizZoneClient {
    private readonly baseUrl: string ="http://url"; // TODO: url 수정 필요

    constructor(
        private readonly httpService: HttpService,
    ) {
        // this.baseUrl = this.configService.get<string>('QUIZ_ZONE_SERVER_URL');
    }

    async findOne(quizZoneId: string): Promise<QuizZone> {
        const { data } = await firstValueFrom(
            this.httpService.get<QuizZone>(`${this.baseUrl}/quiz-zone/${quizZoneId}`)
        );
        return data;
    }

    async clearQuizZone(quizZoneId: string): Promise<void> {
        await firstValueFrom(
            this.httpService.delete(`${this.baseUrl}/quiz-zone/${quizZoneId}`)
        );
    }

    async updateQuizZone(quizZoneId: string, quizZone: QuizZone): Promise<void> {
        await firstValueFrom(
            this.httpService.patch(`${this.baseUrl}/quiz-zone/${quizZoneId}`, quizZone)
        );
    }
}
