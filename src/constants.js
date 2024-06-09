const AUTHORIZATION = 'Basic authorization';
const ADDRESS = 'https://21.objects.htmlacademy.pro/big-trip';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const TimePeriods = {
  MIN_IN_HOUR: 60,
  MIN_IN_DAY: 1440,
  MIN_IN_YEAR: 525600
};

const TimeLimits = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const EmptyPoint = {
  type: 'flight',
  dateFrom: null,
  dateTo: null,
  destination: null,
  offers: [],
  basePrice: 0,
  isFavorite: false
};

const SortingType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const EditingType = {
  UPDATE: 'UPDATE',
  NEW: 'NEW'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE',
  ADD_POINT: 'ADD',
  DELETE_POINT: 'DELETE',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const EmptyListText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now'
};

export { AUTHORIZATION, ADDRESS, POINT_TYPES, TimePeriods, TimeLimits, EmptyPoint, SortingType, FilterType, UpdateType, EditingType, UserAction, Mode, Method, EmptyListText };
