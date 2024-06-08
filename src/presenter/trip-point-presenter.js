import { render, replace, remove } from '../framework/render.js';
import EditorEvent from '../view/editor-event.js';
import TripPoint from '../view/trip-point.js';
import { areDatesEqual, arePricesEqual } from '../utils/point.js';
import { Mode, UpdateType, UserAction } from '../constants.js';

export default class TripPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #point = null;
  #pointComponent = null;
  #editorComponent = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointsListContainer, onDataChange, onModeChange, destinationsModel, offersModel }) {
    this.#container = pointsListContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editorComponent);
  }

  resetMode = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  };

  init(point) {
    this.#point = point;

    const previousPointComponent = this.#pointComponent;
    const previousEditorComponent = this.#editorComponent;

    this.#pointComponent = new TripPoint({
      point: this.#point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editorComponent = new EditorEvent({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormReset: this.#handleFormReset,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (!previousPointComponent || !previousEditorComponent) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, previousPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, previousEditorComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(previousPointComponent);
    remove(previousEditorComponent);
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetState = () => {
      this.#editorComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editorComponent.shake(resetState);
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editorComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editorComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  #replaceCardToForm() {
    replace(this.#editorComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editorComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editorComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !areDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      !areDatesEqual(this.#point.dateTo, update.dateTo) ||
      !arePricesEqual(this.#point.basePrice, update.basePrice);

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #handleFormReset = () => {
    this.#editorComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
