import { IsString, IsNotEmpty, IsOptional, IsISO8601 } from 'class-validator';

export class CreateRegistroDto {
  @IsString()
  @IsNotEmpty()
  eventoId: string;

  @IsString()
  @IsNotEmpty()
  participanteId: string;

  @IsOptional()
  @IsISO8601()
  fechaAsistencia?: string;
}
