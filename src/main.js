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
import { AUTHORIZATION, END_POINT } from './constants';

const headerInfoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');

const destinationsModel = new DestinationModel({ destinationsApiService: new Destinations(END_POINT, AUTHORIZATION) });
const offersModel = new OffersModel({ offersApiService: new Offers(END_POINT, AUTHORIZATION) });
const pointsModel = new PointsModel({ pointsApiService: new Points(END_POINT, AUTHORIZATION) });
const filterModel = new FilterModel();

const newPointButtonComponent = new NewEventButton({
  onClick: handleNewPointButtonClick
});

const tripInfoPresenter = new TripInfoPresenter({
  container: headerInfoContainer,
  pointsModel,
  destinationsModel,
  offersModel
});

const tripPresenter = new TripPresenter({
  tripContainer,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
  newPointButtonComponent
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

async function initModels() {
  await destinationsModel.init();
  await offersModel.init();
  await pointsModel.init();
  render(newPointButtonComponent, headerInfoContainer);
}

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();
initModels();
