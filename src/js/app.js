
import { select, settings, classNames } from './settings.js';
import Cart from './components/Cart.js';
import Product from './components/Product.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';


const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    // const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;

    // Commented to make main page always active on reload.
    // for(const page of thisApp.pages){
    //   if(page.id == idFromHash){
    //     pageMatchingHash = page.id;
    //     break;
    //   }
    // }

    thisApp.activatePage(pageMatchingHash);

    window.location.hash = '#/' + pageMatchingHash;

    thisApp.addListenerForPageChange(select.nav.linksWrapper);

  },

  addListenerForPageChange(linksWrapper){
    const thisApp = this;
    const linksWrapperElement = document.querySelector(linksWrapper);

    linksWrapperElement.addEventListener('click', function(event){
      event.preventDefault();

      const clickedElement = event.target;
      let id = '';

      if (clickedElement.tagName == 'A'){
        id = clickedElement.getAttribute(select.all.hrefAtt).replace('#', '');
      } else if (clickedElement.hasAttribute(select.all.dataHref)){
        id = clickedElement.getAttribute(select.all.dataHref).replace('#', '');
      } else {
        id = clickedElement.parentElement.getAttribute(select.all.dataHref).replace('#', '');
      }
      

      thisApp.activatePage(id);
      window.location.hash = '#/' + id;

    });
  },

  activatePage: function(pageId){
    const thisApp = this;

    for(let page of thisApp.pages){
      page.classList.toggle(
        classNames.pages.active, 
        page.id == pageId
      );
    }

    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.pages.active, 
        link.getAttribute('href')  == '#' + pageId
      );
    }
  },

  initMenu: function(){
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initHome: function(){
    const thisApp = this;

    thisApp.home = new Home(thisApp.data.homePage);
    // call for addListenerForPageChange here method to avoid
    // undefined value for querySelector of select.home.links
    thisApp.addListenerForPageChange(select.home.linksWrapper);
    
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};

    const urls = {
      products: settings.db.url + '/' + settings.db.products,
      homePage: settings.db.url + '/' + settings.db.homePage,
    };

    Promise.all([
      fetch(urls.products),
      fetch(urls.homePage),
    ])
      .then(function(allResponses){
        const productResponses = allResponses[0];
        const homePageResponses = allResponses[1];
        return Promise.all([
          productResponses.json(),
          homePageResponses.json()
        ]);
      })
      .then(function([products, homePage]){
        thisApp.data.products = products;
        /* execute initMenu method */
        thisApp.initMenu();

        /* execute initHome method */
        thisApp.data.homePage = homePage;
        thisApp.initHome();
      });
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product.prepareCartProduct());
    });
  },

  initBooking: function(){
    const bookingElem = document.querySelector(select.containerOf.booking);
    new Booking(bookingElem);
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();

