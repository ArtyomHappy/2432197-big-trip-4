import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListText } from '../constants.js';

function createEmptyListTemplate(filterType) {
  return `<p class="trip-events__msg">${EmptyListText[filterType]}</p>`;
}

export default class EmptyList extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
