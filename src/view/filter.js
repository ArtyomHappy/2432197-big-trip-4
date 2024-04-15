import { AbstractView } from '../framework/view/abstract-view';
import { capitalize } from '../utils/general';

const createFilterItemTemplate = ( { filters } ) => {
  const filterItems = filters.map((filter, currentIndex) => (
    `<div class="trip-filters__filter">
              <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}"
              ${(currentIndex === 0) ? 'checked' : ''} ${(filter.isExist) ? '' : 'disabled'}>
              <label class="trip-filters__filter-label" for="filter-${filter.type}">${capitalize(filter.type)}</label>
          </div>`
  )).join('');

  return filterItems;
};

const createFilterTemplate = ({filters}) => (
  `<form class="trip-filters" action="#" method="get">
          ${createFilterItemTemplate({filters})}
          <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
);

export default class Filter extends AbstractView {
  #filters = [];

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() { return createFilterTemplate({filters: this.#filters}); }
}
