import MongodbClientAbstract from '../mongodb/mongodbClient.abstract';
import { Series as ISeries } from '../../types/analytics/series';
import { AnalyticsRepository as IAnalyticsRepository } from '../../types/analytics/analyticsRepository';
import Series from './entities/series';

const config = require('config');

class AnalyticsRepository extends MongodbClientAbstract implements IAnalyticsRepository {
  private db: string = config.get('mongo.db');

  private collection: string = config.get('mongo.collection');

  static instance: AnalyticsRepository;

  static getInstance() {
    if (!AnalyticsRepository.instance) {
      AnalyticsRepository.instance = new AnalyticsRepository();
    }

    return AnalyticsRepository.instance;
  }

  async incrementSeriesAccessCount(seriesName: string): Promise<object> {
    const connection = await this.connection;

    return connection
      .db(this.db)
      .collection(this.collection)
      .findOneAndUpdate(
        { seriesName },
        {
          $set: {
            seriesName,
          },
          $inc: { accessCount: 1 },
        },
        { upsert: true },
      );
  }

  async getMostPopularSeries(count: number): Promise<ISeries[]> {
    const connection = await this.connection;

    return connection
      .db(this.db)
      .collection(this.collection)
      .find({})
      .sort({ accessCount: -1 })
      .limit(count)
      .toArray()
      .then((allSeries) => allSeries.map((series) => new Series(series)));
  }
}

export default AnalyticsRepository;
