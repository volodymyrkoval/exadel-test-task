import TMDBService from '../services/tmdb/tmdb.service';
import { TMDBService as ITMDBService } from '../types/tmdb/tmdb.service';
import AnalyticsRepository from '../services/analytics/analyticsRepository';
import { AnalyticsRepository as IAnalyticsRepository } from '../types/analytics/analyticsRepository';
import AbstractEpisodesModel from './episodes.abstract';

export default class EpisodesModel extends AbstractEpisodesModel {
  protected tmdbService: ITMDBService = EpisodesModel.getTMDBService();

  protected analyticsRepository: IAnalyticsRepository = EpisodesModel.getAnalyticsRepository();

  static getTMDBService(): ITMDBService {
    return new TMDBService();
  }

  static getAnalyticsRepository(): IAnalyticsRepository {
    return AnalyticsRepository.getInstance();
  }
}
