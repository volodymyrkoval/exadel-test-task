import { Series as ISeries } from './series';

export interface AnalyticsRepository {
  incrementSeriesAccessCount(seriesName: string): Promise<object>
  getMostPopularSeries(count: number): Promise<ISeries[]>
}
