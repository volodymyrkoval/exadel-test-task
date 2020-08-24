import { Series as ISeries } from '../../../types/analytics/series';

export default class Series implements ISeries {
  seriesName: string;

  accessCount: number;

  constructor(plainObject: any) {
    this.seriesName = plainObject.seriesName;
    this.accessCount = plainObject.accessCount;
  }
}
