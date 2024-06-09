import dayjs from 'dayjs';
import { getDuration } from './point.js';

function getWeightForNullDate(dateFirst, dateSecond) {
  if (dateFirst === null && dateSecond === null) {
    return 0;
  }

  if (dateFirst === null) {
    return 1;
  }

  if (dateSecond === null) {
    return -1;
  }

  return null;
}

function sortByPrice(pointFirst, pointSecond) {
  const difference = pointFirst.basePrice - pointSecond.basePrice;

  if (difference > 0) {
    return -1;
  } else if (difference < 0) {
    return 1;
  } else {
    return 0;
  }
}

function sortByTime(pointFirtst, pointSecond) {
  const weight = getWeightForNullDate(pointFirtst.dateFrom, pointSecond.dateFrom);
  const durationFirst = getDuration(pointFirtst.dateFrom, pointFirtst.dateTo);
  const durationSecond = getDuration(pointSecond.dateFrom, pointSecond.dateTo);

  if (weight !== null) {
    return weight;
  } else {
    if (durationFirst.asMilliseconds() > durationSecond.asMilliseconds()) {
      return -1;
    } else if (durationFirst.asMilliseconds() < durationSecond.asMilliseconds()) {
      return 1;
    } else {
      return 0;
    }
  }
}

function sortByDay(pointFirst, pointSecond) {
  const weight = getWeightForNullDate(pointFirst.dateFrom, pointSecond.dateFrom);

  return weight ?? dayjs(pointFirst.dateFrom).diff(dayjs(pointSecond.dateFrom));
}

export { sortByPrice, sortByTime, sortByDay };
