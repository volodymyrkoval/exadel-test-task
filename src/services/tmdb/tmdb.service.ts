import * as querystring from 'querystring';
import axios from 'axios';
import { TMDBService } from '../../types/tmdb/tmdb.service';
import { Episode as IEpisode } from '../../types/tmdb/episode';
import { Series as ISeries } from '../../types/tmdb/series';
import Episode from './entities/episode';
import Series from './entities/series';
import WithCache from '../../models/cache/memcachedCacheDecorator';

const config = require('config');

class TMDBServiceImplementation implements TMDBService {
  apiBaseURL: string = config.get('tmdb.baseURL');

  apiVersion: string = config.get('tmdb.apiVersion');

  apiKey: string = config.get('tmdb.apiKey');

  @WithCache
  getSeries(seriesId: number): Promise<ISeries> {
    const url: string = `https://${this.apiBaseURL}/${this.apiVersion}/tv/${seriesId}?api_key=${this.apiKey}`;

    return TMDBServiceImplementation.sendRequest(url)
      .then((series: any): ISeries => new Series({
        name: series.name,
        seasonsIdentifiers: series.seasons.map(season => season.season_number)
      }));
  }

  @WithCache
  getAllEpisodesBySeries(seriesId: number, seasonsIdentifiers: number[]): Promise<IEpisode[]> {
    const seasonsFields = TMDBServiceImplementation.generateSeasonIdentifiers(seasonsIdentifiers);

    // Let's use append_to_response here and make our code faster
    // https://developers.themoviedb.org/3/getting-started/append-to-response
    const query = {
      api_key: this.apiKey,
      append_to_response: seasonsFields.join(','),
    };

    const url: string = `https://${this.apiBaseURL}/${this.apiVersion}/tv/
    ${seriesId}?${querystring.stringify(query)}`;

    return TMDBServiceImplementation
      .sendRequest(url)
      .then((series: any): IEpisode[] => seasonsFields
        .reduce((acc: IEpisode[], identifier: string) => {
          const seasonEpisodes = series[identifier].episodes
            .map((episode: any) => new Episode(episode));

          return [...acc, ...seasonEpisodes];
        }, []));
  }

  private static generateSeasonIdentifiers(seasonsIdentifiers: number[]) : string[] {
    return seasonsIdentifiers.map((n: number): string => `season/${n}`);
  }

  private static sendRequest(url: string): Promise<any> {
    return axios.get(url).then((response) => response.data);
  }
}

export default TMDBServiceImplementation;
