import { RenderPosition, render, replace, remove } from '../framework/render';
import TripInfo from '../view/trip-info';
import { getTripInfo } from '../utils/trip-info';

export default class TripInfoPresenter {
  #container = null;
  #component = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handlePointsModelChange);
  }

  init() {
    this.#renderTripInfo();
  }

  #handlePointsModelChange = () => {
    this.init();
  };

  #renderTripInfo = () => {
    const previousComponent = this.#component;
    const points = this.#pointsModel.points;
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    this.#component = new TripInfo({ info: getTripInfo({ points, destinations, offers }) });

    if (!previousComponent) {
      render(this.#component, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#component, previousComponent);
    remove(previousComponent);
  };
}
