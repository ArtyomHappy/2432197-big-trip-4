import dayjs from 'dayjs';
import { sortByDay } from './sort';

function createTripView(destinations) {
  let pathView = '';

  if (destinations.length < 4) {
    destinations.forEach((destination, index) => {
      if (index !== destinations.length - 1) {
        pathView += `${destination} &mdash; `;
      } else {
        pathView += `${destination}`;
      }
    });
  } else {
    pathView = `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}`;
  }

  return pathView;
}

function createDatesView(dateFirst, dateSecond) {
  return dateFirst && dateSecond ? `${dayjs(dateFirst).format('D MMM').toUpperCase()}&nbsp;&mdash;&nbsp;${dayjs(dateSecond).format('D MMM').toUpperCase()}` : '';
}

function getTripInfo({ points, destinations, offers }) {
  if (!points || !destinations || !offers) {
    return { destinationsString: '', datesString: '', total: 0 };
  }

  const sortedPoints = [...points.sort(sortByDay)];
  const trip = [];
  let totalTrips = 0;

  sortedPoints.forEach((point) => {
    const currentDestination = destinations.find((destination) => destination.id === point.destination).name;

    trip.push(currentDestination);

    const currentOffers = offers.find((offer) => offer.type === point.type).offers;

    currentOffers.forEach((offer) => {
      if (point.offers.includes(offer.id)) {
        totalTrips += offer.price;
      }
    });

    totalTrips += point.basePrice;
  });

  return {
    destinationsString: createTripView(trip),
    datesString: createDatesView(sortedPoints[0]?.dateFrom, sortedPoints[sortedPoints.length - 1]?.dateTo),
    total: totalTrips
  };
}

export { getTripInfo };
