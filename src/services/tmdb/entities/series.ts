import { Series as ISeries } from '../../../types/tmdb/series';

export default class Series implements ISeries {
  name: string;
  seasonsIdentifiers: number[];

  constructor(plainObject: any) {
    this.name = plainObject.name;
    this.seasonsIdentifiers = plainObject.seasonsIdentifiers;
  }
}
