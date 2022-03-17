import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.freeTable = '';
    thisBooking.initWidgets();
    thisBooking.getData();


  }

  getData(){
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey   + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,      
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,     
      ],
    };

    // // // console.log('getData params', params);

    const urls = {
      booking:      settings.db.url + '/' + settings.db.bookings 
                                    + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.events  
                                    + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.events   
                                    + '?' + params.eventsRepeat.join('&'),
    };
    // // // console.log('getData urls', urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json()
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
      
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = this.datePicker.minDate;
    const maxDate = this.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){

        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){

          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }

      }
    }

    // // console.log('this.booked', this.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){

    if(typeof this.booked[date] == 'undefined'){
      this.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);


    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if(typeof this.booked[date][hourBlock] == 'undefined'){
        this.booked[date][hourBlock] = [];
      }
      this.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }

      table.classList.remove(classNames.booking.selectedTable);
    }
  }

  render(element){
    const thisBooking = this;
    thisBooking.dom  = {};
    
    thisBooking.dom.wrapper = element;
    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.containerOf.floorPlan);

    //using phone and adress select from cart inside booking wrapper
    thisBooking.dom.phoneNumber = thisBooking.dom.wrapper.querySelector(select.cart.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.cart.address);

    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    thisBooking.dom.submitReservation = thisBooking.dom.wrapper.querySelector(select.booking.submit);
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
      this.freeTable = '';
    });

    thisBooking.dom.floorPlan.addEventListener('click', function(event){
      thisBooking.initTables(event);     
    });

    thisBooking.dom.submitReservation.addEventListener('click', function(event){
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }

  
  bookTable(event){
    const thisBooking = this;
    
    const clickedElementId = event.getAttribute(settings.booking.tableIdAttribute);

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(tableId != clickedElementId) table.classList.remove(classNames.booking.selectedTable);
      else table.classList.toggle(classNames.booking.selectedTable);
    }

    if (thisBooking.freeTable != clickedElementId) thisBooking.freeTable = clickedElementId;
    else thisBooking.freeTable = '';
  }
  
  initTables(event){
    const thisBooking = this;
    const clickedElementClass = event.target.className;
    if (clickedElementClass.includes(classNames.booking.table)){
      if(clickedElementClass.includes(classNames.booking.tableBooked)){
        window.alert('Table ocupied!');
      } else if (!clickedElementClass.includes(classNames.booking.tableBooked)){
        thisBooking.bookTable(event.target);
      }
    }
  }


  sendBooking(){
    const thisBooking =this;

    const url = settings.db.url + '/' + settings.db.bookings;

    const booking = {};

    booking.table = parseInt(thisBooking.freeTable);
    booking.date = thisBooking.datePicker.value;
    booking.hour = thisBooking.hourPicker.value;
    booking.duration = parseInt(thisBooking.hoursAmount.value);
    booking.ppl = parseInt(thisBooking.peopleAmount.value);
    booking.phone = thisBooking.dom.phoneNumber.value;
    booking.address = thisBooking.dom.address.value;
    booking.starters = [];
  
    for(let starter of thisBooking.dom.starters){
      const starterCheckbox = starter.querySelector(select.booking.starter);
      // console.log(starterCheckbox);
      if(starterCheckbox.checked){
        booking.starters.push(starterCheckbox.value);
      }
    }
    // console.log(booking.table);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    };

    // console.log(booking.phone, booking.address, booking.table);
    if(booking.phone
      && booking.address
      && booking.table
    ){
      fetch(url, options)
        .then(thisBooking.makeBooked(booking.date, booking.hour, booking.duration, booking.table));
      thisBooking.updateDOM();
      thisBooking.resetValues();
    } else {
      window.alert('Please, fill data for reservation!');
    }
  }

  resetValues(){
    const thisBooking = this;

    thisBooking.dom.phoneNumber.value = '';
    thisBooking.dom.address.value = '';
    for(let starter of thisBooking.dom.starters){
      const starterCheckbox = starter.querySelector(select.booking.starter);
      starterCheckbox.checked = false;
    }
  }
}

export default Booking;
