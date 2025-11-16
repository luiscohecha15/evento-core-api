import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Evento, EventoDocument } from './schema/evento.schema';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectModel(Evento.name) private eventoModel: Model<EventoDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly EVENTOS_CACHE_KEY = 'eventos_all';
  private getEventoCacheKey(id: string) {
    return `evento_${id}`;
  }

  async create(createEventoDto: CreateEventoDto): Promise<EventoDocument> {
    if (createEventoDto.aforo < 0) {
      throw new BadRequestException('Aforo debe ser mayor o igual a 0');
    }

    // Convert { dia, mes, año } to Date
    const { dia, mes, año } = createEventoDto.fecha;
    const fechaDate = new Date(año, mes - 1, dia); // mes es 0-indexed en JavaScript

    const created = new this.eventoModel({
      nombre: createEventoDto.nombre,
      fecha: fechaDate,
      aforo: createEventoDto.aforo,
    });
    const saved = await created.save();

    // Invalidar caché al crear
    await this.cacheManager.del(this.EVENTOS_CACHE_KEY);
    console.log('🗑️  [EventosService] Invalidating eventos cache on CREATE');

    return saved;
  }

  async findAll(): Promise<EventoDocument[]> {
    // Intentar obtener del caché
    const cached = await this.cacheManager.get<EventoDocument[]>(
      this.EVENTOS_CACHE_KEY,
    );
    if (cached) {
      console.log('✅ [EventosService] Returnig eventos FROM REDIS CACHE');
      return cached;
    }

    // Si no está en caché, obtener de BD
    console.log('📊 [EventosService] Fetching eventos FROM DATABASE');
    const eventos = await this.eventoModel.find().exec();

    // Guardar en caché (TTL por defecto del módulo)
    await this.cacheManager.set(this.EVENTOS_CACHE_KEY, eventos);
    console.log('💾 [EventosService] Caching eventos in REDIS');

    return eventos;
  }

  async findOne(id: string): Promise<EventoDocument> {
    const cacheKey = this.getEventoCacheKey(id);

    // Intentar obtener del caché
    const cached = await this.cacheManager.get<EventoDocument>(cacheKey);
    if (cached) {
      console.log(
        `✅ [EventosService] Returning evento ${id} FROM REDIS CACHE`,
      );
      return cached;
    }

    // Si no está en caché, obtener de BD
    console.log(`📊 [EventosService] Fetching evento ${id} FROM DATABASE`);
    const evt = await this.eventoModel.findById(id).exec();
    if (!evt) throw new NotFoundException('Evento no encontrado');

    // Guardar en caché
    await this.cacheManager.set(cacheKey, evt);
    console.log(`💾 [EventosService] Caching evento ${id} in REDIS`);

    return evt;
  }

  async update(
    id: string,
    updateEventoDto: UpdateEventoDto,
  ): Promise<EventoDocument> {
    if (updateEventoDto.aforo !== undefined && updateEventoDto.aforo < 0) {
      throw new BadRequestException('Aforo debe ser mayor o igual a 0');
    }

    const updated = await this.eventoModel
      .findByIdAndUpdate(id, { $set: updateEventoDto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Evento no encontrado');

    // Invalidar caché al actualizar
    await this.cacheManager.del(this.EVENTOS_CACHE_KEY);
    await this.cacheManager.del(this.getEventoCacheKey(id));
    console.log(
      `🗑️  [EventosService] Invalidating eventos cache on UPDATE for evento ${id}`,
    );

    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.eventoModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Evento no encontrado');

    // Invalidar caché al eliminar
    await this.cacheManager.del(this.EVENTOS_CACHE_KEY);
    await this.cacheManager.del(this.getEventoCacheKey(id));
    console.log(
      `🗑️  [EventosService] Invalidating eventos cache on DELETE for evento ${id}`,
    );
  }
}
