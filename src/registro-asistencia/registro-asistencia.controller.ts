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
import { RegistroAsistenciaService } from './registro-asistencia.service';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';

@Controller('registro-asistencia')
export class RegistroAsistenciaController {
  constructor(private readonly registroService: RegistroAsistenciaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateRegistroDto) {
    return this.registroService.create(createDto);
  }

  @Get()
  findAll() {
    return this.registroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registroService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateRegistroDto) {
    return this.registroService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.registroService.remove(id);
  }
}
