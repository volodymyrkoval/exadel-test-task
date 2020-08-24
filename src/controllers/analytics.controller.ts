/* eslint-disable max-classes-per-file */
import {
  JsonController, Get, HttpCode, ContentType,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { IsNumber, IsString } from 'class-validator';
import AnalyticsModel from '../models/analytics.model';
import { AnalyticsModel as IAnalyticsModel } from '../types/analytics/analytics.model';

class PopularSeries {
  @IsString()
  seriesName: string;

  @IsNumber()
  accessCount: number;
}

@JsonController('/analytics')
export default class AnalyticsController {
  private analyticsModel: IAnalyticsModel = AnalyticsController.getAnalyticsModel();

  static getAnalyticsModel(): IAnalyticsModel {
    return new AnalyticsModel();
  }

  @Get('/popularSeries')
  @HttpCode(200)
  @ContentType('application/json')
  @OpenAPI({
    summary: 'Returns most popular accessed TV series',
    responses: {
      500: { description: 'Internal Server Error' },
    },
  })
  @ResponseSchema(PopularSeries, {
    isArray: true,
  })
  public async getMostPopularSeries() {
    return this.analyticsModel.getMostPopularSeries();
  }
}
