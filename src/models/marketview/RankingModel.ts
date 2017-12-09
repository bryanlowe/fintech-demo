import {bindable, bindingMode} from 'aurelia-framework';
import {MarketViewModel as MarketView} from './MarketViewModel';
import {TimePeriodModel as TimePeriod} from './TimePeriodModel';
import * as moment from 'moment';

export class RankingModel extends MarketView {
	protected time_period: TimePeriod = new TimePeriod();

	constructor() {
		super();
		this.data_types = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
	}

	/**
	 * Retrieves the mode state object
	 * @return {object}
	 */
	getModelState(): any {
		return Object.assign(
			{time_period: this.time_period},
			super.getModelState()
		);
	}

	/**
	 * Initializes state params that are used to analyze the data
	 * @param any[] sample_dataset
	 * @param any[] sample_product
	 * @return void
	 */
	protected initializeState(sample_dataset: any[], sample_product: any[] = []): void {
		super.initializeState(sample_dataset, sample_product);
		let current_time_set = this.time_period.getTimePeriod().period_start ? true : false;
		for (let i = 0, ii = sample_dataset.length; i < ii; i++) {
			// initialize time period options
			this.time_period.addWeek(sample_dataset[i].time_period.week_start + ' - ' + sample_dataset[i].time_period.week_end);
	    	this.time_period.addMonth(sample_dataset[i].time_period.month_start);
	    	this.time_period.addYear(sample_dataset[i].time_period.year_start);

	    	if (!current_time_set) {
	    		switch(this.time_frame_mode){
	    			case 'month':
	    				const month = sample_dataset[i].time_period.month_start;
	    				this.time_period.setTimePeriod(
	    					moment(new Date(month)).startOf('month').format('MMMM DD YYYY'), 
	    					moment(new Date(month)).endOf('month').format('MMMM DD YYYY'));
	    				break;

	    			case 'year':
	    				const year = sample_dataset[i].time_period.year_start;
	    				this.time_period.setTimePeriod(
	    					moment('Jan 1 ' + year).startOf('year').format('MMMM DD YYYY'), 
	    					moment('Dec 31 ' + year).endOf('year').format('MMMM DD YYYY'));
	    				break;

	    			default:
	    				this.time_period.setTimePeriod(sample_dataset[i].time_period.week_start, sample_dataset[i].time_period.week_end);
	    				break;
	    		}
	    		current_time_set = true;
	    	}
		}
	}

	/**
	 * Creates pivot data from the model
	 * @return {object}
	 */
	updateDataTable(): any {
		// Create the dataArray
	  	let data_array = [].concat.apply([], this.model_data.map((obj) => obj.dataset));
	  	const sample_product = data_array[0].product;

	  	this.initializeState(data_array, sample_product);
	  	this.fieldDefinitions(sample_product);

	  	data_array = this.pivotData(data_array);
	  	
	  	if (this.exclude_industry) data_array = data_array.filter((item) => item[2] !== 'Industry');
       
	  	this.data_table.setTableData([this.data_table.getTableInput().columnLabels].concat(data_array));
	  	this.data_table.setTableColumnLabels();
	  	this.data_table.setTableRowLabels(['Revenue Rank', 'Unit Rank', 'Brand']);
	  	this.data_table.setTableSummaries(['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change']);
	  	return this.data_table.getTableInput();
	}

