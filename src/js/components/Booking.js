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
    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    this.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('change', function(){

    });
    thisBooking.dom.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('change', function(){

    });

  }
}

export default Booking;