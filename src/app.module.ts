import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventosModule } from './eventos/eventos.module';
import { ParticipantesModule } from './participantes/participantes.module';
import { RegistroAsistenciaModule } from './registro-asistencia/registro-asistencia.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stores: redisStore as any,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 600, // 10 minutos por defecto
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/eventi-core-api',
    ),
    EventosModule,
    ParticipantesModule,
    RegistroAsistenciaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
