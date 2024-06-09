import { render } from './framework/render.js';
import TripPresenter from './presenter/trip-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButton from './view/new-event-button.js';
import Points from './api-service/points.js';
import Destinations from './api-service/destinations.js';
import Offers from './api-service/offers.js';
import { AUTHORIZATION, ADDRESS } from './constants.js';

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
