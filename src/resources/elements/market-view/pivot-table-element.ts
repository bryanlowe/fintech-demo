import {customElement} from 'aurelia-framework';
import {bindable, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import * as $ from 'jquery';
import * as PivotTable from 'pivottable';

@customElement('pivot-table')
@useView('./pivot-table-element.html')
/**
 * Pivot Table takes data and displays in a table
 */
@inject(BindingEngine)
export class PivotTableElement { 
	@bindable tableData: any = {json: ''}; 
  	private subscription: any = null;
	

  	constructor(private bindingEngine: BindingEngine){}

  	/**
	 * updates the pivot table
	 */
	private updatePivottable(){
        this.setupPivot(this.tableData.input);  
	}

	private setupPivot(input){
		if(PivotTable){ // check if the plugin exists, there is a delay between loading and attaching
			//console.log(input);
		    $("#pivot-table-container").pivot(
			  	input, {
			    rows: ["Brand", "Model"],
			    cols: ["Date"],
			    aggregator: this.brandshare('revenue', 'whole'),
			    colOrder: 'value_a_to_z'
			  });
	    } else {
	      setTimeout(() => {
	        this.setupPivot(input);
	      }, 100);
	    }
  	}

	/**
	 * Brandshare aggregator
	 */
	private brandshare(dataType, dataFormat){
		return (data, rowKey, colKey) => {
			/*
			return {
				count: 0,
			    push: function(record) { this.count++; },
			    value: function() { return this.count; },
			    format: function(x) { return x; },
			};
			*/
			
			return {
			    result: 0,
			    total: 0,
			    push: function(record) { this.result = dataType === 'revenue' ? record.Revenue : record.Units; this.total += this.result; },
			    value: function() { return colKey.length ? this.result : this.total; },
			    format: function(x) { x = x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); return dataFormat === 'whole' ? x : x + '%'; },
			};
			
		};
	}

	attached(){
    	// subscribe to data table row changes
    	this.subscription = this.bindingEngine.propertyObserver(this.tableData, 'input')
      		.subscribe((newValue, oldValue) => this.updatePivottable());
  	}

  	detached(){
    	this.subscription.dispose();
  	}
}