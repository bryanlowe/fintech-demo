import {bindable, bindingMode} from 'aurelia-framework';
import {DataGraphModel} from './DataGraphModel';
import {DataTableModel} from './DataTableModel';
import {TimePeriodModel as TimePeriod} from './TimePeriodModel';
import * as moment from 'moment';
import * as palette from './../../resources/plugins/palette';

export abstract class MarketViewModel {
	protected model_data: any;
	protected model_state: any;
	protected graph_input: any;
	protected time_frame_mode: string;
	protected compare_list: string[] = [];
	protected data_types: string[] = [];
	protected filter_list: string[] = [];
	protected exclude_industry: boolean = false;
	protected compare_options: string[] = []; 
	protected data_format: any = {week: 'MMMM DD YYYY', month: 'MMMM YYYY', year: 'YYYY'};
	protected data_graphs: any = {line: new DataGraphModel('line'), bar: new DataGraphModel('bar'), pie: new DataGraphModel('pie')};
	protected data_table: DataTableModel = new DataTableModel();

	/** 
	 * Updates the model data with fresh data
	 * @param any model_data
	 * @return void
	 */
	setModelData(model_data: any): void {
		this.model_data = model_data || null;
	}

	/** 
	 * Updates the graph data with fresh data
	 * @param any graph_input
	 * @return void
	 */
	setGraphData(graph_input: any): void {
		this.graph_input = graph_input || null;
	}

	/**
	 * Updates the time frame mode
	 * @param string time_frame_mode
	 * @return void
	 */
	setTimeFrame(mode: string): void {
		this.time_frame_mode = mode || 'week';
	}

	/**
	 * Updates the model state
	 * @param {object} state_params
	 * @return void
	 */
	updateModelState() {

	}

	/**
	 * Updates the compare list
	 * @param string[] list
	 * @return void
	 */
	setCompareList(list: string[], exclude_industry: boolean = false): void {
		this.compare_list = list || [];
		this.exclude_industry = exclude_industry;
	}

	/**
	 * Retrieves the mode state object
	 * @return {object}
	 */
	getModelState(): any {
		return {
			time_frame_mode: this.time_frame_mode,
			data_types: this.data_types,
			filter_list: this.filter_list,
			exclude_industry: this.exclude_industry,
			compare_options: this.compare_options,
			compare_list: this.compare_list
		};
	}

	/**
	 * Initializes state params that are used to analyze the data
	 * @param any[] sample_product
	 * @return void
	 */
	protected initializeState(sample_product: any[] = []): void {
		// initialize compare options
		this.compare_options = this.model_data.map((obj) => {
			if (this.compare_options.indexOf(obj.brand) === -1) 
				return obj.brand;
		});

		// initialize filter options
		if (!this.filter_list.length) 
			this.filter_list = sample_product.map((obj) => obj.spec_type);
	}

	/**
	 * Creates pivot data from the model
	 * @return {object}
	 */
	updateDataTable(): any {
		// Create the dataArray
		const totals = this.getTotals();

	  	let data_array = [].concat.apply([], this.model_data.map((obj) => obj.dataset));
	  	const sample_product = data_array[0].product;

	  	this.initializeState(sample_product);
	  	this.fieldDefinitions(sample_product);
	  	
	  	data_array = this.pivotData(data_array, totals);
	  	data_array.sort(this.sortDataArray);

	  	if (this.exclude_industry) data_array = data_array.filter((item) => item[0] !== 'Industry');
       
	  	this.data_table.setTableData([this.data_table.getTableInput().columnLabels].concat(data_array));
	  	this.data_table.setTableColumnLabels(['Date']);
	  	this.data_table.setTableRowLabels(['Brand']);
	  	this.data_table.setTableSummaries(['Revenue']);

	  	return this.data_table.getTableInput();
	}

	/**
	 * Creates data graph from the graph input
	 * @param string type
	 * @return {object} | null
	 */
	updateDataGraph(type: string): any {
		const graph_input = this.parseGraphInput();
		// determine which graph to create
		switch (type) {
			case 'bar':
				this.createBarGraph(graph_input);
				break;

			case 'line':
				this.createLineGraph(graph_input);
				break;

			case 'pie':
				this.createPieGraph(graph_input);
				break;

			default:
				return null;
		}
		return this.data_graphs[type].getGraphInput() 
	}

