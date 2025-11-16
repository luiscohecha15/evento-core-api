import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ParticipantesService } from './participantes.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';

@Controller('participantes')
export class ParticipantesController {
  constructor(private readonly participantesService: ParticipantesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateParticipanteDto) {
    return this.participantesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.participantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateParticipanteDto) {
    return this.participantesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.participantesService.remove(id);
  }
}
