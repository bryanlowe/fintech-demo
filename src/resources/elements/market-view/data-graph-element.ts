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
	@bindable graphData: any = {type: '', data: {labels: [], datasets: []}, options: {}}; 
  private subscription: any = null;

  constructor(private bindingEngine: BindingEngine){}

  /**
   * updates the data graph
   */
  private updateDataGraph(){
    $('#chartjsGraph, .chartjs-hidden-iframe').remove();
    $('#graph-container').append('<canvas id="chartjsGraph"></canvas>');
    let context = $("#chartjsGraph")[0];
    let chart = new Chart(context, {
        type: this.graphData.type,
        data: this.graphData.data,
        options: this.graphData.options
    });
  }

	attached(){
    // subscribe to data table row changes
    this.subscription = this.bindingEngine.propertyObserver(this.graphData, 'data')
      .subscribe((newValue, oldValue) => this.updateDataGraph());
  }

  detached(){
    this.subscription.dispose();
  }
} 