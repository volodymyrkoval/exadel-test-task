import * as _ from 'lodash';
import { Logger } from '@overnightjs/logger';
import { Episode as IEpisode } from '../types/tmdb/episode';
import { TMDBService as ITMDBService } from '../types/tmdb/tmdb.service';
import { EpisodesModel as IEpisodesModel } from '../types/tmdb/episodes.model';
import { Series as ISeries } from '../types/tmdb/series';
import { AnalyticsRepository as IAnalyticsRepository } from '../types/analytics/analyticsRepository';
import { NotFoundError, TMDBError } from '../errors/errors';

const config = require('config');

enum Order {
  asc = 'asc',
  desc = 'desc'
}

abstract class AbstractEpisodesModel implements IEpisodesModel {
  protected numberOfReturnedEpisodes: number = config.get('tmdb.numberOfReturnedEpisodes');

  protected tmdbService: ITMDBService;

  protected analyticsRepository: IAnalyticsRepository;

  async getMostVotesEpisodesBySeriesId(seriesId: number): Promise<object> {
    let series: ISeries;

    try {
      series = await this.tmdbService.getSeries(seriesId);
    } catch (err) {
      Logger.Err(err);
      if (_.result(err, 'response.status') === 404) {
        throw new NotFoundError(`Series with id '${seriesId}' does not exist`);
      }
      throw new TMDBError(err);
    }

    let allSeriesEpisodes: IEpisode[];
    try {
      allSeriesEpisodes = await this.tmdbService
        .getAllEpisodesBySeries(seriesId, series.seasonsIdentifiers);
    } catch (err) {
      Logger.Err(err);
      throw new TMDBError(err);
    }

    const topVotedSeriesEpisodes = AbstractEpisodesModel.sortEpisodesByAverageVoteNumber(
      allSeriesEpisodes,
      Order.desc,
      this.numberOfReturnedEpisodes,
    );

    // Client shouldn't wait this action. We can perform it in background
    // and just log error if something went wrong
    this.analyticsRepository.incrementSeriesAccessCount(series.name).catch(Logger.Err);

    return {
      episodes: topVotedSeriesEpisodes,
    };
  }

  protected static sortEpisodesByAverageVoteNumber(
    episodes: IEpisode[],
    order: Order,
    maxNumber: number,
  ): IEpisode[] {
    return _.chain(episodes)
      .orderBy('averageVotes', order)
      .take(maxNumber)
      .value();
  }
}

export default AbstractEpisodesModel;
