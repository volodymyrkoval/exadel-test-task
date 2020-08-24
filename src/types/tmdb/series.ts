import Season from './season';

export interface Series {
  name: string
  seasonsIdentifiers: number[]
  seasons?: Season[]
}
