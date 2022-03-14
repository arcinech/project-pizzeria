import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking{
  constructor(element){
    this.render(element);
    this.initWidgets();
  }

  render(element){
    const thisBooking = this;
    thisBooking.dom  = {};
    console.log(element);
    thisBooking.dom.wrapper = element;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    this.dom.wrapper.innerHTML = generatedHTML;
  }

  initWidgets(){
    this.peopleAmount = new AmountWidget(this.dom.peopleAmount);
    this.dom.peopleAmount.addEventListener('change', function(){

    });
    this.dom.hoursAmount = new AmountWidget(this.dom.hoursAmount);
    this.dom.hoursAmount.addEventListener('change', function(){

    });

  }
}

export default Booking;