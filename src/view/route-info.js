import { AbstractView } from '../framework/view/abstract-view';

function createTripEventsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class RouteInfo extends AbstractView {
  get template() { return createTripEventsTemplate(); }
}
