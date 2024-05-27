import { render, RenderPosition } from './framework/render';
import Destination from './view/destination';
import FilterPresenter from './presenter/filter-presenter';
import RoutePresenter from './presenter/route-presenter';
import MockService from './service/mock-service';
import DestinationsModel from './model/destination-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';

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

const filterPresenter = new FilterPresenter( { container: siteFilterContainer, pointsModel } );

render(new Destination(), siteDestinationContainer, RenderPosition.AFTERBEGIN);

routePresenter.init();
filterPresenter.init();

// 7.10. Меняй-удаляй: не успеваю до дедлайна, доделаю к защите
