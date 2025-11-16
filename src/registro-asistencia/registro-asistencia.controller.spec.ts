import { Test, TestingModule } from '@nestjs/testing';
import { RegistroAsistenciaController } from './registro-asistencia.controller';
import { RegistroAsistenciaService } from './registro-asistencia.service';

const mockService = {} as Partial<RegistroAsistenciaService>;

describe('RegistroAsistenciaController', () => {
  let controller: RegistroAsistenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroAsistenciaController],
      providers: [
        { provide: RegistroAsistenciaService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<RegistroAsistenciaController>(
      RegistroAsistenciaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
