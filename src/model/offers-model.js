import Observable from '../framework/observable.js';
import { UpdateType } from '../constants.js';

export default class OffersModel extends Observable {
  #offers = [];
  #service = null;

  constructor({ offersApiService }) {
    super();

    this.#service = offersApiService;
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
