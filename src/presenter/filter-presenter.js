import { render, replace, remove } from '../framework/render.js';
import Filter from '../view/filter.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../constants.js';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointsModel = null;
  #component = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#container = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({ type, isDisabled: !filter[type](points).length }));
  }

  init() {
    const filters = this.filters;
    const previousComponent = this.#component;

    this.#component = new Filter({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange
    });

    if (previousComponent === null) {
      render(this.#component, this.#container);
      return;
    }

    replace(this.#component, previousComponent);
    remove(previousComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
