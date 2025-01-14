import { IQuizZoneRepository } from '@booquiz/shared/interface/quiz-zone.repository.interface';

export class QuizZoneRedisRepository implements IQuizZoneRepository {
  get(key: string): Promise<any | null> {
    throw new Error('Method not implemented.');
  }
  set(key: string, value: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  has(key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}