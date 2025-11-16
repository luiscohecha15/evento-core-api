import { IsInt, Min, Max } from 'class-validator';

export class FechaDto {
  @IsInt()
  @Min(1)
  @Max(31)
  dia: number;

  @IsInt()
  @Min(1)
  @Max(12)
  mes: number;

  @IsInt()
  @Min(2000)
  año: number;
}
