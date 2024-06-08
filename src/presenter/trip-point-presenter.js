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

  constructor({ container, onDataChange, onModeChange, destinationsModel, offersModel }) {
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(point) {
    this.#point = point;

    const previousPointComponent = this.#pointComponent;
    const previousEditorComponent = this.#editorComponent;

    this.#pointComponent = new TripPoint({
      point: this.#point,
      destination: this.#destinationsModel.getById(point.destination),
      offers: this.#offersModel.getByType(point.type),
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick,
    });

    this.#editorComponent = new EditorEvent({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormReset: this.#onFormReset,
      onFormSubmit: this.#onFormSubmit,
      onDeleteClick: this.#onDeleteClick
    });

    if (!previousPointComponent || !previousEditorComponent) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode !== Mode.EDITING) {
      replace(this.#pointComponent, previousPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, previousEditorComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(previousPointComponent);
    remove(previousEditorComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editorComponent);
  }

  resetMode = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#switchToPoint();
    }
  };

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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editorComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editorComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #switchToPoint() {
    replace(this.#pointComponent, this.#editorComponent);
    document.removeEventListener('keydown', this.#onEscape);
    this.#mode = Mode.DEFAULT;
  }

  #switchToEditor() {
    replace(this.#editorComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscape);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #onEscape = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editorComponent.reset(this.#point);
      this.#switchToPoint();
    }
  };

  #onEditClick = () => {
    this.#switchToEditor();
  };

  #onFavoriteClick = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #onFormSubmit = (update) => {
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

  #onFormReset = () => {
    this.#editorComponent.reset(this.#point);
    this.#switchToPoint();
  };

  #onDeleteClick = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
