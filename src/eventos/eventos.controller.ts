import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { RegistroAsistenciaService } from '../registro-asistencia/registro-asistencia.service';

@Controller('eventos')
export class EventosController {
  constructor(
    private readonly eventosService: EventosService,
    private readonly registroService: RegistroAsistenciaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.create(createEventoDto);
  }

  @Get('estadisticas')
  statsAll() {
    return this.registroService.statsAllEvents();
  }

  @Get()
  findAll() {
    return this.eventosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventosService.findOne(id);
  }

  @Get(':id/estadisticas')
  statsForEvento(@Param('id') id: string) {
    return this.registroService.statsForEvento(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateEventoDto) {
    return this.eventosService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventosService.remove(id);
  }
}
