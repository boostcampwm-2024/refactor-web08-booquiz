import { IQuizZoneRepository } from './quiz-zone.repository.interface';
import { RedisService } from '../redis/redis.service';
import { QuizZone } from '@web08-booquiz/shared';

export class QuizZoneRedisRepository implements IQuizZoneRepository {
  constructor(private readonly redisService: RedisService) {}

  async get(key: string): Promise<QuizZone | null> {
    return JSON.parse(await this.redisService.get(key));
  }
  async set(key: string, value: QuizZone): Promise<void> {
    await this.redisService.set(key, JSON.stringify(value));
  }
  async delete(key: string): Promise<void> {
    await this.redisService.del(key);
  }
  async has(key: string): Promise<boolean> {
    return await this.redisService.exists(key) > 0;
  }
}