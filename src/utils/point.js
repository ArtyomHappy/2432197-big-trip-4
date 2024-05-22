import { dayjs } from 'dayjs';
import { duration } from 'dayjs/plugin/duration';
import { relativeTime } from 'dayjs/plugin/relativeTime';
import { getRandomNumber } from './general';

const TIME_PERIODS = {
  MSEC_IN_SEC: 1000,
  SEC_IN_MIN: 60,
  MIN_IN_HOUR: 60,
  HOUR_IN_DAY: 24,

  get MSEC_IN_HOUR() {
    return this.MSEC_IN_SEC * this.SEC_IN_MIN * this.MIN_IN_HOUR;
  },

  get MSEC_IN_DAY() {
    return this.MSEC_IN_HOUR * this.HOUR_IN_DAY;
  },
};

dayjs.extend(duration);
dayjs.extend(relativeTime);

let date = dayjs().subtract(getRandomNumber(0, 5), 'day').toDate();

function humanizeDateTime(dateInfo) {
  return dateInfo ? dayjs(dateInfo).format('YYYY-MM-DDTHH:mm') : '';
}

function humanizeShortDate(dateInfo) {
  return dateInfo ? dayjs(dateInfo).format('MMM DD') : '';
}

function humanizeTime(dateInfo) {
  return dateInfo ? dayjs(dateInfo).format('HH:mm') : '';
}

function getPointDuration(dateFrom, dateTo) {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom));
  let pointDuration = 0;

  switch(true) {
    case(difference >= TIME_PERIODS.MSEC_IN_DAY):
      pointDuration = dayjs.duration(difference).format('DD[D] HH[H] mm[M]');
      break;
    case(difference >= TIME_PERIODS.MSEC_IN_HOUR):
      pointDuration = dayjs.duration(difference).format('HH[H] mm[M]');
      break;
    case(difference < TIME_PERIODS.MSEC_IN_HOUR):
      pointDuration = dayjs.duration(difference).format('mm[M]');
      break;
  }

  return pointDuration;
}

function getScheduleDate(dateInfo) {
  return dayjs(dateInfo).format('DD/MM/YY HH:mm');
}

function getDate({ next }) {
  const minGap = getRandomNumber(0, 59);
  const hourGap = getRandomNumber(1, 5);
  const dayGap = getRandomNumber(0, 5);

  if(next) {
    date = dayjs(date).add(minGap, 'minute').add(hourGap, 'hour').add(dayGap, 'day').toDate();
  }

  return date;
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function getDuration(dateTo, dateFrom) {
  const minuteDifference = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  return dayjs.duration(minuteDifference);
}

export { humanizeDateTime, humanizeShortDate, humanizeTime, getPointDuration, getScheduleDate, getDate, isPointFuture, isPointPresent, isPointPast, getDuration };
