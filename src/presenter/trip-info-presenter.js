import { RenderPosition, render, replace, remove } from '../framework/render.js';
import TripInfo from '../view/trip-info.js';
import { getTripInfo } from '../utils/trip-info.js';

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

    this.#pointsModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderTripInfo();
  }

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

  #handleModelChange = () => {
    this.init();
  };
}
