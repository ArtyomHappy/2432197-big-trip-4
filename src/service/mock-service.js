import { generateDestination } from '../mocks/destination';
import { generateOffer } from '../mocks/offer';
import { generatePoint } from '../mocks/points';
import { getRandomNumber, getRandomArrayElement } from '../utils/general';

const ROUTE_TYPES = ['taxi', 'bus', 'train', 'ship', 'check-in', 'restaurant', 'drive', 'flight', 'sightseeing'];

export default class MockService {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    this.#destinations = this.generateDestinations();
    this.#offers = this.generateOffers();
    this.#points = this.generatePoints();
  }

  get destinations() { return this.#destinations; }
  get offers() { return this.#offers; }
  get points() { return this.#points; }

  generateDestinations() {
    return Array.from({ length: 5 }, generateDestination);
  }

  generateOffers() {
    return ROUTE_TYPES.map((type) => ({
      type,
      offers: Array.from({ length: getRandomNumber(0, 5) }, generateOffer)
    }));
  }

  generatePoints() {
    return Array.from({ length: 5 }, () => {
      const type = getRandomArrayElement(ROUTE_TYPES);
      const destination = getRandomArrayElement(this.#destinations);
      const hasOffers = Boolean(getRandomNumber(0, 1));
      const offersByType = this.#offers.find((offerType) => offerType.type === type);
      const offersIds = (hasOffers) ? offersByType.offers.slice(0, getRandomNumber(0, 5)).map((offer) => offer.id) : [];
      return generatePoint(type, destination.id, offersIds);
    });
  }
}
