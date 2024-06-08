import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class FlatPicker {
  #flatPicker = null;

  constructor({ element, defaultDate, minDate = null, maxDate = null, onClose }) {
    this.#flatPicker = flatpickr(element, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true,
      defaultDate,
      minDate,
      maxDate,
      onClose,
    });
  }

  setMaxDate = (date) => {
    this.#flatPicker.set('maxDate', date);
  };

  setMinDate = (date) => {
    this.#flatPicker.set('minDate', date);
  };

  destroy = () => {
    this.#flatPicker.destroy();
  };
}
