import { Test, TestingModule } from '@nestjs/testing';
import { RegistroAsistenciaService } from './registro-asistencia.service';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockRegistroModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};
const mockEventoModel = { findById: jest.fn(), find: jest.fn() };
const mockParticipanteModel = { findById: jest.fn() };
const mockCache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

describe('RegistroAsistenciaService', () => {
  let service: RegistroAsistenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistroAsistenciaService,
        {
          provide: getModelToken('RegistroAsistencia'),
          useValue: mockRegistroModel,
        },
        { provide: getModelToken('Evento'), useValue: mockEventoModel },
        {
          provide: getModelToken('Participante'),
          useValue: mockParticipanteModel,
        },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<RegistroAsistenciaService>(RegistroAsistenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
