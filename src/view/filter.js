import AbstractView from '../framework/view/abstract-view';
import { raiseFirstChar } from '../utils/common';

function createFilterItemTemplate(filters, currentType) {
  return `<div class="trip-main__trip-controls  trip-controls">
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">

      ${filters.map(({ type, isDisabled }) => (`<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input visually-hidden" ${isDisabled ? 'disabled' : ''} type="radio" name="trip-filter" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${raiseFirstChar(type)}</label>
    </div>`)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
</div>`;
}

export default class Filter extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #onFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterItemTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.target.value);
  };
}
