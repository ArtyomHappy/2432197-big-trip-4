import { createElement } from '../render';

function createTripEventsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class RouteInfo {
  getTemplate() { return createTripEventsTemplate(); }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() { this.element = null; }
}
