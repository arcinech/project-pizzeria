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
      prevNextButtons: false,
      wrapAround: true,
      imagesLoaded: true,
      autoPlay: true
    });
  }
}

export default Carousel;