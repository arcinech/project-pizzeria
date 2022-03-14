import {select, settings} from '../settings.js';

class AmountWidget {
  constructor(element){
    const thisWidget = this;

    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.setValue(thisWidget.dom.input.value);
    
    
  }

  getElements(element){
    const thisWidget = this;
    
    thisWidget.dom = {};
    thisWidget.dom.element = element;
    thisWidget.dom.input = thisWidget.dom.element.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);
    /* TODO: Add validation */
    if ((thisWidget.value !== newValue) && !isNaN(newValue)) {
      if (newValue < settings.amountWidget.defaultMin) thisWidget.value = (settings.amountWidget.defaultMin - 1);
      else if (newValue > settings.amountWidget.defaultMax) thisWidget.value = (settings.amountWidget.defaultMax + 1);
      else thisWidget.value = newValue;
    }
    thisWidget.dom.input.value = thisWidget.value;
    thisWidget.announce();
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });

    thisWidget.dom.element.dispatchEvent(event);
  }

  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      thisWidget.setValue(thisWidget.dom.input.value);
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

}

export default AmountWidget;