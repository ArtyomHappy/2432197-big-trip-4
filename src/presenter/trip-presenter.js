import { RenderPosition, render, remove } from '../framework/render';
import { sortByPrice, sortByTime, sortByDay } from '../utils/sort';
import { filter } from '../utils/filter';
import TripPointPresenter from './trip-point-presenter';
import NewTripPointPresenter from './new-trip-point-presenter';
import Sorting from '../view/sorting';
import EmptyList from '../view/empty-list';
import Loading from '../view/loading';
import Error from '../view/error';
import { TimeLimits, SortingType, FilterType, UpdateType, UserAction } from '../constants';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

export default class TripPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #pointsList = null;
  #sortingComponent = null;
  #emptyListComponent = null;
  #loadingComponent = new Loading();
  #errorComponent = new Error();
  #isLoading = true;
  #isError = false;
  #currentSortingType = SortingType.DAY;
  #filterType = FilterType.EVERYTHING;
  #newPointButton = null;
  #onNewPointDestroy = null;
  #isCreatingNewPoint = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimits.LOWER_LIMIT,
    upperLimit: TimeLimits.UPPER_LIMIT
  });

  constructor({ container, pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy, newPointButton }) {
    this.#container = container;
    this.#pointsList = container.querySelector('.trip-events__list');
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;
    this.#newPointButton = newPointButton;

    this.#newPointPresenter = new NewTripPointPresenter({
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      pointListContainer: this.#pointsList,
      onDataChange: this.#onDataChange,
      onDestroy: this.#onDestroy
    });

    this.#offersModel.addObserver(this.#handlePointsModelEvent);
    this.#destinationsModel.addObserver(this.#handlePointsModelEvent);
    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
    this.#filterModel.addObserver(this.#handlePointsModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;

    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortingType) {
      case SortingType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortingType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortingType.TIME:
        return filteredPoints.sort(sortByTime);
    }

    return filteredPoints;
  }

  createPoint() {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    this.#isCreatingNewPoint = true;
    this.#currentSortingType = SortingType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  init() {
    this.#renderBoard();
  }

  #clearBoard({ resetSortingType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortingComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    remove(this.#loadingComponent);

    if (resetSortingType) {
      this.#currentSortingType = SortingType.DAY;
    }
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isError) {
      this.#renderError();
      return;
    }

    if (!this.#isCreatingNewPoint) {
      if (!this.points.length) {
        this.#renderEmptyList();
        return;
      }
    }
    this.#renderSorting();
    this.#renderList(this.points);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyList({ filterType: this.#filterType });
    render(this.#emptyListComponent, this.#container);
  }

  #renderSorting() {
    this.#sortingComponent = new Sorting({
      onSortTypeChange: this.#onSortingTypeChange,
      currentSortType: this.#currentSortingType
    });

    render(this.#sortingComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderList(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new TripPointPresenter({
      pointsListContainer: this.#pointsList,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#onDataChange,
      onModeChange: this.#onModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderError() {
    render(this.#errorComponent, this.#container);
  }

  #onDestroy = ({ isCanceled }) => {
    this.#isCreatingNewPoint = false;
    this.#onNewPointDestroy();

    if (!this.points.length && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #handlePointsModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        if (data.isError) {
          this.#isError = true;
          this.#newPointButton.element.disabled = true;
        }
        this.#isLoading = false;

        remove(this.#loadingComponent);
        remove(this.#errorComponent);

        this.#clearBoard();
        this.#renderBoard();

        break;
    }
  };

  #onDataChange = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();

        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }

        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();

        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }

        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();

        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }

        break;
    }

    this.#uiBlocker.unblock();
  };

  #onModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #onSortingTypeChange = (sortType) => {
    if (this.#currentSortingType === sortType) {
      return;
    }

    this.#currentSortingType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };
}
