import he from 'he';
import AbstractView from '../framework/view/abstract-view.js';
import { raiseFirstChar } from '../utils/common.js';
import { humanizeDateTime, getPointDuration } from '../utils/point.js';

function createOffersTemplate({ currentOffers, offers }) {
  return `<ul class="event__selected-offers">
  ${currentOffers.filter((offer) => offers.includes(offer.id)).map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
  `).join('')}
  </ul>`;
}

function createTripPointTemplate({ point, destination, currentOffers }) {
  const { basePrice, dateFrom, dateTo, isFavorite, type, offers } = point;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item"><div class="event">
  <time class="event__date" datetime="${humanizeDateTime(dateFrom, 'YYYY-MM-DD')}">${humanizeDateTime(dateFrom, 'MMM DD')}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${raiseFirstChar(type)} ${he.encode(destination.name)}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${humanizeDateTime(dateFrom, 'YYYY-MM-DDTHH:mm')}">${humanizeDateTime(dateFrom, 'HH:mm')}</time>
      &mdash;
      <time class="event__end-time" datetime="${humanizeDateTime(dateTo, 'YYYY-MM-DDTHH:mm')}">${humanizeDateTime(dateTo, 'HH:mm')}</time>
    </p>
    <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
    ${offers.length > 0 ? createOffersTemplate({ currentOffers, offers }) : ''}
  <button class="event__favorite-btn ${favoriteClassName}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div></li>`;
}

export default class TripPoint extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({ point, destination, offers, onEditClick, onFavoriteClick }) {
    super();

    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createTripPointTemplate({ point: this.#point, destination: this.#destination, currentOffers: this.#offers });
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };
}
