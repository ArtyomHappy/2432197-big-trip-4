import RouteInfo from '../view/route-info';
import NewEvent from '../view/new-event';
import EditorEvent from '../view/editor-event';
import RoutePoint from '../view/route-point';
import { render } from '../render';

export default class RoutePresenter {
  tripEventsComponent = new RouteInfo();

  constructor({routeContainer}) {
    this.routeContainer = routeContainer;
  }

  init() {
    render(this.tripEventsComponent, this.routeContainer);
    render(new EditorEvent(), this.tripEventsComponent.getElement());
    render(new NewEvent(), this.tripEventsComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePoint(), this.tripEventsComponent.getElement());
    }
  }
}
