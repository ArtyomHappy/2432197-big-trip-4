import { RenderPosition, render, remove } from '../framework/render.js';
import EditorEvent from '../view/editor-event.js';
import { UpdateType, EditingType, UserAction } from '../constants.js';

export default class NewTripPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #editorComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;

  constructor({ container, handleDataChange, handleDestroy, offersModel, destinationsModel }) {
    this.#container = container;
    this.#handleDataChange = handleDataChange;
    this.#handleDestroy = handleDestroy;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    if (this.#editorComponent) {
      return;
    }

    this.#editorComponent = new EditorEvent({
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#onFormSubmit,
      onDeleteClick: this.#onDeleteClick,
      type: EditingType.NEW
    });

    render(this.#editorComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscape);
  }

  destroy({ isCanceled = true } = {}) {
    if (!this.#editorComponent) {
      return;
    }

    remove(this.#editorComponent);
    this.#editorComponent = null;
    document.removeEventListener('keydown', this.#onEscape);
    this.#handleDestroy({ isCanceled });
  }

  setAborting() {
    const reset = () => {
      this.#editorComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editorComponent.shake(reset);
  }

  setSaving() {
    this.#editorComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  #onEscape = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #onDeleteClick = () => {
    this.destroy();
  };
}
