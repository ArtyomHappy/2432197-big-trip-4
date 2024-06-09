import { RenderPosition, render, remove } from '../framework/render.js';
import EditorEvent from '../view/editor-event.js';
import { UpdateType, EditingType, UserAction } from '../constants.js';

export default class NewTripPointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #editorComponent = null;
  #onDataChange = null;
  #onDestroy = null;

  constructor({ container, destinationsModel, offersModel, onDataChange, onDestroy }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
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

  setCanceling() {
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
    this.#editorComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  destroy({ isCanceled = true } = {}) {
    if (!this.#editorComponent) {
      return;
    }

    remove(this.#editorComponent);
    this.#editorComponent = null;
    document.removeEventListener('keydown', this.#onEscape);
    this.#onDestroy({ isCanceled });
  }

  #onFormSubmit = (point) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #onDeleteClick = () => { this.destroy(); };

  #onEscape = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
