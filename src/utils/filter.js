import { isDateFuture, isDatePresent, isDatePast } from './point';
import { FilterType } from '../constants';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isDatePresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isDatePast(point.dateTo)),
};

export { filter };
