import he from 'he';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import FlatPicker from './date-selection.js';
import { getLastWord, raiseFirstChar } from '../utils/common.js';
import { humanizeDateTime } from '../utils/point.js';
import { POINT_TYPES, EmptyPoint, EditingType } from '../constants.js';

function createDestinationsTemplate(destination) {
  const { description, pictures, name } = destination;

  function createPicturesTemplate() {
    return pictures.length ? `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((picture) => (`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)).join('')}
    </div>
  </div>` : '';
  }

  return name ? `<section class="event__section  event__section--destination">
  <h3 class="event__section-title event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  ${createPicturesTemplate()}
</section>` : '';
}

function createDestinationsList(destinations) {
  return `<datalist id="destination-list-1">
  ${destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('')}
  </datalist>`;
}

function createOffersTemplate({ offers, currentOffers, isDisabled }) {
  function createOfferItems() {
    return currentOffers.map((offer) => {
      const className = offers.some((current) => (current === offer.id)) ? 'checked' : '';
      const lastWord = getLastWord(offer.title);

      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" ${isDisabled ? 'disabled' : ''} id="event-offer-${lastWord}-${offer.id}" type="checkbox" name="event-offer-${lastWord}" ${className}>
      <label class="event__offer-label" for="event-offer-${lastWord}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
    }).join('');
  }

  return currentOffers.length ? `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${createOfferItems({ isDisabled })}
  </div>
</section>` : '';
}

function createEditorEventTemplate({ isDisabled }) {
  function createEventItems() {
    return POINT_TYPES.map((item) => (`<div class="event__type-item">
    <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
    <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${raiseFirstChar(item)}</label>
  </div>`)).join('');
  }

  return `<input class="event__type-toggle  visually-hidden" ${isDisabled ? 'disabled' : ''} id="event-type-toggle-1" type="checkbox">
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${createEventItems()}
    </fieldset>
  </div>`;
}

function createEditorPointTemplate({ point, selectedDestinations, selectedOffers, editingType }) {
  const { type, dateFrom, dateTo, destinations, offers, basePrice, isDisabled, isSaving, isDeleting } = point;
  const currentDestination = selectedDestinations.find((destination) => destination.id === destinations);
  const currentOffers = selectedOffers.find((offer) => offer.type === type)?.offers;
  const resetButton = editingType === EditingType.NEW ? 'Cancel' : 'Delete';
  const isShowDescription = currentDestination?.description || currentDestination?.pictures.length;
  const isSubmitDisabled = !destinations;

  return `<li class="trip-events__item"><form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      ${createEditorEventTemplate({ isDisabled })}
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${raiseFirstChar(type)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" ${isDisabled ? 'disabled' : ''} value="${currentDestination ? he.encode(currentDestination.name) : ''}" list="destination-list-1">
      ${createDestinationsList(selectedDestinations)}
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" ${isDisabled ? 'disabled' : ''} name="event-start-time" value="${dateFrom ? humanizeDateTime(dateFrom, 'DD/MM/YY HH:mm') : ''}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" ${isDisabled ? 'disabled' : ''} name="event-end-time" value="${dateTo ? humanizeDateTime(dateTo, 'DD/MM/YY HH:mm') : ''}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" ${isDisabled ? 'disabled' : ''} id="event-price-1" type="text" name="event-price" value="${he.encode(basePrice.toString())}">
    </div>

    <button class="event__save-btn  btn  btn--blue" ${isSubmitDisabled || isDisabled ? 'disabled' : ''} type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" ${isDisabled ? 'disabled' : ''} type="reset">${isDeleting ? 'Deleting...' : resetButton}</button>
    ${editingType === EditingType.NEW ? '' : `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span></button>`}

  </header>
  ${!isShowDescription && !currentOffers.length ? '' : `<section class="event__details">
  ${createOffersTemplate({ offers, currentOffers, isDisabled })}
  ${!currentDestination?.description && !currentDestination?.pictures.length ? '' : createDestinationsTemplate(currentDestination)}
</section>`}
</form></li>`;
}

export default class EditorEvent extends AbstractStatefulView {
  #type = null;
  #destinations = null;
  #offers = null;
  #onEditorSubmit = null;
  #onEditorReset = null;
  #onDeleteClick = null;
  #dateSelectorFrom = null;
  #dateSelectorTo = null;

  constructor({ point = EmptyPoint, onFormSubmit, onFormReset, destinations, offers, onDeleteClick, type = EditingType.UPDATE }) {
    super();

    this.#type = type;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onEditorSubmit = onFormSubmit;
    this.#onEditorReset = onFormReset;
    this.#onDeleteClick = onDeleteClick;

    this._setState(EditorEvent.parsePointToState(point));
    this._restoreHandlers();
  }

  get template() {
    return createEditorPointTemplate({
      point: this._state,
      selectedDestinations: this.#destinations,
      selectedOffers: this.#offers,
      editingType: this.#type
    });
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#editorSubmitHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#editorResetHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#setDateSelectors();
  }

  reset = (point) => {
    this.updateElement(EditorEvent.parsePointToState(point));
  };

  removeElement = () => {
    super.removeElement();

    if (this.#dateSelectorFrom) {
      this.#dateSelectorFrom.destroy();
      this.#dateSelectorFrom = null;
    }

    if (this.#dateSelectorTo) {
      this.#dateSelectorTo.destroy();
      this.#dateSelectorTo = null;
    }
  };

  static parsePointToState = (point) => ({ ...point, isDisabled: false, isSaving: false, isDeleting: false });

  static parseStateToPoint = (state) => {
    const point = {
      ...state,
      dateFrom: dayjs(state.dateFrom).format(),
      dateTo: dayjs(state.dateTo).format(),
      basePrice: Number(state.basePrice)
    };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

  #setDateSelectors = () => {
    this.#dateSelectorFrom = new FlatPicker({
      element: this.element.querySelector('#event-start-time-1'),
      defaultDate: this._state.dateFrom,
      maxDate: this._state.dateTo,
      onClose: this.#onCloseDateSelectorFromHandler,
    });

    this.#dateSelectorTo = new FlatPicker({
      element: this.element.querySelector('#event-end-time-1'),
      defaultDate: this._state.dateTo,
      minDate: this._state.dateFrom,
      onClose: this.#onCloseDateSelectorToHandler,
    });
  };

  #onCloseDateSelectorFromHandler = ([userDate]) => {
    this._setState({ dateFrom: userDate });

    this.#dateSelectorTo.setMinDate(this._state.dateFrom);
  };

  #onCloseDateSelectorToHandler = ([userDate]) => {
    this._setState({ dateTo: userDate });

    this.#dateSelectorFrom.setMaxDate(this._state.dateTo);
  };

  #editorSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onEditorSubmit(EditorEvent.parseStateToPoint(this._state));
  };

  #editorResetHandler = (evt) => {
    evt.preventDefault();
    this.#onEditorReset();
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({ ...this._state, type: evt.target.value, offers: [] });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value).id;
    this.updateElement({ destination: selectedDestination });
  };

  #priceChangeHandler = (evt) => {
    this._setState({ basePrice: evt.target.value });
  };

  #offersChangeHandler = () => {
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map(({ id }) => id.split('-').slice(3).join('-'));

    this._setState({ offers: selectedOffers });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditorEvent.parseStateToPoint(this._state));
  };
}
