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
import {
  Participante,
  ParticipanteDocument,
} from './schema/participante.schema';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';

@Injectable()
export class ParticipantesService {
  constructor(
    @InjectModel(Participante.name)
    private participanteModel: Model<ParticipanteDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly PARTICIPANTES_CACHE_KEY = 'participantes_all';
  private getParticipanteCacheKey(id: string) {
    return `participante_${id}`;
  }

  async create(
    createDto: CreateParticipanteDto,
  ): Promise<ParticipanteDocument> {
    // Optionally prevent duplicate emails
    const exists = await this.participanteModel
      .findOne({ email: createDto.email })
      .exec();
    if (exists) throw new BadRequestException('Email ya registrado');

    const created = new this.participanteModel(createDto);
    const saved = await created.save();

    // Invalidar caché al crear
    await this.cacheManager.del(this.PARTICIPANTES_CACHE_KEY);
    console.log(
      '🗑️  [ParticipantesService] Invalidating participantes cache on CREATE',
    );

    return saved;
  }

  async findAll(): Promise<ParticipanteDocument[]> {
    // Intentar obtener del caché
    const cached = await this.cacheManager.get<ParticipanteDocument[]>(
      this.PARTICIPANTES_CACHE_KEY,
    );
    if (cached) {
      console.log(
        '✅ [ParticipantesService] Returning participantes FROM REDIS CACHE',
      );
      return cached;
    }

    // Si no está en caché, obtener de BD
    console.log(
      '📊 [ParticipantesService] Fetching participantes FROM DATABASE',
    );
    const participantes = await this.participanteModel.find().exec();

    // Guardar en caché
    await this.cacheManager.set(this.PARTICIPANTES_CACHE_KEY, participantes);
    console.log('💾 [ParticipantesService] Caching participantes in REDIS');

    return participantes;
  }

  async findOne(id: string): Promise<ParticipanteDocument> {
    const cacheKey = this.getParticipanteCacheKey(id);

    // Intentar obtener del caché
    const cached = await this.cacheManager.get<ParticipanteDocument>(cacheKey);
    if (cached) {
      console.log(
        `✅ [ParticipantesService] Returning participante ${id} FROM REDIS CACHE`,
      );
      return cached;
    }

    // Si no está en caché, obtener de BD
    console.log(
      `📊 [ParticipantesService] Fetching participante ${id} FROM DATABASE`,
    );
    const p = await this.participanteModel.findById(id).exec();
    if (!p) throw new NotFoundException('Participante no encontrado');

    // Guardar en caché
    await this.cacheManager.set(cacheKey, p);
    console.log(
      `💾 [ParticipantesService] Caching participante ${id} in REDIS`,
    );

    return p;
  }

  async update(
    id: string,
    updateDto: UpdateParticipanteDto,
  ): Promise<ParticipanteDocument> {
    if (updateDto.email) {
      const exists = await this.participanteModel
        .findOne({ email: updateDto.email, _id: { $ne: id } })
        .exec();
      if (exists) throw new BadRequestException('Email ya registrado');
    }

    const updated = await this.participanteModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Participante no encontrado');

    // Invalidar caché al actualizar
    await this.cacheManager.del(this.PARTICIPANTES_CACHE_KEY);
    await this.cacheManager.del(this.getParticipanteCacheKey(id));
    console.log(
      `🗑️  [ParticipantesService] Invalidating participantes cache on UPDATE for participante ${id}`,
    );

    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.participanteModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Participante no encontrado');

    // Invalidar caché al eliminar
    await this.cacheManager.del(this.PARTICIPANTES_CACHE_KEY);
    await this.cacheManager.del(this.getParticipanteCacheKey(id));
    console.log(
      `🗑️  [ParticipantesService] Invalidating participantes cache on DELETE for participante ${id}`,
    );
  }
}
