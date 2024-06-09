import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(tripInfo) {
  const { destinationsString, datesString, total } = tripInfo;
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${destinationsString}</h1>

      <p class="trip-info__dates">${datesString}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>
  </section>`;
}

export default class TripInfo extends AbstractView {
  #tripInfo = null;

  constructor({ info }) {
    super();

    this.#tripInfo = info;
  }

  get template() {
    return createTripInfoTemplate(this.#tripInfo);
  }
}
