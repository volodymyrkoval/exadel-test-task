import { AnalyticsRepository as IAnalyticsRepository } from '../types/analytics/analyticsRepository';
import AnalyticsRepository from '../services/analytics/analyticsRepository';
import AbstractAnalyticsModel from './analytics.abstract.model';

class AnalyticsModel extends AbstractAnalyticsModel {
  protected analyticsRepository: IAnalyticsRepository = AnalyticsModel.getAnalyticsRepository();

  static getAnalyticsRepository(): IAnalyticsRepository {
    return AnalyticsRepository.getInstance();
  }
}

export default AnalyticsModel;
