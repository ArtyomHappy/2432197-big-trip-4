import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import duration from 'dayjs/plugin/duration';
import { TimePeriods } from '../constants';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);

function humanizeDateTime(dateInfo, format) {
  return dateInfo ? dayjs(dateInfo).format(format) : '';
}

function getPointDuration(dateFrom, dateTo) {
  const differenceInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  if (differenceInMinutes >= TimePeriods.MIN_IN_YEAR) {
    return dayjs.duration(differenceInMinutes, 'minutes').format('YY[Y] DD[D] HH[H] mm[M]');
  } else if (differenceInMinutes >= TimePeriods.MIN_IN_DAY) {
    return dayjs.duration(differenceInMinutes, 'minutes').format('DD[D] HH[H] mm[M]');
  } else if (differenceInMinutes >= TimePeriods.MIN_IN_HOUR) {
    return dayjs.duration(differenceInMinutes, 'minutes').format('HH[H] mm[M]');
  } else {
    return dayjs.duration(differenceInMinutes, 'minutes').format('mm[M]');
  }
}

function getDuration(dateFrom, dateTo) {
  const differenceInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  return dayjs.duration(differenceInMinutes);
}

function areDatesEqual(dateFirst, dateSecond) {
  return (dateFirst === null && dateSecond === null) || dayjs(dateFirst).isSame(dateSecond, 'D');
}

function arePricesEqual(priceFirst, priceSecond) {
  return priceFirst === priceSecond;
}

function isDateFuture(dateFrom) {
  return dayjs(dateFrom).isAfter(dayjs());
}

function isDatePresent(dateFrom, dateTo) {
  return (dayjs().isSameOrAfter(dateFrom) && dayjs().isSameOrBefore(dateTo));
}

function isDatePast(dateTo) {
  return dayjs(dateTo).isBefore(dayjs());
}

export { humanizeDateTime, getPointDuration, getDuration, areDatesEqual, arePricesEqual, isDateFuture, isDatePresent, isDatePast };
