const NodeEnvironment = require('jest-environment-node');
const MongoMemoryServer = require('mongodb-memory-server').default;

process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '27017';
process.env.DB_DATABASE = 'power-cms';
process.env.ACCESS_TOKEN_SECRET = 'power-cms-access';
process.env.REFRESH_TOKEN_SECRET = 'power-cms-refresh';

class JestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    this.mongo = new MongoMemoryServer({
      instance: {
        port: Number(process.env.DB_PORT),
        dbName: process.env.DB_DATABASE,
      },
      autoStart: false,
    });

    await this.mongo.start();
  }

  async teardown() {
    await this.mongo.stop();
    await super.teardown();
  }
}

module.exports = JestEnvironment;
