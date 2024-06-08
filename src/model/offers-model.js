import Observable from '../framework/observable';
import { UpdateType } from '../constants';

export default class OffersModel extends Observable {
  #offers = [];
  #service = null;

  constructor({ service }) {
    super();

    this.#service = service;
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    return this.offers.find((offer) => offer.type === type)?.offers;
  }

  async init() {
    try {
      const offers = await this.#service.offers;
      this.#offers = offers;
    } catch (error) {
      this.#offers = [];
      this._notify(UpdateType.INIT, { isError: true });
    }
  }
}
