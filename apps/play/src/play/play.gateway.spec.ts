import { Test, TestingModule } from '@nestjs/testing';
import { PlayGateway } from './play.gateway';
import { PlayService } from './play.service';


describe('PlayGateway', () => {
  let gateway: PlayGateway;

  const mockPlayService = {
    join: jest.fn(),
  };

  const mockQuizZoneService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayGateway,
        {
          provide: PlayService,
          useValue: mockPlayService,
        },
        {
          provide: 'PlayInfoStorage',
          useValue: new Map(),
        },
        {
          provide: 'ClientInfoStorage',
          useValue: new Map(),
        },

      ],
    }).compile();

    gateway = module.get<PlayGateway>(PlayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
