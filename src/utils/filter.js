import { isDateFuture, isDatePresent, isDatePast } from './point.js';
import { FilterType } from '../constants.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isDatePresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isDatePast(point.dateTo)),
};

export { filter };
