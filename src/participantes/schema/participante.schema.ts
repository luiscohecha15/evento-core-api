import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Participante {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  email: string;
}

export type ParticipanteDocument = Participante & Document;
export const ParticipanteSchema = SchemaFactory.createForClass(Participante);
