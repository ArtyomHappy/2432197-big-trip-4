import { AbstractView } from '../framework/view/abstract-view';

const SORT_TYPE = {
  PRICE: 'price',
  TIME: 'time',
  DAY: 'day'
};

function createSortTemplate({currentType}) {
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${SORT_TYPE.DAY === currentType ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-day" data-sort-type="${SORT_TYPE.DAY}">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${SORT_TYPE.TIME === currentType ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-time" data-sort-type="${SORT_TYPE.TIME}">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${SORT_TYPE.PRICE === currentType ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-price" data-sort-type="${SORT_TYPE.PRICE}">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`);
}

export default class Sorting extends AbstractView {
  #handleSortTypeChange = null;
  #currentType = null;

  constructor({ onSortTypeChange, currentType }) {
    super();

    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentType = currentType;

    this.element.addEventListener('click', this.#sortTypeClickHandler);
  }

  #sortTypeClickHandler = (evt) => {
    if(evt.target.tagName !== 'LABEL') { return; }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

  get template() {
    return createSortTemplate({ currentType: this.#currentType });
  }
}
