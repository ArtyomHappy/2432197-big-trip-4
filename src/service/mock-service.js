import { generateDestination } from '../mock/destination';
import { generateOffer } from '../mock/offer';
import { generatePoint } from '../mock/tripPoint';
import { getRandomNumber, getRandomArrayElement } from '../util';

const ROUTE_TYPES = ['taxi', 'bus', 'train', 'ship', 'check-in', 'restaurant', 'drive', 'flight', 'sightseeing'];

export default class MockService {
  destinations = [];
  offers = [];
  points = [];

  constructor() {
    this.destinations = this.generateDestinations();
    this.offers = this.generateOffers();
    this.points = this.generatePoints();
  }

  getDestinations() { return this.destinations; }
  getOffers() { return this.offers; }
  getPoints() { return this.points; }

  generateDestinations() {
    return Array.from({ length: 5 }, () => generateDestination());
  }

  generateOffers() {
    return ROUTE_TYPES.map((type) => ({
      type,
      offers: Array.from({ length: getRandomNumber(0, 5) }, () => generateOffer(type))
    }));
  }

  generatePoints() {
    return Array.from({ length: 5 }, () => {
      const type = getRandomArrayElement(ROUTE_TYPES);
      const destination = getRandomArrayElement(this.destinations);
      const hasOffers = Boolean(getRandomNumber(0, 1));
      const offersByType = this.offers.find((offerType) => offerType.type === type);
      const offersIds = (hasOffers) ? offersByType.offers.slice(0, getRandomNumber(0, 5)).map((offer) => offer.id) : [];
      return generatePoint(type, destination.id, offersIds);
    });
  }
}
