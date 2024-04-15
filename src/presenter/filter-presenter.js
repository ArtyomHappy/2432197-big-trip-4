import { render } from '../framework/render';
import Filter from '../view/filter';
import { generateFilter } from '../mocks/filter';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filters = null;

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filters = generateFilter(this.#pointsModel.get());
  }

  init() { render(new Filter(this.#filters), this.#container); }
}
