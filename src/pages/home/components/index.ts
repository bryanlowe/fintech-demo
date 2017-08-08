import {HttpClient} from 'aurelia-fetch-client';
import {bindable, bindingMode, inject} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import * as $ from 'jquery';

@inject(HttpClient, BindingEngine)
export class HomeLanding { 
	private self = this; // this object has to be saved in order to access class properties from callbacks
	@bindable({ defaultBindingMode: bindingMode.twoWay }) page_state: any;
	@bindable model: any = {table_data: {}};
	@bindable graphData: any = {type: '', data: {labels: [], datasets: []}, options: {}};
	@bindable tableData: any = {header: [], rows: []}; 
	private subscribers: any[] = [];

	constructor(private httpClient: HttpClient, private bindingEngine: BindingEngine){
		// initial page state
		this.page_state = {
			model: 'brandshare',
			time_frame: 'week',
			data_type: 'revenue',
			data_format: 'whole',
			graph_type: 'line'
		};

		// set httpClient
		this.httpClient = httpClient.configure(config => {
	      config
	        .useStandardConfiguration()
	        .withBaseUrl('/');
	    });
	}

	/**
	 * Update the page state's model
	 */
	updatePageModel(model){
		this.page_state.model = model;
	}

	/**
	 * Update the page state's graph type
	 */
	updatePageGraphType(graph_type){
		this.page_state.graph_type = graph_type;
		this.updateDataGraph();
	}

	/**
	 * Update the page state's time frame
	 */
	updatePageTimeFrame(time_frame){
		this.page_state.time_frame = time_frame;
	}

	/**
	 * Update the page state's data type
	 */
	updatePageDataType(data_type){
		this.page_state.data_type = data_type;
	}

	/**
	 * Update the page state's data format
	 */
	updatePageDataFormat(data_format){
		this.page_state.data_format = data_format;
	}

	/**
	 * Updates the DataTable data
	 */
	private updateDataTable(){
		this.tableData.header = this.model.table_data.header;
		this.tableData.rows = this.model.table_data.rows;
	}

	/**
	 * Updates the DataGraph data
	 */
	private updateDataGraph(){
		if(this.page_state.graph_type === 'line'){
			this.graphData.type = 'line';
			this.graphData.options = this.model.line_graph_data.options;
			this.graphData.data = this.model.line_graph_data.data;
		} else if(this.page_state.graph_type === 'bar'){
			this.graphData.type = 'bar';
			this.graphData.options = this.model.bar_graph_data.options;
			this.graphData.data = this.model.bar_graph_data.data;
		} else if(this.page_state.graph_type === 'pie'){
			this.graphData.type = 'pie';
			this.graphData.options = this.model.pie_graph_data.options;
			this.graphData.data = this.model.pie_graph_data.data;
		}
	}

	/**
	 * Fetches new data from the data model end point
	 */
	private fetchModelData(class_obj){
		return this.httpClient.fetch(this.page_state.model+'/'+this.page_state.time_frame+'/'+this.page_state.data_type+'/'+this.page_state.data_format)
			.then(response => response.json())
			.then(data => {class_obj.model = data})
			.then(() => {
				this.updateDataGraph();
				this.updateDataTable();
			});
	}

	/**
	 * Creates the subscriber list
	 */
	private setSubscribers(){
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'model')
      		.subscribe((newValue, oldValue) => this.fetchModelData(this)));
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'time_frame')
      		.subscribe((newValue, oldValue) => this.fetchModelData(this)));
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'data_type')
      		.subscribe((newValue, oldValue) => this.fetchModelData(this)));
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'data_format')
      		.subscribe((newValue, oldValue) => this.fetchModelData(this)));
	}

	/**
	 * Initialize create subscribers
	 */
	attached(){
		// initial model data fetch
	    this.fetchModelData(this)
	    	.then(() => {
	    		this.setSubscribers();
	    	});
	}

	/**
	 * Dispose of subscribers
	 */
	detached(){
		for(let i = 0, ii = this.subscribers.length; i < ii; i++){
			this.subscribers[i].dispose();
		}
	}
}