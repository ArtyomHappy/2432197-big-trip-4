import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate() {
  return '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>';
}

export default class NewEventButton extends AbstractView {
  #onClick = null;

  constructor({ onClick }) {
    super();

    this.#onClick = onClick;
    this.element.addEventListener('click', this.#clickButtonHandler);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #clickButtonHandler = (evt) => {
    evt.preventDefault();
    this.#onClick();
  };
}
