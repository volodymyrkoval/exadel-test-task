import axios from 'axios';
import TMDBServiceImplementation from '../src/services/tmdb/tmdb.service';
import Series from '../src/services/tmdb/entities/series';
import Episode from '../src/services/tmdb/entities/episode';

jest.mock('axios');
jest.mock('../src/models/cache/memcachedCacheDecorator');

const tmdbService = new TMDBServiceImplementation();

describe('TMDBServiceImplementation tests', () => {
  describe('getSeries tests', () => {
    test('should get series', async () => {
      const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: {
          name: 'some_name',
          seasons: [
            {season_number: 0},
            {season_number: 1},
          ],
        },
      });

      const series = await tmdbService.getSeries(1);

      expect(series).toEqual(new Series({
        name: 'some_name',
        seasonsIdentifiers: [0, 1],
      }));

      expect(spy).toHaveBeenCalledWith('https://test.url/3/tv/1?api_key=test_api_key');
    });
  });
  describe('getAllEpisodesBySeries tests', () => {
    test('should get all series\'s episodes', async () => {
      const spy = jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: {
          'season/1': {
            episodes: [
              {
                name: 'season1_episode1',
                vote_average: 4,
              },
              {
                name: 'season1_episode2',
                vote_average: 7,
              },
            ],
          },
          'season/2': {
            episodes: [
              {
                name: 'season2_episode1',
                vote_average: 4,
              },
              {
                name: 'season2_episode2',
                vote_average: 5,
              },
            ],
          },
          'season/3': {
            episodes: [
              {
                name: 'season3_episode1',
                vote_average: 6,
              },
              {
                name: 'season3_episode2',
                vote_average: 4,
              },
            ],
          },
        },
      });
      const episodes = await tmdbService.getAllEpisodesBySeries(1, [1, 2, 3]);

      expect(episodes).toEqual([
        new Episode({
          name: 'season1_episode1',
          vote_average: 4,
        }),
        new Episode({
          name: 'season1_episode2',
          vote_average: 7,
        }),
        new Episode({
          name: 'season2_episode1',
          vote_average: 4,
        }),
        new Episode({
          name: 'season2_episode2',
          vote_average: 5,
        }),
        new Episode({
          name: 'season3_episode1',
          vote_average: 6,
        }),
        new Episode({
          name: 'season3_episode2',
          vote_average: 4,
        }),
      ]);

      expect(spy).toHaveBeenCalledWith('https://test.url/3/tv/\n'
        + '    1?api_key=test_api_key&append_to_response=season%2F1%2Cseason%2F2%2Cseason%2F3');
    });
  });
});
