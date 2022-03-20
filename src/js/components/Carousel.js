class Carousel {
  constructor(element){

    this.render(element);
    this.initPlugin();
  }

  render(element){
    this.carousel = element;
  }

  initPlugin(){
    // eslint-disable-next-line no-undef
    new Flickity( this.carousel, {
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false,
      wrapAround: true,
      autoPlay: true
    });
  }
}

export default Carousel;