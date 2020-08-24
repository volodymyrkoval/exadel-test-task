import { AnalyticsModel as IAnalyticsModel } from '../types/analytics/analytics.model';
import { Series as ISeries } from '../types/analytics/series';
import { AnalyticsRepository as IAnalyticsRepository } from '../types/analytics/analyticsRepository';

const config = require('config');

abstract class AbstractAnalyticsModel implements IAnalyticsModel {
  protected abstract analyticsRepository: IAnalyticsRepository;

  async getMostPopularSeries(): Promise<object> {
    const mostPopularSeries: ISeries[] = await this.analyticsRepository
      .getMostPopularSeries(config.get('analytics.numberOfReturnedRecords'));

    return {
      series: mostPopularSeries,
    };
  }
}

export default AbstractAnalyticsModel;
