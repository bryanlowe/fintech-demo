import {HttpClient} from 'aurelia-fetch-client';
import {bindable, bindingMode, inject} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import {BrandShare, Pricing, SalesGrowth, Ranking} from './../../../models/index';
import * as $ from 'jquery';
import * as moment from 'moment';

@inject(HttpClient, BindingEngine, EventAggregator)
export class HomeLanding { 
	@bindable({ defaultBindingMode: bindingMode.twoWay }) page_state: any;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) model_state: any;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) table_output: any;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) display_all_rows: boolean = false;
	@bindable table_input: any; 
	@bindable model_data: any;
	@bindable graph_input: any;	
	private model_list: any;
	private observers: any[] = [];

	
	constructor(private httpClient: HttpClient, private bindingEngine: BindingEngine, private events: EventAggregator){
		// initial page state
		this.page_state = {
			model: 'brandshare',
			time_frame: 'week',
			graph_type: 'line',
			compare_list: [],
			exclude_industry: false,
		};
		
		// initialize models
		this.model_list = {
			brandshare: new BrandShare(),
			pricing: new Pricing(),
			salesgrowth: new SalesGrowth(),
			ranking: new Ranking()
		};

		// set httpClient
		this.httpClient = httpClient.configure(config => {
	      config
	        .useStandardConfiguration()
	        .withBaseUrl('/');
	    });
	}

	private updateModelProperties() {
		this.model_list[this.page_state.model].setModelData(this.model_data);
		this.model_list[this.page_state.model].setTimeFrame(this.page_state.time_frame);
		this.model_list[this.page_state.model].setCompareList(this.page_state.compare_list, this.page_state.exclude_industry);
	}

	/**
	 * Update the DataTable data 
	 */
	private updateDataTable(){
		if (this.model_data) {
			this.updateModelProperties();
			this.model_state = this.model_list[this.page_state.model].getModelState();
			this.table_input = this.model_list[this.page_state.model].updateDataTable();
		} else {
			this.fetchModelData();
		}
	}

	/**
	 * Updates the DataGraph data
	 */
	private updateDataGraph(){
		this.table_output['filter_limit'] = $('input.row-labelable:checked').length;
		this.model_list[this.page_state.model].setGraphData(this.table_output);
		this.graph_input = this.model_list[this.page_state.model].getGraphInput(this.page_state.graph_type);
	}


	spinnerOpen() {
		this.events.publish('$openSpinner');
	}

	spinnerClose() {
		this.events.publish('$closeSpinner');
	}

	/**
	 * Fetches new data from the data model end point
	 */
	private fetchModelData() {
		const _class = this;
		this.spinnerOpen();
		return this.httpClient.fetch('marketview/data')
			.then(response => response.json())
			.then(data => {_class.model_data = data})
			.then(() => {
				this.spinnerClose();
				this.updateModelProperties();
				this.model_state = this.model_list[this.page_state.model].getModelState();
				this.table_input = this.model_list[this.page_state.model].updateDataTable();
			});
	}

	/**
	 * Creates the subscriber list
	 */
	private setObservers(){
		this.observers.push(this.bindingEngine.propertyObserver(this, 'table_output')
      		.subscribe((newValue, oldValue) => this.updateDataGraph()));
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'graph_type')
      		.subscribe((newValue, oldValue) => this.updateDataGraph()));
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'model')
      		.subscribe((newValue, oldValue) => this.updateDataTable()));
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'time_frame')
      		.subscribe((newValue, oldValue) => this.updateDataTable()));	
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'compare_list')
      		.subscribe((newValue, oldValue) => this.updateDataTable()));
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'exclude_industry')
      		.subscribe((newValue, oldValue) => this.updateDataTable()));
	}

	/**
	 * Initialize create observers and subscribers
	 */
	attached(){
		this.setObservers();
		// initial model data fetch
	    this.fetchModelData()
	    .then(() => {
	    	$('#weekTimeFrame').click();
	    });

	}

	/**
	 * Dispose of observers
	 */
	detached(){
		for(let i = 0, ii = this.observers.length; i < ii; i++){
			this.observers[i].dispose();
		}
	}
}