	/**
	 * Create line graph data
	 * @param any graph input
	 * @return void
	 */
	protected createLineGraph(graph_input: any): void {
		const gd = this.data_graphs.line.getGraphData();
		let options = {responsive: true, scales: {xAxes: [{ticks: {autoSkip: false}}]}};
		if (graph_input.graph_data.length > 20) options['legend'] = {display: false};
		this.data_graphs.line.setGraphOptions(options);
		gd.setLabels(graph_input.graph_labels);
		// Create the graph data
		gd.resetDataset();
		for(let i = 0, ii = graph_input.graph_data.length; i < ii; i++){
			gd.addDataset({
				fill: false,
				label: graph_input.graph_dataset_labels[i],
				data: graph_input.graph_data[i],
				backgroundColor: graph_input.colors[i],
				borderColor: graph_input.colors[i]
			});
		}
	}

	/**
	 * Create bar graph data
	 * @param any graph input
	 * @return void
	 */
	protected createBarGraph(graph_input: any): void {
		const gd = this.data_graphs.bar.getGraphData();
		let options = {responsive: true, scales: {yAxes: [{ticks: {beginAtZero: true}}], xAxes: [{ticks: {autoSkip: false}}]}};
		if (graph_input.graph_data.length > 20) options['legend'] = {display: false};
		this.data_graphs.bar.setGraphOptions(options);
		gd.setLabels(graph_input.graph_labels);
		// Create the graph data
		gd.resetDataset();
		for(let i = 0, ii = graph_input.graph_data.length; i < ii; i++){
			gd.addDataset({
				fill: false,
				label: graph_input.graph_dataset_labels[i],
				data: graph_input.graph_data[i],
				backgroundColor: graph_input.colors[i],
				borderColor: graph_input.colors[i]
			});
		}
	}

	/**
	 * Create pie graph data
	 * @param any graph input
	 * @return void
	 */
	protected createPieGraph(graph_input: any): void {
		const gd = this.data_graphs.pie.getGraphData();
		const options = {responsive: true, legend: false};
		let labels = [],
			totals = [];
		this.data_graphs.pie.setGraphOptions(options);

		// Create the graph data
		gd.resetDataset();
		for(var i = 0, ii = graph_input.graph_data.length; i < ii; i++){
		    labels.push(graph_input.graph_dataset_labels[i]);
		    totals.push(graph_input.graph_data[i].reduce((a, b) => { return a + b; }, 0));
		}
		gd.setLabels(labels);
		gd.addDataset({
			fill: false,
			data: totals,
			backgroundColor: graph_input.colors
		});
	}

	/**
	 * Retrieves graph data
	 * @param string type
	 * @returns any | null
	 */
	getGraphInput(type: string): any {
		return this.updateDataGraph(type);
	}

	/**
	 * Creates field definitions from the a sample product
	 */
	protected abstract fieldDefinitions(product: any): void;

	/**
	 * Creates pivot data from the model
	 */
	protected abstract pivotData(data: any[], totals: any): any;

	/**
	 * Creates graph chart data from the graph input
	 */
	protected parseGraphInput(): any {
		let graph_data = [],
			graph_labels = [],
			graph_dataset_labels = [],
			colors = [],
			rows = this.graph_input.body;
		rows.forEach((row) => {
			graph_dataset_labels.push(row.slice(0, this.graph_input.filter_limit).join(':'));
			graph_data.push(row.slice(this.graph_input.filter_limit, row.length));
		});

		graph_labels = this.graph_input.header.slice(this.graph_input.filter_limit, this.graph_input.header.length);
		// add colors
		colors = palette('tol-rainbow', graph_dataset_labels.length, 0, null).map((hex) => '#' + hex);
		return {graph_dataset_labels: graph_dataset_labels, graph_data: graph_data, graph_labels: graph_labels, colors: colors};
	}

	/**
	 * Retrieve dataset totals
	 * @return number
	 */
	protected getTotals(): any {
		let totals = {};
		for(let i = 0, ii = this.model_data.length; i < ii; i++){
			totals[this.model_data[i]._id] = {unit_total: this.model_data[i].unit_total, revenue_total: this.model_data[i].revenue_total};
		}
		return totals;
	}

	/**
	 * Sorts the data array by brand and date
	 * @param any a
	 * @param any b
	 * @return number
	 */
	protected sortDataArray(a, b): number {
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
	 * @param string entry
	 * @param string replacement
	 * @return string
	 */
	protected filterByCompareList(entry: string, replacement: string = 'Industry'): string {
		if (this.compare_list.length) return this.compare_list.indexOf(entry) >= 0 ? entry : replacement;
		return entry;
	}

	/**
	 * Formats the date to accepted date format for the model
	 * @param string date
	 * @return string
	 */
	protected formatDate(date: string): string {
		return moment(date).format(this.data_format[this.time_frame_mode]);
	}

	/**
	 * Formats the number to a string with 2 decimal places
	 * @param number value
	 * @return string
	 */
	protected formatDataValue(value: number): string {
		return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}