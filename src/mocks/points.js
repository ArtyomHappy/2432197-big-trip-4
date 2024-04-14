import { getDate, getRandomNumber } from '../util';

function generatePoint(type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomNumber(1, 1000),
    dateFrom: getDate( {next: false} ),
    dateTo: getDate( {next: true} ),
    destination: destinationId,
    isFavorite: Boolean(getRandomNumber(0, 1)),
    offers: offerIds,
    type
  };
}

export { generatePoint };
