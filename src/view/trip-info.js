import AbstractView from '../framework/view/abstract-view';

function createTripInfoTemplate(tripInfo) {
  const { destinations, dates, total } = tripInfo;

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${destinations}</h1>

      <p class="trip-info__dates">${dates}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>
  </section>`;
}

export default class TripInfo extends AbstractView {
  #tripInfo = null;

  constructor({ tripInfo }) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    return createTripInfoTemplate(this.#tripInfo);
  }
}
