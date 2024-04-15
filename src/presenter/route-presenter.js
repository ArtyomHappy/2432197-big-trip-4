import RouteInfo from '../view/route-info';
import EditorEvent from '../view/editor-event';
import RoutePoint from '../view/route-point';
import Sorting from '../view/sorting';
import { render, replace } from '../framework/render';

export default class TripPresenter {
  #tripContainer = null;
  #pointList = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

  constructor( {tripContainer, destinationsModel, offersModel, pointsModel} ) {
    this.#tripContainer = tripContainer;
    this.#pointList = new RouteInfo();
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#points = [...pointsModel.get()];
  }

  init(){
    render(new Sorting(), this.#tripContainer);
    render(this.#pointList, this.#tripContainer);
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point){
    const pointComponent = new RoutePoint({
      point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onRedactorClick: pointRedactorClickHandler,
    }
    );
    const redactorComponent = new EditorEvent({
      point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onFormSubmit: pointSubmitHandler,
      onResetClick: resetButtonClickHandler,
    });

    const onEscape = (evt) =>{
      if(evt.key === 'Escape'){
        evt.preventDefault();
        replace(pointComponent, redactorComponent);
        document.removeEventListener('keydown', onEscape);
      }
    };

    function pointRedactorClickHandler(){
      replace(redactorComponent, pointComponent);
      document.addEventListener('keydown', onEscape);
    }

    function pointSubmitHandler(){
      replace(pointComponent, redactorComponent);
      document.removeEventListener('keydown', onEscape);
    }

    function resetButtonClickHandler(){
      replace(pointComponent, redactorComponent);
      document.removeEventListener('keydown', onEscape);
    }

    render(pointComponent, this.#pointList.element);
  }
}
