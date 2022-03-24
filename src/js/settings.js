export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget',
    homePage: '#template-home-page',
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',
    booking: '.booking-wrapper',
    floorPlan: '.floor-plan',
    homeContainer: '#home-page',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
    dataHref: 'data-href',
    hrefAtt: 'href',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
    datePicker: {
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    },
  },
  booking: {
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
    starters: '.booking-options .checkbox',
    starter: 'input[name="starter"]',
    submit: '.order-confirmation [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  nav: {
    links: '.main-nav a',
    linksWrapper: '.main-nav',
  },
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  home: {
    linksWrapper: '.home-links',
    carousel: '.main-carousel',
    gallery: '.gallery',
  }
  // CODE ADDED END
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  cart: {
    wrapperActive: 'active',
  },
  booking: {
    loading: 'loading',
    tableBooked: 'booked',
    table: 'table',
    selectedTable: 'selectedTable',

  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  }
};

export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 9,
  }, // CODE CHANGED
  // CODE ADDED START
  cart: {
    defaultDeliveryFee: 20,
  },
  hours: {
    open: 12,
    close: 24,
  },
  datePicker: {
    maxDaysInFuture: 14,
  },
  booking: {
    tableIdAttribute: 'data-table',
  },
  // CODE ADDED END
  db: {
    url: 'http://localhost:3131',
    products: 'products',
    orders: 'orders',
    bookings: 'bookings',
    events: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
    homePage: 'homePage',
  },
};

export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
  homePage: Handlebars.compile(document.querySelector(select.templateOf.homePage).innerHTML),
};