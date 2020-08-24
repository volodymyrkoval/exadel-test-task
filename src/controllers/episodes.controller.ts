/* eslint-disable max-classes-per-file */

import {
  JsonController, Get, Params, ContentType, HttpCode,
} from 'routing-controllers';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import EpisodesModel from '../models/episodes.model';
import { EpisodesModel as IEpisodesModel } from '../types/tmdb/episodes.model';

class SeriesIdParam {
  @IsInt()
  seriesId: number;
}

class MostVotedEpisodes {
  @IsString()
  episodeName: string;

  @IsNumber()
  averageVotes: number;
}

@JsonController('/topEpisodes')
export default class EpisodesController {
  private episodesModel: IEpisodesModel = EpisodesController.getEpisodesModel();

  static getEpisodesModel(): IEpisodesModel {
    return new EpisodesModel();
  }

  @Get('/:seriesId')
  @HttpCode(200)
  @ContentType('application/json')
  @OpenAPI({
    summary: 'Returns series\'s top voted episodes',
    responses: {
      400: { description: 'Bad request' },
      404: { description: 'Not Found' },
      500: { description: 'Internal Server Error' },
    },
  })
  @ResponseSchema(MostVotedEpisodes, {
    isArray: true,
  })
  public async getMostVotedEpisodesBySeries(@Params({ validate: true }) params: SeriesIdParam) {
    return this.episodesModel.getMostVotesEpisodesBySeriesId(params.seriesId);
  }
}
