import { AbstractView } from '../framework/view/abstract-view';
import { humanizeDateTime } from '../utils/point';
import { capitalize, getLastWord } from '../utils/general';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const CITIES = ['Amsterdam', 'Chamonix', 'Geneva', 'Paris', 'Rome', 'London'];
const ROUTE_TYPES = ['taxi','bus', 'train', 'ship', 'check-in','restaurant','drive', 'flight', 'sightseeing',];
const DEFAULT_TYPE = 'flight';
const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const createPointTypesTemplate = (currentType) => ROUTE_TYPES.reduce((accumulator, type)=>
  `${accumulator}<div class="event__type-item">
     <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
     <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
   </div>`, ''
);

const createCitiesTemplate = () => (
  `<datalist id="destination-list-1">
        ${CITIES.reduce((accumulator, city) => `${accumulator}<option value="${city}"></option>`, '')}
    </datalist>`
);

const createOffersTemplate = ({current, selected}) => {
  const offerItems = current.reduce((accumulator, offer) => (
    `${accumulator}<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${getLastWord(offer.title)}" data-offer-id="${offer.id}" ${selected.some((id) => id === offer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="${offer.id}">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
              </label>
          </div>`
  ), '');

  return `<div class="event__available-offers">${offerItems}</div>`;
};

const createPhotosTemplate = (currentDestination) => (
  `<div class="event__photos-tape">
  ${currentDestination.illustrations.reduce((accumulator, picture) => (
    `${accumulator}<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ), '')}
  </div>`
);

const createRedactorEventTemplate = ({point, pointDestination, pointOffers}) => {
  const { basePrice, dateFrom, dateTo, offers: selectedOffers, type } = point;
  const currentOffers = pointOffers.find((offer) => offer.type === type).offers;
  const currentDestination = pointDestination.find((destination) => destination.id === point.destination);
  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createPointTypesTemplate(type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalize(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1">
        ${createCitiesTemplate()}
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateTime(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateTime(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffersTemplate({currentOffers, selectedOffers})}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination.description}</p>
        <div class="event__photos-container">
          ${createPhotosTemplate(currentDestination)}
        </div>
      </section>
    </section>
  </form>
  </li>`);
};

export default class EditorEvent extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleRedactorSubmit = null;
  #handleRedactorReset = null;
  #datePickerFrom = null;
  #datePickerTo = null;

  constructor( { point = EMPTY_POINT, pointDestination, pointOffers, onFormSubmit, onResetClick } ) {
    super();

    this._setState(EditorEvent.parsePointToState({point}));
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleRedactorSubmit = onFormSubmit;
    this.#handleRedactorReset = onResetClick;
    this._restoreHandlers();

    this.element.querySelector('form').addEventListener('submit', this.#redactorSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#redactorResetHandler);
  }

  get template() {
    return createRedactorEventTemplate({point: this._state.point, pointDestination: this.#pointDestination, pointOffers: this.#pointOffers });
  }

  #redactorSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleRedactorSubmit(EditorEvent.parseStateToPoint(this._state));
  };

  #redactorResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleRedactorReset();
  };

  reset = (point) => {
    this.updateElement({point});
  };

  _restoreHandlers = () => {
    this.element.querySelector('form').addEventListener('submit', this.#redactorSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#redactorResetHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.#setDatePickers();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: [],
      },
    });
  };

  #offerChangeHandler = () => {
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point: {
        ...this._state.point,
        offers: selectedOffers.map((element) => element.dataset.offerId)
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#pointDestination.find((destination) => destination.name === evt.target.value).id;
    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestination,
      }
    });
  };

  static parsePointToState({point}){
    return {point};
  }

  static parseStateToPoint(state){
    return state.point;
  }

  #datePickerFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      }
    });
    this.#datePickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #datepickerToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      }
    });
    this.#datePickerTo.set('minDate', this._state.point.dateFrom);
  };

  #setDatePickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    this.#datePickerFrom = flatpickr(
      dateFromElement,
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true,
        defaultDate: this._state.point.dateFrom,
        maxDate: this._state.point.dateTo,
        onChange: this.#datePickerFromChangeHandler,
      },
    );

    this.#datePickerTo = flatpickr(
      dateToElement,
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true,
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onChange: this.#datepickerToChangeHandler,
      },
    );
  };

  removeElement = () => {
    super.removeElement();
    if(this.#datePickerFrom){
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if(this.#datePickerTo){
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  };
}
