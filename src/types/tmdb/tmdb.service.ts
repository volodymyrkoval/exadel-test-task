import { Episode } from './episode';
import { Series as ISeries } from './series';

export interface TMDBService {
  getSeries (seriesId: number): Promise<ISeries>
  getAllEpisodesBySeries(seriesId: number, seasonsIdentifiers: number[]): Promise<Episode[]>
}
