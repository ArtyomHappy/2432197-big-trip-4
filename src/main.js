import { render, RenderPosition } from './render';
import Destination from './view/destination';
import Filter from './view/filter';
import RoutePresenter from './presenter/route-presenter';
import MockService from './service/mock-service';
import DestinationsModel from './model/destination-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';

// const siteDestinationContainer = document.querySelector('.trip-main');
// const siteFilterContainer = document.querySelector('.trip-controls__filters');
// const siteSortContainer = document.querySelector('.trip-events');
// const routePresenter = new RoutePresenter({routeContainer: siteSortContainer});

// render(new Destination(), siteDestinationContainer, RenderPosition.AFTERBEGIN);
// render(new Filter(), siteFilterContainer);
// render(new Sorting(), siteSortContainer);

// routePresenter.init();

const siteDestinationContainer = document.querySelector('.trip-main');
const siteFilterContainer = document.querySelector('.trip-controls__filters');
const siteSortContainer = document.querySelector('.trip-events');

const mockService = new MockService();

const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const routePresenter = new RoutePresenter({
  tripContainer: siteSortContainer,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new Destination(), siteDestinationContainer, RenderPosition.AFTERBEGIN);
render(new Filter(), siteFilterContainer);

routePresenter.init();
