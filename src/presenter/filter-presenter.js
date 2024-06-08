import { render, replace, remove } from '../framework/render';
import Filter from '../view/filter';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../constants';

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #pointsModel = null;
  #component = null;

  constructor({ container, filterModel, pointsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handlePointsModelEvent);
    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
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

  #handlePointsModelEvent = () => { this.init(); };

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
