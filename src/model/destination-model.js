import Observable from '../framework/observable.js';
import { UpdateType } from '../constants.js';

export default class DestinationModel extends Observable {
  #destinations = [];
  #service = null;

  constructor({ service }) {
    super();

    this.#service = service;
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => (destination.id === id));
  }

  async init() {
    try {
      const destinations = await this.#service.destinations;

      this.#destinations = destinations;
    } catch (error) {
      this.#destinations = [];
      this._notify(UpdateType.INIT, { isError: true });
    }
  }
}
