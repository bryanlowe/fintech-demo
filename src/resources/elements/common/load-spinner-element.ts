import {customElement} from 'aurelia-framework';
import {bindable, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
 
@customElement('load-spinner')
@useView('./load-spinner-element.html')
/**
 * Data Graph takes data and displays in a graph
 */
@inject(BindingEngine)
export class LoadSpinnerElement { 
	@bindable toggle: boolean = false; 
  private subscription: any = null;

  constructor(private bindingEngine: BindingEngine){}

  attached(){
    // subscribe to data table row changes
    this.subscription = this.bindingEngine.propertyObserver(this, 'toggle')
        .subscribe((newValue, oldValue) => { this.toggle = newValue} );
  }

  detached(){
    this.subscription.dispose();
  }
} 