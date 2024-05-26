export default class PointsModel {
  #service = null;
  #points = [];

  constructor(service) {
    this.#service = service;
    this.#points = this.service.getPoints();
  }

  get() {
    return this.#points;
  }
}
