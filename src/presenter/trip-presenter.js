import { RenderPosition, render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripPointPresenter from './trip-point-presenter.js';
import NewTripPointPresenter from './new-trip-point-presenter.js';
import Sorting from '../view/sorting.js';
import EmptyList from '../view/empty-list.js';
import Loading from '../view/loading.js';
import Error from '../view/error.js';
import { sortByPrice, sortByTime, sortByDay } from '../utils/sorting.js';
import { filter } from '../utils/filter.js';
import { TimeLimits, SortingType, FilterType, UpdateType, UserAction } from '../constants.js';

export default class TripPresenter {
  #container = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #pointsList = null;
  #sortingComponent = null;
  #emptyListComponent = null;
  #loadingComponent = new Loading();
  #errorComponent = new Error();
  #isLoading = true;
  #isError = false;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #newEventButton = null;
  #currentSortingType = SortingType.DAY;
  #filterType = FilterType.EVERYTHING;
  #onNewPointDestroy = null;
  #isCreatingNewPoint = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimits.LOWER_LIMIT,
    upperLimit: TimeLimits.UPPER_LIMIT
  });

  constructor({ tripContainer, pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy, newEventButtonComponent }) {
    this.#container = tripContainer;
    this.#pointsList = tripContainer.querySelector('.trip-events__list');
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;
    this.#newEventButton = newEventButtonComponent;

    this.#newPointPresenter = new NewTripPointPresenter({
      container: this.#pointsList,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#onDataChange,
      onDestroy: this.#onDestroy
    });

    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
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

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderError() {
    render(this.#errorComponent, this.#container);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyList({
      filterType: this.#filterType
    });

    render(this.#emptyListComponent, this.#container);
  }

  #renderSorting() {
    this.#sortingComponent = new Sorting({
      onSortTypeChange: this.#onSortTypeChange,
      currentSortType: this.#currentSortingType
    });

    render(this.#sortingComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderList(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new TripPointPresenter({
      container: this.#pointsList,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#onDataChange,
      onModeChange: this.#onModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModelEvent = (updateType, data) => {
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
          this.#newEventButton.element.disabled = true;
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

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortingType === sortType) {
      return;
    }

    this.#currentSortingType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #onDestroy = ({ isCanceled }) => {
    this.#isCreatingNewPoint = false;
    this.#onNewPointDestroy();

    if (!this.points.length && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };
}
