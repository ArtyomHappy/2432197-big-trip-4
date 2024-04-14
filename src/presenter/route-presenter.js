import RouteInfo from '../view/route-info';
import EditorEvent from '../view/editor-event';
import RoutePoint from '../view/route-point';
import Sorting from '../view/sorting';
import { render } from '../render';

export default class TripPresenter {
  constructor( {tripContainer, destinationsModel, offersModel, pointsModel} ) {
    this.tripContainer = tripContainer;
    this.pointList = new RouteInfo();
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
    this.points = [...this.pointsModel.get()];
  }

  init() {
    render(new Sorting(), this.tripContainer);
    render(this.pointList, this.tripContainer);
    render(
      new EditorEvent({
        point: this.points[0],
        pointDestination: this.destinationsModel.getById(this.points[0].destination),
        pointOffers: this.offersModel.getByType(this.points[0].type),
      }), this.pointList.getElement());

    this.points.forEach((point) => {
      render(
        new RoutePoint({
          point,
          pointDestination: this.destinationsModel.getById(point.destination),
          pointOffers: this.offersModel.getByType(point.type)
        }),
        this.pointList.getElement()
      );
    });
  }
}
