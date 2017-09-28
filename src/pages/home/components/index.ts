import {HttpClient} from 'aurelia-fetch-client';
import {bindable, bindingMode, inject} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import * as $ from 'jquery';
//import * as Pivot from 'quick-pivot';
//import './../../../scripts/vendors/pivot/pivot.min.js';

@inject(HttpClient, BindingEngine, EventAggregator)
export class HomeLanding { 
	private self = this; // this object has to be saved in order to access class properties from callbacks
	@bindable({ defaultBindingMode: bindingMode.twoWay }) page_state: any;
	@bindable model: any = null;
	@bindable graphData: any = {type: '', data: {labels: [], datasets: []}, options: {}};
	@bindable tableData: any = {json: '', fields: [], rowLabels:[], columnLabels: [], summaries:[]}; 
	private observers: any[] = [];
	public subscriptionList: Subscription[] = []; // event subscription list
	private pivot: any;

	constructor(private httpClient: HttpClient, private bindingEngine: BindingEngine, private events: EventAggregator){
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
	 * Retrieve dataset totals
	 */
	getTotals(){
		let totals = {};
		for(let i = 0, ii = this.model.length; i < ii; i++){
			totals[this.model[i]._id] = {unit_total: this.model[i].unit_total, revenue_total: this.model[i].revenue_total};
		}
		return totals;
	}

	/**
	 * Sorts the data array by brand and date
	 */
	sortDataArray(a, b){
  		const brandA = a[0].toLowerCase();
  		const brandB = b[0].toLowerCase();
  		const dateA = (new Date(a[1])).getTime();
  		const dateB = (new Date(b[1])).getTime();
  		if(brandA === brandB){
			return dateA - dateB;
  		}
		return brandA > brandB ? 1 : -1;
	}

	/**
	 * Creates pivot data from the model
	 */
	private createPivotData() {
		// Create the dataArray
		const totals = this.getTotals();
		
		let tempArray = this.model.map((obj) => {
	    	return obj.dataset;
	  	});
	  	tempArray = [].concat.apply([], tempArray);

	  	let product = tempArray[0].product;
	  	let dataArray, dataLabels;
	  	if (this.page_state.model === 'brandshare') {
	  		dataLabels = this.brandshareFieldDefs(product);
	  		dataArray = this.brandsharePivot(tempArray, totals);
	  	} else if (this.page_state.model === 'salesgrowth') {
	  		dataLabels = this.salesgrowthFieldDefs(product);
	  		dataArray = this.salesgrowthPivot(tempArray);
	  	}

	  	dataArray.sort(this.sortDataArray);
       
	  	dataArray = [dataLabels.columns].concat(dataArray);
	  	this.updateDataTable(dataArray, dataLabels.fieldDefinitions, ['Brand'], ['Date'], ['Revenue']);
	}

	/**
	 * Creates the field definitions for brandshare
	 * @param product {object}
	 * @return {object}
	 */
	private brandshareFieldDefs(product) {
		let fieldDefinitions = [
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: (a, b) => { return (new Date(a)).getTime() - (new Date(b)).getTime(); }},
        	{name: 'ISO_Date', type: 'date', filterable: false, rowLabelable: false},
        	{name: 'Units', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Unit_Total', type: 'float',  filterable: false, rowLabelable: false},
        	{name: 'Units Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: (row) => { return (row.Units / row.Unit_Total) * 100; }, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }},
        	{name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Revenue_Total', type: 'float',  filterable: false, rowLabelable: false},
        	{name: 'Revenue Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: (row) => { return (row.Revenue / row.Revenue_Total) * 100; }, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }}
        ];

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'ISO_Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Unit_Total';
	  	columns[columns.length] = 'Revenue';
	  	columns[columns.length] = 'Revenue_Total';
	  	for(let i = 0, ii = product.length; i < ii; i++) {
	  		columns[columns.length] = product[i].spec_type;
        	fieldDefinitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
	  	}

	  	return {fieldDefinitions: fieldDefinitions, columns: columns};
	}

	/**
	 * Creates the data based on the brandshare pivot
	 * @param data [array]
	 * @param totals [array]
	 * @return [array]
	 */
	private brandsharePivot(data, totals) {
		return data.map((obj) => {
	    	let result = [];
	    	result[result.length] = obj.brand;
	    	result[result.length] = obj.time_frame;
	    	result[result.length] = obj.last_sale_date;
	    	result[result.length] = obj.units;
	    	result[result.length] = totals[obj.last_sale_date].unit_total;
	    	result[result.length] = obj.revenue;
	    	result[result.length] = totals[obj.last_sale_date].revenue_total;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});
	}

	/**
	 * Creates the field definitions for brandshare
	 * @param product {object}
	 * @return {object}
	 */
	private salesgrowthFieldDefs(product) {
		let fieldDefinitions = [
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: (a, b) => { return (new Date(a)).getTime() - (new Date(b)).getTime(); }},
        	{name: 'ISO_Date', type: 'date', filterable: false, rowLabelable: false},
        	{name: 'Units', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Units Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }},
        	{name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Revenue Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function(value, field){ return value.toFixed(2) + '%'; }}
        ];

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'ISO_Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Units Percentage';
	  	columns[columns.length] = 'Revenue';
	  	columns[columns.length] = 'Revenue Percentage';
	  	for(let i = 0, ii = product.length; i < ii; i++) {
	  		columns[columns.length] = product[i].spec_type;
        	fieldDefinitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
	  	}

	  	return {fieldDefinitions: fieldDefinitions, columns: columns};
	}

	/**
	 * Creates the data based on the salesgrowth pivot
	 * @param data [array]
	 * @param totals [array]
	 * @return [array]
	 */
	private salesgrowthPivot(data) {
		return data.map((obj, index, arr) => {
	    	let result = [];
	    	result[result.length] = obj.brand;
	    	result[result.length] = obj.time_frame;
	    	result[result.length] = obj.last_sale_date;
	    	result[result.length] = index ? arr[index].units - arr[index - 1].units : 0;
	    	let unitGrowth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
	    	result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
	    	result[result.length] = index ? arr[index].revenue - arr[index - 1].revenue : 0;
	    	let revenueGrowth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0
	    	result[result.length] = isFinite(revenueGrowth) ? revenueGrowth : isNaN(revenueGrowth) ? 0 : 100;;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});
	}

	/**
	 * Updates the DataTable data
	 */
	private updateDataTable(dataArray, fields, rowLabels, columnLabels, summaries){
		this.tableData.json = JSON.stringify(dataArray);
		this.tableData.fields = fields;
		this.tableData.rowLabels = rowLabels;
		this.tableData.columnLabels = columnLabels;
		this.tableData.summaries = summaries;
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
	private setObservers(){
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'model')
      		.subscribe((newValue, oldValue) => {
      			if (this.model) {
      				this.createPivotData();
      			} else {
      				this.fetchModelData();
      			}
      		}));
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'time_frame')
      		.subscribe((newValue, oldValue) => this.fetchModelData()));
		this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'company')
      		.subscribe((newValue, oldValue) => this.fetchModelData()));
	}

	private setSubscribers() {
		this.subscriptionList.push(this.events.subscribe('$datatableChanged', table => { 
			let graphData = [],
				graphLabels = [];
			table.body.forEach((row) => {
				let tempLabel = [],
					foundAllLabels = false;
				while (!foundAllLabels && row.length) {
					let entry = row.shift();
					if (isNaN(entry)) {
						tempLabel.push(entry);
					} else {
						row.unshift(entry);
						foundAllLabels = true;
					}
				}
				graphLabels.push(tempLabel.join(':'));
			});
			
			graphData = table.body;
			console.log({labels: graphLabels, data: graphData});
		}));
	}

	/**
	 * Initialize create observers and subscribers
	 */
	attached(){
		// initial model data fetch
	    this.fetchModelData()
	    	.then(() => {
	    		this.setObservers();
	    	})
	    	.then(() => {
	    		this.setSubscribers()
	    	});

	}

	/**
	 * Dispose of observers
	 */
	detached(){
		for(let i = 0, ii = this.observers.length; i < ii; i++){
			this.observers[i].dispose();
		}
		for(let i = 0, ii = this.subscriptionList.length; i < ii; i++){
			this.subscriptionList[i].dispose();
		}
	}
}