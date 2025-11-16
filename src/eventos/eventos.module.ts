import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { Evento, EventoSchema } from './schema/evento.schema';
import { RegistroAsistenciaModule } from '../registro-asistencia/registro-asistencia.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Evento.name, schema: EventoSchema }]),
    RegistroAsistenciaModule,
  ],
  providers: [EventosService],
  controllers: [EventosController],
})
export class EventosModule {}
