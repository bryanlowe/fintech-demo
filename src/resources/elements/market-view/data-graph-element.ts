import {customElement} from 'aurelia-framework';
import {bindable, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import * as $ from 'jquery';
import * as Chart from 'chart.js';
 
@customElement('data-graph')
@useView('./data-graph-element.html')
/**
 * Data Graph takes data and displays in a graph
 */
@inject(BindingEngine)
export class DataGraphElement { 
	@bindable graph_input: any; 
  private subscription: any = null;

  constructor(private binding_engine: BindingEngine){}

  /**
   * updates the data graph
   */
  private updateDataGraph(){
    $('#chartjsGraph, .chartjs-hidden-iframe').remove();
    if(this.graph_input.type === 'pie'){
      $('#graph-container').css('width', '600px');
    } else {
      $('#graph-container').css('width', '1072px');
    }
    $('#graph-container').append('<canvas id="chartjsGraph"></canvas>');
    const context = $("#chartjsGraph")[0];
    console.log(this.graph_input.toJSON());
    const chart = new Chart(context, {
        type: this.graph_input.type,
        data: this.graph_input.data,
        options: this.graph_input.options
    });
  }

	attached(){
    // subscribe to data table row changes
    this.subscription = this.binding_engine.propertyObserver(this, 'graph_input')
      .subscribe((new_value, old_value) => this.updateDataGraph());
  }

  detached(){
    this.subscription.dispose();
  }
} 