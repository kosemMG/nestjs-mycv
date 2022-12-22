const ormConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations'
  }
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(ormConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js']
    });
    break;
  case 'test':
    Object.assign(ormConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true
    });
    break;
  case 'production':
    Object.assign(ormConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['**/*.entity.js'],
      migrationsRun: true,
      ssl: { rejectUnauthorized: false }
    });
    break;
  default:
    throw new Error('Unknown environment');
}

module.exports = ormConfig;