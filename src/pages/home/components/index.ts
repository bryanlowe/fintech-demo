import {HttpClient} from 'aurelia-fetch-client';
import {bindable, bindingMode, inject} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import * as $ from 'jquery';
//import * as Pivot from 'quick-pivot';
//import './../../../scripts/vendors/pivot/pivot.min.js';

@inject(HttpClient, BindingEngine)
export class HomeLanding { 
	private self = this; // this object has to be saved in order to access class properties from callbacks
	@bindable({ defaultBindingMode: bindingMode.twoWay }) page_state: any;
	@bindable model: any = {};
	@bindable graphData: any = {type: '', data: {labels: [], datasets: []}, options: {}};
	@bindable tableData: any = {json: '', fields: [], rowLabels:[], columnLabels: [], summaries:[]}; 
	private subscribers: any[] = [];
	private pivot: any;

	constructor(private httpClient: HttpClient, private bindingEngine: BindingEngine){
		// initial page state
		this.page_state = {
			model: 'brandshare',
			time_frame: 'week',
			data_type: 'revenue',
			data_format: 'whole',
			graph_type: 'line',
			company: 'Canon'
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
	 * Update the page state's company
	 */
	updatePageCompany(company){
		this.page_state.company = company;
	}

	/**
	 * Update the page state's company
	 */
	updateExperiment(toggle){
		this.tableData.toggle = toggle;
	}

	/**
	 * Creates pivot data from the model
	 */
	private createPivotData() {
		// Create the dataArray
		this.model.sort((a, b) => {
			a = new Date(a._id);
            b = new Date(b._id);
            return a - b;
		});
		let tempArray = this.model.map((obj) => {
	    	return obj.dataset;
	  	});
	  	tempArray = [].concat.apply([], tempArray);

	  	let field_definitions = [{name: 'Brand',   type: 'string',   filterable: true},
        {name: 'Date',        type: 'string',   filterable: true, rowLabelable: false, columnLabelable: true,  sortFunction: (a, b) => { return (new Date(a)).getTime() - (new Date(b)).getTime(); }},
        {name: 'ISO_Date',          type: 'date',  filterable: false, rowLabelable: false},
        {name: 'Units',        type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        {name: 'Revenue',     type: 'float',  filterable: false, rowLabelable: false,  summarizable: 'sum', displayFunction: (value) => { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}}]

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'ISO_Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Revenue';
	  	let product = tempArray[0].product;
	  	for(let i = 0, ii = product.length; i < ii; i++) {
	  		columns[columns.length] = product[i].spec_type;
        	field_definitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
	  	}

	  	let jsonArray = tempArray.map((obj) => {
	    	let result = {};
	    	result['Brand'] = obj.brand;
	    	result['Date'] = obj.time_frame;
	    	result['ISO_Date'] = obj.last_sale_date;
	    	result['Units'] = obj.units;
	    	result['Revenue'] = obj.revenue;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[obj.product[i].spec_type] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});

	  	jsonArray.sort(function(a, b) {
	  		const brandA = a.Brand.toLowerCase();
	  		const brandB = b.Brand.toLowerCase();
	  		const dateA = (new Date(a.Date)).getTime();
	  		const dateB = (new Date(b.Date)).getTime();
	  		if(brandA === brandB){
				return dateA - dateB;
	  		}
			return brandA > brandB ? 1 : -1;
        });
	  
	  	let dataArray = tempArray.map((obj) => {
	    	let result = [];
	    	result[result.length] = obj.brand;
	    	result[result.length] = obj.time_frame;
	    	result[result.length] = obj.last_sale_date;
	    	result[result.length] = obj.units;
	    	result[result.length] = obj.revenue;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});
	  	dataArray.sort(function(a, b) {
	  		const brandA = a[0].toLowerCase();
	  		const brandB = b[0].toLowerCase();
	  		const dateA = (new Date(a[1])).getTime();
	  		const dateB = (new Date(b[1])).getTime();
	  		if(brandA === brandB){
				return dateA - dateB;
	  		}
			return brandA > brandB ? 1 : -1;
        });
       
	  	dataArray = [columns].concat(dataArray);
	  	this.updateDataTable(dataArray, jsonArray, field_definitions, ['Brand'], ['Date'], ['Units', 'Revenue']);
	  	//console.log(jsonArray);



	  	//this.pivot = new Pivot(dataArray, ['Brand'], ['Date'], 'Units', 'sum');
	  	//console.log(pivot);
	  	//pivot.init({json: JSON.stringify(dataArray)});
	  	//this.tableData.header = this.pivot.data.table[0].value;

	  	//console.log('pivot.data', this.pivot.data);
	  	//console.log(pivot);
	}

	/**
	 * Updates the DataTable data
	 */
	private updateDataTable(dataArray, jsonArray, fields, rowLabels, columnLabels, summaries){
		this.tableData.json = JSON.stringify(dataArray);
		//this.tableData.input = jsonArray;
		this.tableData.fields = fields;
		this.tableData.rowLabels = rowLabels;
		this.tableData.columnLabels = columnLabels;
		this.tableData.summaries = summaries;
		//this.tableData.options = this.model.table_data.options;
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
	private fetchModelData() {
		const _class = this;
		return this.httpClient.fetch(this.page_state.model+'/'+this.page_state.time_frame+'/'+this.page_state.data_type+'/'+this.page_state.data_format+'/'+this.page_state.company)
			.then(response => response.json())
			.then(data => {_class.model = data})
			.then(() => {
				this.createPivotData();
			});
	}

	/**
	 * Creates the subscriber list
	 */
	private setSubscribers(){
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'model')
      		.subscribe((newValue, oldValue) => this.fetchModelData()));
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'time_frame')
      		.subscribe((newValue, oldValue) => this.fetchModelData()));
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'data_type')
      		.subscribe((newValue, oldValue) => this.fetchModelData()));
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'data_format')
      		.subscribe((newValue, oldValue) => this.fetchModelData()));
		this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'company')
      		.subscribe((newValue, oldValue) => this.fetchModelData()));
	}

	/**
	 * Initialize create subscribers
	 */
	attached(){
		// initial model data fetch
	    this.fetchModelData()
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