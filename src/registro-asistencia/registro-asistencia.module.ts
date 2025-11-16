import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistroAsistenciaService } from './registro-asistencia.service';
import { RegistroAsistenciaController } from './registro-asistencia.controller';
import {
  RegistroAsistencia,
  RegistroAsistenciaSchema,
} from './schema/registro.schema';
import { Evento, EventoSchema } from '../eventos/schema/evento.schema';
import {
  Participante,
  ParticipanteSchema,
} from '../participantes/schema/participante.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RegistroAsistencia.name, schema: RegistroAsistenciaSchema },
      { name: Evento.name, schema: EventoSchema },
      { name: Participante.name, schema: ParticipanteSchema },
    ]),
  ],
  providers: [RegistroAsistenciaService],
  controllers: [RegistroAsistenciaController],
  exports: [RegistroAsistenciaService],
})
export class RegistroAsistenciaModule {}
