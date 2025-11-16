import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class Asistente {
  @Prop({ type: Types.ObjectId, ref: 'Participante', required: true })
  participante: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  fechaAsistencia: Date;
}

@Schema({ timestamps: true })
export class RegistroAsistencia {
  @Prop({ type: Types.ObjectId, ref: 'Evento', required: true, unique: true })
  evento: Types.ObjectId;

  @Prop({ type: [Asistente], default: [] })
  asistentes: Asistente[];
}

export type RegistroAsistenciaDocument = RegistroAsistencia & Document;
export const RegistroAsistenciaSchema =
  SchemaFactory.createForClass(RegistroAsistencia);
