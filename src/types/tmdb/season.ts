import { Episode } from './episode';

export default interface Season {
  id: number
  episodes?: Episode[]
}
