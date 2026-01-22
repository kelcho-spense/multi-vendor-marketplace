import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables for CLI usage
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'onlineshops',
    synchronize: false, // Always false for migrations
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl:
        process.env.DATABASE_SSL === 'true'
            ? { rejectUnauthorized: false }
            : false,
    entities: ['src/database/entities/**/*.entity.ts'],
    migrations: ['src/database/migrations/**/*.ts'],
    migrationsTableName: 'migrations',
};

// DataSource instance for TypeORM CLI
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
