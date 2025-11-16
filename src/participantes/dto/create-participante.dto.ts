import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateParticipanteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;
}
