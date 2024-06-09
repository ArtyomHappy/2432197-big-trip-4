import Observable from '../framework/observable.js';
import { FilterType } from '../constants.js';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updatedType, updatedfilter) {
    this.#filter = updatedfilter;
    this._notify(updatedType, updatedfilter);
  }
}
