import {templates, select, settings} from '../settings.js';
import utils from '../utils.js';
import Carousel from './Carousel.js';

class Home{
  constructor(data){
    console.log(data);
    this.render(data);
    this.initWidget();
    this.initActions();
  }

  render(data){
    this.data = data;
    // console.log(this.data);

    Handlebars.registerHelper('openHours', function() {
      return `${settings.hours.open}PM - ${settings.hours.close} AM`;
    });


    // console.log(document.querySelector(select.templateOf.homePage));
    const generatedHTML = templates.homePage(this.data);
    // console.log(generatedHTML);
    this.element = utils.createDOMFromHTML(generatedHTML);
    this.dom = {};

    this.dom.wrapper = document.querySelector(select.containerOf.homeContainer);

    this.dom.wrapper.appendChild(this.element);
  }

  initWidget(){
    this.dom.carousel = this.dom.wrapper.querySelector(select.home.carousel);
    //initWidget on element this.dom.carousel with class Carousel
    new Carousel(this.dom.carousel);
  }

  initActions(){
    this.dom.gallery = this.dom.wrapper.querySelector(select.home.gallery);

    this.dom.gallery.addEventListener('click', function(event){
      event.preventDefault();
    });
  }
}

export default Home;