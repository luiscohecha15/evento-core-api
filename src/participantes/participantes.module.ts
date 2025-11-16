import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantesService } from './participantes.service';
import { ParticipantesController } from './participantes.controller';
import { Participante, ParticipanteSchema } from './schema/participante.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participante.name, schema: ParticipanteSchema },
    ]),
  ],
  providers: [ParticipantesService],
  controllers: [ParticipantesController],
})
export class ParticipantesModule {}
