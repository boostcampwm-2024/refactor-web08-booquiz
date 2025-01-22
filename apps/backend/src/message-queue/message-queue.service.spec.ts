import { Test, TestingModule } from '@nestjs/testing';
import { MessageQueueService } from './message-queue.service';

describe('MessageQueueService', () => {
  let service: MessageQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageQueueService],
    }).compile();

    service = module.get<MessageQueueService>(MessageQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
