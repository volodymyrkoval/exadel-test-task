import { MongoClient, MongoNetworkError } from 'mongodb';
import { Logger } from '@overnightjs/logger';

const config = require('config');

abstract class MongodbClientAbstract {
  private mongoClient = MongoClient;

  private host: string = config.get('mongo.host');

  private port: string = config.get('mongo.port');

  private user: string = config.get('mongo.user');

  private pass: string = config.get('mongo.pass');

  protected readonly connection;

  constructor() {
    this.connection = this.createConnectionsPool();
  }

  private getConnectionURL(): string {
    return `mongodb://${this.user}:${this.pass}@${this.host}:${this.port}`;
  }

  private async createConnectionsPool() {
    const connectionURL = this.getConnectionURL();

    return this.mongoClient.connect(connectionURL).catch((err) => {
      Logger.Err(err);
      throw new MongoNetworkError(err);
    });
  }
}

export default MongodbClientAbstract;
