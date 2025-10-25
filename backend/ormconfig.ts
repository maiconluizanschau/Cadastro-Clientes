import { DataSource } from 'typeorm';
import { Client } from './src/modules/clients/entities/client.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASS || 'postgres',
  database: process.env.DATABASE_NAME || 'clientes',
  entities: [Client],
  synchronize: true, // DEV somente
});