	/**
	 * Creates the field definitions
	 * @param {object} product
	 * @return void
	 */
	protected fieldDefinitions(product): void {
		let field_definitions = [
	  		{name: 'Revenue Rank', type: 'float', filterable: true},
	  		{name: 'Unit Rank', type: 'float', filterable: true},
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Unit Sales', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => this.formatDataValue(value)},
        	{name: 'Unit Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: (value) => value.toFixed(2) + '%'},
        	{name: 'Revenue Sales', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => '$' + this.formatDataValue(value)},
        	{name: 'Revenue Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: (value) => value.toFixed(2) + '%'}
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
        	field_definitions.push({name: product[i].spec_type,  type: 'string', filterable: true});
	  	}
	  	this.data_table.setTableFields(field_definitions);
	  	this.data_table.setTableColumnLabels(columns);
	}

	/**
	 * Creates pivot data from the model
	 */
	protected pivotData(data: any[], totals: any = {}): any {
		// get current previous time period for comparison
		const previous = this.time_period.getTimePeriod(false);
		const current_time_period = this.time_frame_mode !== 'week' ? this.compressData(this.filterByTimePeriod(data, true)) : this.filterByTimePeriod(data, true);
		const previous_time_period = this.time_frame_mode !== 'week' ? this.compressData(this.filterByTimePeriod(data, true, false)) : this.filterByTimePeriod(data, true, false);

		// map out the pivot data
		data = current_time_period.map((obj, index) => {
    		let result: any = [];
	    	result[result.length] = this.filterByCompareList(obj.brand, 'Industry');
	    	result[result.length] = obj.units;
	    	let unitGrowth = index && previous.period_start ? ((current_time_period[index].units - previous_time_period[index].units) / previous_time_period[index].units) * 100 : 0;
	    	result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
	    	result[result.length] = obj.revenue;
	    	let revenueGrowth = index && previous.period_start ? ((current_time_period[index].revenue - previous_time_period[index].revenue) / previous_time_period[index].revenue) * 100 : 0;
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
	 * Filter the data by time period
	 * @param any[] data
	 * @return any[]
	 */
	private filterByTimePeriod(data: any[], filter: boolean = false, current_time: boolean = true): any[] {
		// filter by the current and previous time periods
		const time_mode = this.time_period.getTimeMode();
		return data.filter((obj) => {
			let period_start: string,
				period_end: string;
			switch(this.time_frame_mode){
    			case 'month':
    				const month = time_mode ? obj.time_period.month_start : obj.time_period.month_end;
    				period_start = moment(new Date(month)).startOf('month').format('MMMM DD YYYY');
    				period_end = moment(new Date(month)).endOf('month').format('MMMM DD YYYY');
    				break;

    			case 'year':
    				const year = time_mode ? obj.time_period.year_start : obj.time_period.year_end;
    				period_start = moment('Jan 1 ' + year).startOf('year').format('MMMM DD YYYY');
    				period_end = moment('Dec 31 ' + year).endOf('year').format('MMMM DD YYYY');
    				break;

    			default:
    				period_start = obj.time_period.week_start;
    				period_end = obj.time_period.week_end;
    				break;
    		}
			return this.validTimeFrame(period_start, period_end, filter, current_time) ? obj : null;
		});
	}

	/**
	 * Validates whether the time period is within the current and previous time ranges
	 * @param string period_start
	 * @param string period_end
	 * @return bool
	 */
	private validTimeFrame(period_start: string, period_end: string, filter: boolean = false, current_time: boolean = true): boolean {
		const current = this.time_period.getTimePeriod();
		const previous = this.time_period.getTimePeriod(false);
		let result = false;

		// create date objects from strings
		let test_period_start = new Date(period_start);
		let test_period_end = new Date(period_end);

		// for sort filters
		if (filter) {
			if (current_time) {
				return (current.period_start >= test_period_start && current.period_end <= test_period_end);
			} else {
				return (previous.period_start >= test_period_start && previous.period_end <= test_period_end);
			}
		}

		// validate current
		if (current.period_start >= test_period_start && current.period_end <= test_period_end) result = true;

		// validate previous
		if (previous.period_start >= test_period_start && previous.period_end <= test_period_end) result = true;

		return result;
	}

	/**
	 * Compresses the data by it's product specs
	 * @param any[] dataset
	 * @return any[]
	 */
	private compressData(dataset: any[]): any {
		let result = {};
		for (let i = 0, ii = dataset.length; i < ii; i++) {
			let label: any = [dataset[i].brand];
			for(let j = 0, product = dataset[i].product, jj = product.length; j < jj; j++) {
	      		label.push(product[j].spec_value);
	    	}
	    	label = label.join('|::|');
	    	if (result.hasOwnProperty(label)) {
	    		result[label].units += dataset[i].units;
	    		result[label].revenue += dataset[i].revenue;
	    	} else {
	    		result[label] = Object.assign({}, dataset[i]);
	    	}
		}
		return Object.values(result);
	}

	/**
	 * Returns the current time period object
	 * @return TimePeriod object
	 */
	getTimePeriod() {
		return this.time_period;
	}
}