import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizZoneModule } from './quiz-zone/quiz-zone.module';
import { RedisModule } from './redis/redis.module';
import { CustomHttpModule } from './http/http.module';

@Module({
  imports: [QuizZoneModule, RedisModule, CustomHttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
