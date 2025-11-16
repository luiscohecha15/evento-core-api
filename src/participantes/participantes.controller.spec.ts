import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantesController } from './participantes.controller';
import { ParticipantesService } from './participantes.service';

const mockService = {} as Partial<ParticipantesService>;

describe('ParticipantesController', () => {
  let controller: ParticipantesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipantesController],
      providers: [{ provide: ParticipantesService, useValue: mockService }],
    }).compile();

    controller = module.get<ParticipantesController>(ParticipantesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
