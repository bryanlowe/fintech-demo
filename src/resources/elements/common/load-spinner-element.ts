import {customElement} from 'aurelia-framework';
import {bindable, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
 
@customElement('load-spinner')
@useView('./load-spinner-element.html')
/**
 * Data Graph takes data and displays in a graph
 */
@inject(BindingEngine, EventAggregator)
export class LoadSpinnerElement { 
	@bindable toggle: boolean = false; 
  public subscriptionList: Subscription[] = []; // event subscription list

  constructor(private bindingEngine: BindingEngine, private events: EventAggregator){}

  attached(){
    // subscribe to spinner toggle changes
    this.subscriptionList.push(this.events.subscribe('$openSpinner', () => this.toggle = true ));
    this.subscriptionList.push(this.events.subscribe('$closeSpinner', () => this.toggle = false ));
  }

  detached(){
    for(let i = 0, ii = this.subscriptionList.length; i < ii; i++){
      this.subscriptionList[i].dispose();
    }
  }
} 