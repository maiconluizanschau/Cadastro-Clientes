import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './modules/clients/clients.module';
import ormconfig from '../ormconfig';
import { HealthModule } from './modules/health/health.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...ormconfig.options,
        autoLoadEntities: true,
      }),
    }),
    HealthModule,
    ClientsModule,
  ],
})
export class AppModule {}
