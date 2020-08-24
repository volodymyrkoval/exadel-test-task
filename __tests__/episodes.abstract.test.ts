import Series from '../src/services/tmdb/entities/series';
import Episode from '../src/services/tmdb/entities/episode';
import { TMDBService } from '../src/types/tmdb/tmdb.service';
import AbstractEpisodesModel from '../src/models/episodes.abstract';
import { AnalyticsRepository as IAnalyticsRepository } from '../src/types/analytics/analyticsRepository';
import { NotFoundError, TMDBError } from '../src/errors/errors';

jest.mock('../src/models/cache/memcachedCacheDecorator');
jest.mock('../src/services/analytics/analyticsRepository');

const getSeriesMock = jest.fn();
const getAllEpisodesBySeriesMock = jest.fn();

const TMDBServiceMock = jest.fn<TMDBService, []>(() => ({
  getSeries: getSeriesMock,
  getAllEpisodesBySeries: getAllEpisodesBySeriesMock,
}));

const incrementSeriesAccessCountMock = jest.fn();

const AnalyticsServiceMock = jest.fn<IAnalyticsRepository, []>(() => ({
  incrementSeriesAccessCount: incrementSeriesAccessCountMock,
  getMostPopularSeries: jest.fn(),
}));

class EpisodesModelTestImpl extends AbstractEpisodesModel {
  protected tmdbService: TMDBService = EpisodesModelTestImpl.getTMDBService();

  protected analyticsRepository: IAnalyticsRepository =
  EpisodesModelTestImpl.getAnalyticsRepository();

  static getTMDBService(): TMDBService {
    return new TMDBServiceMock();
  }

  static getAnalyticsRepository(): IAnalyticsRepository {
    return new AnalyticsServiceMock();
  }
}

const episodesModel = new EpisodesModelTestImpl();

describe('EpisodesModel tests', () => {
  describe('getMostVotesEpisodesBySeriesId method tests', () => {
    beforeEach(() => {
      // jest.resetAllMocks();
    });
    it('should return most voted episodes', async () => {
      getSeriesMock.mockResolvedValueOnce(
        new Series({
          name: 'some_name',
          number_of_seasons: 2,
        }),
      );

      getAllEpisodesBySeriesMock.mockResolvedValueOnce([
        new Episode({
          name: 'season1_episode1',
          vote_average: 4,
        }),
        new Episode({
          name: 'season2_episode1',
          vote_average: 7,
        }),
      ]);

      incrementSeriesAccessCountMock.mockResolvedValueOnce(Promise.resolve(true));

      const sortedEpisodes: any = await episodesModel.getMostVotesEpisodesBySeriesId(1);

      expect(sortedEpisodes.episodes[0]).toEqual(new Episode({
        name: 'season2_episode1',
        vote_average: 7,
      }));

      expect(sortedEpisodes.episodes[1]).toEqual(new Episode({
        name: 'season1_episode1',
        vote_average: 4,
      }));
    });
    it('should throw \'NotFoundError\' error if series with given id does not exist', () => {
      const error = {
        response: {
          status: 404,
        },
      };
      getSeriesMock.mockRejectedValueOnce(error);

      expect(episodesModel.getMostVotesEpisodesBySeriesId(1)).rejects.toThrow(NotFoundError);
    });
    it('should throw \'TMDBError\' if error while getting series happened', () => {
      getSeriesMock.mockRejectedValueOnce(new Error());

      expect(episodesModel.getMostVotesEpisodesBySeriesId(1)).rejects.toThrow(TMDBError);
    });
    it('should throw \'TMDBError\' if error while getting episodes happened', () => {
      getSeriesMock.mockResolvedValueOnce(
        new Series({
          name: 'some_name',
          number_of_seasons: 2,
        }),
      );

      getAllEpisodesBySeriesMock.mockRejectedValueOnce(new Error());

      expect(episodesModel.getMostVotesEpisodesBySeriesId(1)).rejects.toThrow(TMDBError);
    });
  });
});
