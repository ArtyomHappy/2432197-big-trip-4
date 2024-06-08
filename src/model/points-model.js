import Observable from '../framework/observable';
import { UpdateType } from '../constants';

export default class PointsModel extends Observable {
  #points = [];
  #service = null;

  constructor({ service }) {
    super();

    this.#service = service;
  }

  get points() {
    return this.#points;
  }

  async addPoint(updatedType, updatedPoint) {
    try {
      const response = await this.#service.addPoint(updatedPoint);
      const newPoint = this.#adaptToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updatedType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updatedType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#service.deletePoint(updatedPoint);
      this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];
      this._notify(updatedType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  async updatePoint(updatedType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#service.updatePoint(updatedPoint);
      const newPoint = this.#adaptToClient(response);

      this.#points = [...this.#points.slice(0, index), newPoint, ...this.#points.slice(index + 1)];
      this._notify(updatedType, newPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async init() {
    try {
      const points = await this.#service.points;

      this.#points = points.map(this.#adaptToClient);
      this._notify(UpdateType.INIT, { isError: false });
    } catch (err) {
      this.#points = [];
      this._notify(UpdateType.INIT, { isError: true });
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
