import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FechaDto } from './fecha.dto';

export class CreateEventoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ValidateNested()
  @Type(() => FechaDto)
  fecha: FechaDto;

  @IsInt()
  @Min(0)
  aforo: number;
}
