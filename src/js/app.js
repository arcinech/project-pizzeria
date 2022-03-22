
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
    thisApp.homeLinks = document.querySelectorAll(select.home.links);
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(const page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }

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

    thisApp.home = new Home(thisApp.data.homePageData);

    thisApp.home.links = document.querySelectorAll(select.home.links);

    for(let link of thisApp.home.links){
      link.addEventListener('click', function(event){
        event.preventDefault();
        let clickedElement = event.target;
        console.log(clickedElement);
        if(clickedElement.offsetParent.className == select.home.link) {
          clickedElement = clickedElement.offsetParent;
        }

        console.log(event.target);
        const id = clickedElement.getAttribute(select.home.dataHref).replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }


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
        thisApp.data.homePageData = homePage;
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

    thisApp.initData();
    thisApp.initPages();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();

