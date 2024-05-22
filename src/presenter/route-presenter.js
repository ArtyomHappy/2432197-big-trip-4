import RouteInfo from '../view/route-info';
import Sorting from '../view/sorting';
import { RenderPosition, render, remove } from '../framework/render';
import { update } from '../utils/general';
import RoutePointPresenter from './route-point-presenter';
import EmptyList from '../view/empty-list';
import { sortPrice, sortTime, sortDay } from '../utils/sort';

const SORT_TYPE = {
  PRICE: 'price',
  TIME: 'time',
  DAY: 'day'
};

export default class TripPresenter {
  #tripContainer = null;
  #pointList = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #pointPresenters = new Map();
  #pointsModel = null;
  #sortComponent = null;
  #currentSortType = SORT_TYPE.DAY;
  #sortedPoints = [];

  constructor( {tripContainer, destinationsModel, offersModel, pointsModel} ) {
    this.#tripContainer = tripContainer;
    this.#pointList = new RouteInfo();
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#points = [...pointsModel.get()];
  }

  init() {
    this.#renderTrip();
    this.#sortedPoints = [...this.#points.sort(sortDay)];
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
    this.#sortComponent = new Sorting({
      onSortTypeChange: this.#handleSortTypeChange,
      currentType: this.#currentSortType,
    });

    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #sortPoints(sortType) {
    switch(sortType) {
      case SORT_TYPE.TIME:
        this.#points.sort(sortTime);
        break;
      case SORT_TYPE.PRICE:
        this.#points.sort(sortPrice);
        break;
      default:
        this.#points = [...this.#sortedPoints];
    }

    this.#currentSortType = sortType;
  }

  #clearSort() {
    remove(this.#sortComponent);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
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
    this.#sortedPoints = update(this.#sortedPoints, updatePoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType){
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#clearSort();
    this.#renderSort();
    this.#renderPoints();
  };
}
