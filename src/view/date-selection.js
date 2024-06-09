import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class DateSelection {
  #date = null;

  constructor({ element, defaultDate, minDate = null, maxDate = null, onClose }) {
    this.#date = flatpickr(element, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: { firstDayOfWeek: 1 },
      'time_24hr': true,
      defaultDate,
      minDate,
      maxDate,
      onClose
    });
  }

  setMaxDate = (date) => {
    this.#date.set('maxDate', date);
  };

  setMinDate = (date) => {
    this.#date.set('minDate', date);
  };

  destroy = () => {
    this.#date.destroy();
  };
}
