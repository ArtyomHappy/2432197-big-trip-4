import { isPointFuture, isPointPresent, isPointPast } from './point';

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FILTER_TYPE.EVERYTHING]: (points) => [...points],
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FILTER_TYPE.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export { filter };
