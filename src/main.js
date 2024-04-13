import { render, RenderPosition } from './render';
import Destination from './view/destination';
import Filter from './view/filter';
import Sorting from './view/sorting';
import RoutePresenter from './presenter/route-presenter';

const siteDestinationContainer = document.querySelector('.trip-main');
const siteFilterContainer = document.querySelector('.trip-controls__filters');
const siteSortContainer = document.querySelector('.trip-events');
const routePresenter = new RoutePresenter({routeContainer: siteSortContainer});

render(new Destination(), siteDestinationContainer, RenderPosition.AFTERBEGIN);
render(new Filter(), siteFilterContainer);
render(new Sorting(), siteSortContainer);

routePresenter.init();
