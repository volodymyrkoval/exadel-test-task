export interface EpisodesModel {
  getMostVotesEpisodesBySeriesId(seriesId: number) : Promise<object>
}
