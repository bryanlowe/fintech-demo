import {HttpClient} from 'aurelia-fetch-client';
import {bindable, bindingMode, inject} from 'aurelia-framework';
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator, Subscription} from 'aurelia-event-aggregator';
import * as $ from 'jquery';
import * as moment from 'moment';
import * as palette from 'palette';

@inject(HttpClient, BindingEngine, EventAggregator)
export class HomeLanding { 
	private self = this; // this object has to be saved in order to access class properties from callbacks
	@bindable({ defaultBindingMode: bindingMode.twoWay }) pageState: any;
	@bindable model: any = null;
	@bindable graphData: any = {type: '', data: {labels: [], datasets: []}, options: {}};
	@bindable tableInput: any = {json: '', fields: [], rowLabels:[], columnLabels: [], summaries:[]}; 
	@bindable({ defaultBindingMode: bindingMode.twoWay }) tableOutput: any;
	@bindable compareOptions: string[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) compareList: string[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) dataTypes: string[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) filterList: string[] = [];
	@bindable({ defaultBindingMode: bindingMode.twoWay }) numActiveFilters: number = 1;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) excludeIndustry: boolean = false;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) displayAllRows: boolean = false;
	private observers: any[] = [];
	public subscriptionList: Subscription[] = []; // event subscription list
	private pivot: any;
	private dateFormat: any = {week: 'MMMM DD YYYY', month: 'MMMM YYYY', year: 'YYYY'};

	
	constructor(private httpClient: HttpClient, private bindingEngine: BindingEngine, private events: EventAggregator){
		// initial page state
		this.pageState = {
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
	 * Update the page's table and chart data
	 */
	updateDataTableAndChart(){
		if (this.model) {
			this.createPivotData();
		} else {
			this.fetchModelData();
		}
	}

	spinnerOpen() {
		this.events.publish('$openSpinner');
	}

	spinnerClose() {
		this.events.publish('$closeSpinner');
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
	 * Filter entry by compare list
	 */
	filterByCompareList(entry, replacement){
		replacement = replacement || 'Industry';
		if (this.compareList.length) return this.compareList.indexOf(entry) >= 0 ? entry : replacement;
		return entry;
	}

	/**
	 * Creates pivot data from the model
	 */
	private createPivotData() {
		this.dataTypes = [];
		this.filterList = [];

		// Create the dataArray
		const totals = this.getTotals();
		
		let tempArray = this.model.map((obj) => {
			const result = obj.dataset;
			if (!this.compareOptions.length) {
				for (let i = 0, ii = result.length; i < ii; i++) {
					if (this.compareOptions.indexOf(result[i].brand) === -1) this.compareOptions.push(result[i].brand);
				}
			}
	    	return result;
	  	});
	  	tempArray = [].concat.apply([], tempArray);

	  	let product = tempArray[0].product;
	  	let dataArray, dataLabels;
	  	let defaultRowLabels = ['Brand'];
	  	let defaultColumnLabels = ['Date'];
	  	let defaultSummaries = ['Revenue'];
	  	if (this.pageState.model === 'brandshare') {
	  		dataLabels = this.brandshareFieldDefs(product);
	  		dataArray = this.brandsharePivot(tempArray, totals);
	  	} else if (this.pageState.model === 'salesgrowth') {
	  		dataLabels = this.salesgrowthFieldDefs(product);
	  		dataArray = this.salesgrowthPivot(tempArray);
	  	} else if (this.pageState.model === 'pricing') {
	  		dataLabels = this.pricingFieldDefs(product);
	  		dataArray = this.pricingPivot(tempArray);
	  	} else if (this.pageState.model === 'ranking') {
	  		dataLabels = this.rankingFieldDefs(product);
	  		dataArray = this.rankingPivot(tempArray);
	  		defaultRowLabels = ['Revenue Rank', 'Unit Rank', 'Brand'];
	  		defaultSummaries = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
	  		defaultColumnLabels = [];
	  	}

	  	if (this.pageState.model !== 'ranking') {
	  		dataArray.sort(this.sortDataArray);
	  	}

	  	if (this.excludeIndustry) {
	  		const brandIndex = this.pageState.model !== 'ranking' ? 0 : 2;
	  		dataArray = dataArray.filter((item) => item[brandIndex] !== 'Industry');
	  	}
       
	  	dataArray = [dataLabels.columns].concat(dataArray);
	  	this.updateDataTable(dataArray, dataLabels.fieldDefinitions, defaultRowLabels, defaultColumnLabels, defaultSummaries);
	}

	/**
	 * Creates the field definitions for brandshare
	 * @param product {object}
	 * @return {object}
	 */
	private brandshareFieldDefs(product) {
		this.dataTypes = ['Revenue', 'Revenue Percentage', 'Units', 'Units Percentage'];
		let fieldDefinitions = [
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: (a, b) => { return (new Date(a)).getTime() - (new Date(b)).getTime(); }},
        	{name: 'Units', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Unit_Total', type: 'float',  filterable: false, rowLabelable: false},
        	{name: 'Units Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: (row) => { return (row.Units / row.Unit_Total) * 100; }, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }},
        	{name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Revenue_Total', type: 'float',  filterable: false, rowLabelable: false},
        	{name: 'Revenue Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: (row) => { return (row.Revenue / row.Revenue_Total) * 100; }, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }}
        ];

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Unit_Total';
	  	columns[columns.length] = 'Revenue';
	  	columns[columns.length] = 'Revenue_Total';
	  	for(let i = 0, ii = product.length; i < ii; i++) {
	  		columns[columns.length] = product[i].spec_type;
        	fieldDefinitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
        	this.filterList.push(product[i].spec_type);
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
	    	result[result.length] = this.filterByCompareList(obj.brand, 'Industry');
	    	result[result.length] = moment(obj.last_sale_date).format(this.dateFormat[this.pageState.time_frame]);
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
		this.dataTypes = ['Revenue', 'Revenue Percentage', 'Units', 'Units Percentage'];
		let fieldDefinitions = [
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: (a, b) => { return (new Date(a)).getTime() - (new Date(b)).getTime(); }},
        	{name: 'Units', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Units Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }},
        	{name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Revenue Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function(value, field){ return value.toFixed(2) + '%'; }}
        ];

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Units Percentage';
	  	columns[columns.length] = 'Revenue';
	  	columns[columns.length] = 'Revenue Percentage';
	  	for(let i = 0, ii = product.length; i < ii; i++) {
	  		columns[columns.length] = product[i].spec_type;
        	fieldDefinitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
        	this.filterList.push(product[i].spec_type);
	  	}

	  	return {fieldDefinitions: fieldDefinitions, columns: columns};
	}

	/**
	 * Creates the data based on the salesgrowth pivot
	 * @param data [array]
	 * @return [array]
	 */
	private salesgrowthPivot(data) {
		return data.map((obj, index, arr) => {
	    	let result = [];
	    	result[result.length] = this.filterByCompareList(obj.brand, 'Industry');
	    	result[result.length] = moment(obj.last_sale_date).format(this.dateFormat[this.pageState.time_frame]);
	    	result[result.length] = index ? arr[index].units - arr[index - 1].units : 0;
	    	let unitGrowth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
	    	result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
	    	result[result.length] = index ? arr[index].revenue - arr[index - 1].revenue : 0;
	    	let revenueGrowth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0;
	    	result[result.length] = isFinite(revenueGrowth) ? revenueGrowth : isNaN(revenueGrowth) ? 0 : 100;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});
	}

	/**
	 * Creates the field definitions for pricing
	 * @param product {object}
	 * @return {object}
	 */
	private pricingFieldDefs(product) {
		this.dataTypes = ['Revenue', 'Units'];
		let fieldDefinitions = [
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: (a, b) => { return (new Date(a)).getTime() - (new Date(b)).getTime(); }},
        	{name: 'Units', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: (value) => { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: (value) => { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        ];

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Revenue';
	  	for(let i = 0, ii = product.length; i < ii; i++) {
	  		columns[columns.length] = product[i].spec_type;
        	fieldDefinitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
        	this.filterList.push(product[i].spec_type);
	  	}

	  	return {fieldDefinitions: fieldDefinitions, columns: columns};
	}

	/**
	 * Creates the data based on the pricing pivot
	 * @param data [array]
	 * @return [array]
	 */
	private pricingPivot(data) {
		return data.map((obj) => {
	    	let result = [];
	    	result[result.length] = this.filterByCompareList(obj.brand, 'Industry');
	    	result[result.length] = moment(obj.last_sale_date).format(this.dateFormat[this.pageState.time_frame]);
	    	result[result.length] = obj.units;
	    	result[result.length] = obj.revenue;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});
	}

	/**
	 * Creates the field definitions for ranking
	 * @param product {object}
	 * @return {object}
	 */
	private rankingFieldDefs(product) {
		this.dataTypes = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
		let fieldDefinitions = [
	  		{name: 'Revenue Rank', type: 'float', filterable: true},
	  		{name: 'Unit Rank', type: 'float', filterable: true},
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Unit Sales', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Unit Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }},
        	{name: 'Revenue Sales', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}},
        	{name: 'Revenue Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function(value){ return value.toFixed(2) + '%'; }},
        ];

	  	let columns = ['Revenue Rank'];
	  	columns[columns.length] = 'Unit Rank';
	  	columns[columns.length] = 'Brand';
	  	columns[columns.length] = 'Unit Sales';
	  	columns[columns.length] = 'Unit Change';
	  	columns[columns.length] = 'Revenue Sales';
	  	columns[columns.length] = 'Revenue Change';
	  	for(let i = 0, ii = product.length; i < ii; i++) {
	  		columns[columns.length] = product[i].spec_type;
        	fieldDefinitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
        	this.filterList.push(product[i].spec_type);
	  	}

	  	return {fieldDefinitions: fieldDefinitions, columns: columns};
	}

	/**
	 * Creates the data based on the ranking pivot
	 * @param data [array]
	 * @return [array]
	 */
	private rankingPivot(data) {
		data = data.map((obj, index, arr) => {
	    	let result = [];
	    	result[result.length] = this.filterByCompareList(obj.brand, 'Industry');
	    	result[result.length] = obj.units;
	    	let unitGrowth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
	    	result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
	    	result[result.length] = obj.revenue;
	    	let revenueGrowth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0;
	    	result[result.length] = isFinite(revenueGrowth) ? revenueGrowth : isNaN(revenueGrowth) ? 0 : 100;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});

		// add unit rank
	  	data.sort((a, b) => { return b[1] - a[1]; });
	  	for (let i = 0, ii = data.length; i < ii; i++){
	  		data[i].unshift(i + 1);
	  	}

	  	// add revenue rank
	  	data.sort((a, b) => { return b[4] - a[4]; });
	  	for (let i = 0, ii = data.length; i < ii; i++){
	  		data[i].unshift(i + 1);
	  	}

	  	return data;
	}

	/**
	 * Updates the DataTable data
	 */
	private updateDataTable(dataArray, fields, rowLabels, columnLabels, summaries){
		this.tableInput.json = JSON.stringify(dataArray);
		this.tableInput.fields = fields;
		this.tableInput.rowLabels = rowLabels;
		this.tableInput.columnLabels = columnLabels;
		this.tableInput.summaries = summaries;
	}

	/**
	 * Updates the DataGraph data
	 */
	private updateDataGraph(){
		const chart = this.createChartInput();
		let data = {};
		data['labels'] = chart.headers;
		data['datasets'] = [];
		if(this.pageState.graph_type === 'line'){
			this.graphData.type = 'line';
			this.graphData.options = {responsive: true};

			// Create the graph data
			for(let i = 0, ii = chart.data.length; i < ii; i++){
				let dataset = {};
				dataset['fill'] = false;
				dataset['label'] = chart.labels[i];
				dataset['data'] = chart.data[i];
				dataset['backgroundColor'] = chart.colors[i];
				dataset['borderColor'] = chart.colors[i];
				data['datasets'].push(dataset);
			}
			this.graphData.data = data;
			if (data['datasets'].length > 20) {
				const legendOptions = {display: false};
				this.graphData.options['legend'] = legendOptions;
			}
		} else if(this.pageState.graph_type === 'bar'){
			this.graphData.type = 'bar';
			this.graphData.options = {responsive: true, scales: {yAxes: [{ticks: {beginAtZero: true}}]}};

			// Create the graph data
			for(let i = 0, ii = chart.data.length; i < ii; i++){
			    let dataset = {};
			    dataset['label'] = chart.labels[i];
			    dataset['data'] = chart.data[i];
			    dataset['backgroundColor'] = chart.colors[i];
			    data['datasets'].push(dataset);
			}
			this.graphData.data = data;
			if (data['datasets'].length > 20) {
				const legendOptions = {display: false};
				this.graphData.options['legend'] = legendOptions;
			}
		} else if(this.pageState.graph_type === 'pie'){
			this.graphData.type = 'pie';
			this.graphData.options = {responsive: true, legend: false};
			data['labels'] = [];
			let dataset = {data: [], backgroundColor: []}
			dataset.backgroundColor = chart.colors;

			// Create the graph data
			var totals = [];
			for(var i = 0, ii = chart.data.length; i < ii; i++){
			    // Create the graph labels
			    data['labels'].push(chart.labels[i]);
			    totals.push(chart.data[i].reduce((a, b) => { return a + b; }, 0))
			}
			dataset.data = totals;
			data['datasets'].push(dataset);
			this.graphData.data = data;
		}
	}

	/**
	 * Fetches new data from the data model end point
	 */
	private fetchModelData() {
		const _class = this;
		this.spinnerOpen();
		return this.httpClient.fetch('marketview/data')
			.then(response => response.json())
			.then(data => {_class.model = data})
			.then(() => {
				this.spinnerClose();
				this.createPivotData();
			});
	}

	/**
	 * Creates the subscriber list
	 */
	private setObservers(){
		this.observers.push(this.bindingEngine.propertyObserver(this, 'tableOutput')
      		.subscribe((newValue, oldValue) => this.updateDataGraph()));
		this.observers.push(this.bindingEngine.propertyObserver(this.pageState, 'graph_type')
      		.subscribe((newValue, oldValue) => this.updateDataGraph()));
		this.observers.push(this.bindingEngine.propertyObserver(this.pageState, 'model')
      		.subscribe((newValue, oldValue) => this.updateDataTableAndChart()));
		this.observers.push(this.bindingEngine.propertyObserver(this.pageState, 'time_frame')
      		.subscribe((newValue, oldValue) => this.updateDataTableAndChart()));
		this.observers.push(this.bindingEngine.propertyObserver(this, 'compareList')
      		.subscribe((newValue, oldValue) => this.updateDataTableAndChart()));
		this.observers.push(this.bindingEngine.propertyObserver(this, 'excludeIndustry')
      		.subscribe((newValue, oldValue) => this.updateDataTableAndChart()));
	}

	private createChartInput() {
		this.spinnerOpen();
		let graphData = [],
			graphHeaders = [],
			graphLabels = [],
			colors = [],
			rows = this.tableOutput.data.body;
		rows.forEach((row) => {
			graphLabels.push(row.slice(0, this.numActiveFilters).join(':'));
			graphData.push(row.slice(this.numActiveFilters, row.length));
		});

		graphHeaders = this.tableOutput.data.header.slice(this.numActiveFilters, this.tableOutput.data.header.length);
		// add colors
		colors = palette('tol-rainbow', graphLabels.length).map(function(hex) {
		    return '#' + hex;
		});
		this.spinnerClose();
		return {labels: graphLabels, data: graphData, headers: graphHeaders, colors: colors};
	}

	/**
	 * Initialize create observers and subscribers
	 */
	attached(){
		this.setObservers();
		// initial model data fetch
	    this.fetchModelData();

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