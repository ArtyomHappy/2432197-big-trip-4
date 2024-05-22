import RouteInfo from '../view/route-info';
import Sorting from '../view/sorting';
import { render } from '../framework/render';
import { update } from '../utils/general';
import RoutePointPresenter from './route-point-presenter';
import EmptyList from '../view/empty-list';

export default class TripPresenter {
  #tripContainer = null;
  #pointList = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #pointPresenters = new Map();
  #pointsModel = null;

  constructor( {tripContainer, destinationsModel, offersModel, pointsModel} ) {
    this.#tripContainer = tripContainer;
    this.#pointList = new RouteInfo();
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#points = [...pointsModel.get()];
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    if(this.#points.length === 0){
      render(new EmptyList(), this.#tripContainer);
      return;
    }
    this.#renderSort();
    this.#renderPointList();
    this.#renderPoints();
  }

  #renderSort() {
    render(new Sorting(), this.#tripContainer);
  }

  #renderPointList() {
    render(this.#pointList, this.#tripContainer);
  }

  #renderPoints() {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new RoutePointPresenter({
      container: this.#pointList.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      handleDataChange: this.#handlePointChange,
      handleModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatePoint) => {
    this.#points = update(this.#points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
