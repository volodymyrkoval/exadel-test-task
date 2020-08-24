import { Episode as IEpisode } from '../../../types/tmdb/episode';

export default class Episode implements IEpisode {
  episodeName: string;

  averageVotes: number;

  constructor(plainObject: any) {
    this.episodeName = plainObject.name;
    this.averageVotes = plainObject.vote_average;
  }
}
