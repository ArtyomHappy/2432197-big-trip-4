import { render } from './framework/render';
import TripPresenter from './presenter/trip-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import FilterPresenter from './presenter/filter-presenter';
import DestinationModel from './model/destination-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import NewEventButton from './view/new-event-button';
import Destinations from './api-service/destinations';
import Offers from './api-service/offers';
import Points from './api-service/points';
import { AUTHORIZATION, ADDRESS } from './constants';

const mainHeaderContainer = document.querySelector('.trip-main');
const tripContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel({ service: new Points(ADDRESS, AUTHORIZATION) });
const destinationsModel = new DestinationModel({ service: new Destinations(ADDRESS, AUTHORIZATION) });
const offersModel = new OffersModel({ service: new Offers(ADDRESS, AUTHORIZATION) });
const filterModel = new FilterModel();

const newEventButtonComponent = new NewEventButton({
  onClick: onClickNewEventButton
});

const tripPresenter = new TripPresenter({
  tripContainer,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: onNewPointDestroy,
  newEventButtonComponent
});

const tripInfoPresenter = new TripInfoPresenter({
  container: mainHeaderContainer,
  pointsModel,
  destinationsModel,
  offersModel
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

function onClickNewEventButton() {
  tripPresenter.createPoint();
  newEventButtonComponent.element.disabled = true;
}

function onNewPointDestroy() {
  newEventButtonComponent.element.disabled = false;
}

async function initModels() {
  await destinationsModel.init();
  await offersModel.init();
  await pointsModel.init();
  render(newEventButtonComponent, mainHeaderContainer);
}

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();
initModels();
