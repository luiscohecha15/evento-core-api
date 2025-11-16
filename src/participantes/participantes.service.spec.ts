import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantesService } from './participantes.service';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockModel = {
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};
const mockCache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

describe('ParticipantesService', () => {
  let service: ParticipantesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantesService,
        { provide: getModelToken('Participante'), useValue: mockModel },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<ParticipantesService>(ParticipantesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
