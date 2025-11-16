import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Evento {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, type: Date })
  fecha: Date;

  @Prop({ required: true, min: 0 })
  aforo: number;
}

export type EventoDocument = Evento & Document;
export const EventoSchema = SchemaFactory.createForClass(Evento);
