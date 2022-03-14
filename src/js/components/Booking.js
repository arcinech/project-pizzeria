import { templates } from '../settings.js';

class Booking{
  constructor(element){
    this.getElements(element);
    this.renderBooking(element);
    this.initWidgets();
  }

  getElements(element){
    const thisBooking = this;
    thisBooking.dom  = {};
    thisBooking.dom.wrapper = element;
  }

  renderBooking(element){
    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();

    element.innerHTML = generatedHTML;
  }

  initWidgets(){

  }
}

export default Booking;