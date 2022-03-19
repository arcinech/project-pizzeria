import {templates, select, settings} from '../settings.js';
import utils from '../utils.js';

class Home{
  constructor(data){
    console.log(data);
    this.render(data);
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

    const homeContainer = document.querySelector(select.containerOf.homeContainer);

    homeContainer.appendChild(this.element);
  }

  initWidget(){
    const carrousel = this.querySelector('.main-carousel');
    let flkty = new Flickity(carrousel);
  }
}

export default Home;