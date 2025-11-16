import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
  RegistroAsistencia,
  RegistroAsistenciaDocument,
} from './schema/registro.schema';
import { Evento, EventoDocument } from '../eventos/schema/evento.schema';
import {
  Participante,
  ParticipanteDocument,
} from '../participantes/schema/participante.schema';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';

@Injectable()
export class RegistroAsistenciaService {
  constructor(
    @InjectModel(RegistroAsistencia.name)
    private registroModel: Model<RegistroAsistenciaDocument>,
    @InjectModel(Evento.name) private eventoModel: Model<EventoDocument>,
    @InjectModel(Participante.name)
    private participanteModel: Model<ParticipanteDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly REGISTROS_CACHE_KEY = 'registros_all';
  private getRegistroCacheKey(id: string) {
    return `registro_${id}`;
  }

  async create(
    createDto: CreateRegistroDto,
  ): Promise<RegistroAsistenciaDocument> {
    const evento = await this.eventoModel.findById(createDto.eventoId).exec();
    if (!evento) throw new NotFoundException('Evento no encontrado');

    const participante = await this.participanteModel
      .findById(createDto.participanteId)
      .exec();
    if (!participante)
      throw new NotFoundException('Participante no encontrado');

    // Obtener o crear registro de asistencia para este evento
    const registro = await this.registroModel
      .findOne({ evento: evento._id })
      .exec();

    // Verificar si participante ya está en este evento
    if (registro) {
      const yaRegistrado = registro.asistentes.some(
        (a) => a.participante.toString() === String(participante._id),
      );
      if (yaRegistrado) {
        throw new BadRequestException(
          'Participante ya registrado en este evento',
        );
      }

      // Verificar aforo
      if (registro.asistentes.length >= evento.aforo) {
        throw new BadRequestException('Aforo completo para este evento');
      }

      // Añadir participante al array
      registro.asistentes.push({
        participante: new Types.ObjectId(createDto.participanteId),
        fechaAsistencia: createDto.fechaAsistencia
          ? new Date(createDto.fechaAsistencia)
          : new Date(),
      });

      const saved = await registro.save();

      // Invalidar caché al crear
      await this.cacheManager.del(this.REGISTROS_CACHE_KEY);
      console.log(
        '🗑️  [RegistroAsistenciaService] Invalidating registros cache on CREATE',
      );

      return saved;
    }

    // Crear nuevo registro si no existe para este evento
    const nuevoRegistro = new this.registroModel({
      evento: new Types.ObjectId(createDto.eventoId),
      asistentes: [
        {
          participante: new Types.ObjectId(createDto.participanteId),
          fechaAsistencia: createDto.fechaAsistencia
            ? new Date(createDto.fechaAsistencia)
            : new Date(),
        },
      ],
    });

    const saved = await nuevoRegistro.save();

    // Invalidar caché al crear
    await this.cacheManager.del(this.REGISTROS_CACHE_KEY);
    console.log(
      '🗑️  [RegistroAsistenciaService] Invalidating registros cache on CREATE',
    );

    return saved;
  }

  async findAll(): Promise<RegistroAsistenciaDocument[]> {
    // Intentar obtener del caché
    const cached = await this.cacheManager.get<RegistroAsistenciaDocument[]>(
      this.REGISTROS_CACHE_KEY,
    );
    if (cached) {
      console.log(
        '✅ [RegistroAsistenciaService] Returning registros FROM REDIS CACHE',
      );
      return cached;
    }

    // Si no está en caché, obtener de BD
    console.log(
      '📊 [RegistroAsistenciaService] Fetching registros FROM DATABASE',
    );
    const registros = await this.registroModel
      .find()
      .populate('evento asistentes.participante')
      .exec();

    // Guardar en caché
    await this.cacheManager.set(this.REGISTROS_CACHE_KEY, registros);
    console.log('💾 [RegistroAsistenciaService] Caching registros in REDIS');

    return registros;
  }

  async findOne(id: string): Promise<RegistroAsistenciaDocument> {
    const cacheKey = this.getRegistroCacheKey(id);

    // Intentar obtener del caché
    const cached =
      await this.cacheManager.get<RegistroAsistenciaDocument>(cacheKey);
    if (cached) {
      console.log(
        `✅ [RegistroAsistenciaService] Returning registro ${id} FROM REDIS CACHE`,
      );
      return cached;
    }

    // Si no está en caché, obtener de BD
    console.log(
      `📊 [RegistroAsistenciaService] Fetching registro ${id} FROM DATABASE`,
    );
    const reg = await this.registroModel
      .findById(id)
      .populate('evento asistentes.participante')
      .exec();
    if (!reg) throw new NotFoundException('Registro no encontrado');

    // Guardar en caché
    await this.cacheManager.set(cacheKey, reg);
    console.log(
      `💾 [RegistroAsistenciaService] Caching registro ${id} in REDIS`,
    );

    return reg;
  }

  async update(
    id: string,
    updateDto: UpdateRegistroDto,
  ): Promise<RegistroAsistenciaDocument> {
    const updated = await this.registroModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Registro no encontrado');

    // Invalidar caché al actualizar
    await this.cacheManager.del(this.REGISTROS_CACHE_KEY);
    await this.cacheManager.del(this.getRegistroCacheKey(id));
    console.log(
      `🗑️  [RegistroAsistenciaService] Invalidating registros cache on UPDATE for registro ${id}`,
    );

    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.registroModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Registro no encontrado');

    // Invalidar caché al eliminar
    await this.cacheManager.del(this.REGISTROS_CACHE_KEY);
    await this.cacheManager.del(this.getRegistroCacheKey(id));
    console.log(
      `🗑️  [RegistroAsistenciaService] Invalidating registros cache on DELETE for registro ${id}`,
    );
  }

  // Estadísticas
  async statsForEvento(eventoId: string) {
    const evento = await this.eventoModel.findById(eventoId).exec();
    if (!evento) throw new NotFoundException('Evento no encontrado');

    const registro = await this.registroModel
      .findOne({ evento: evento._id })
      .exec();
    const inscritos = registro ? registro.asistentes.length : 0;
    const porcentaje =
      evento.aforo === 0
        ? 0
        : Number(((inscritos / evento.aforo) * 100).toFixed(2));

    return {
      eventoId: String(evento._id),
      nombre: evento.nombre,
      aforo: evento.aforo,
      inscritos,
      porcentaje,
    };
  }

  async statsAllEvents() {
    const eventos = await this.eventoModel.find().exec();

    const rows = await Promise.all(
      eventos.map(async (e) => {
        const registro = await this.registroModel
          .findOne({ evento: e._id })
          .exec();
        const inscritos = registro ? registro.asistentes.length : 0;
        const porcentaje =
          e.aforo === 0 ? 0 : Number(((inscritos / e.aforo) * 100).toFixed(2));
        return {
          eventoId: String(e._id),
          nombre: e.nombre,
          aforo: e.aforo,
          inscritos,
          porcentaje,
        };
      }),
    );
    // resumen global
    const totalAforo = rows.reduce((s, r) => s + (r.aforo ?? 0), 0);
    const totalInscritos = rows.reduce((s, r) => s + (r.inscritos ?? 0), 0);
    const ocupacionPromedio =
      totalAforo === 0
        ? 0
        : Number(((totalInscritos / totalAforo) * 100).toFixed(2));

    return {
      totalEventos: rows.length,
      totalAforo,
      totalInscritos,
      ocupacionPromedio,
      detalles: rows,
    };
  }
}
