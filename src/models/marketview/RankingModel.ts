import {bindable, bindingMode} from 'aurelia-framework';
import {MarketViewModel as MarketView} from './MarketViewModel';
import {TimePeriodModel as TimePeriod} from './TimePeriodModel';

export class RankingModel extends MarketView {
	protected time_period: TimePeriod = new TimePeriod();

	constructor() {
		super();
		this.data_types = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
	}

	/**
	 * Initializes state params that are used to analyze the data
	 * @param any[] sample_dataset
	 * @param any[] sample_product
	 * @return void
	 */
	protected initializeState(sample_dataset: any[], sample_product: any[] = []): void {
		super.initializeState(sample_product);
		for (let i = 0, ii = sample_dataset.length; i < ii; i++) {
			// initialize time period options
			this.time_period.addWeek(sample_dataset[i].time_period.week_start + ' - ' + sample_dataset[i].time_period.week_end);
	    	this.time_period.addMonth(sample_dataset[i].time_period.month_start);
	    	this.time_period.addYear(sample_dataset[i].time_period.year_start);
		}
		//console.log({weeks: this.time_period.getWeek().values(), months: this.time_period.getMonth().values(), years: this.time_period.getYear().values()});
	}

	/**
	 * Creates pivot data from the model
	 */
	updateDataTable(): void {
		// Create the dataArray
		const totals = this.getTotals();

	  	let data_array = [].concat.apply([], this.model_data.map((obj) => obj.dataset));
	  	const sample_product = data_array[0].product;

	  	this.initializeState(data_array, sample_product);
	  	this.fieldDefinitions(sample_product);

	  	data_array = this.pivotData(data_array, totals);
	  	
	  	if (this.exclude_industry) data_array = data_array.filter((item) => item[2] !== 'Industry');
       
	  	this.data_table.setTableData([this.data_table.getTableInput().columnLabels].concat(data_array));
	  	this.data_table.setTableColumnLabels([]);
	  	this.data_table.setTableRowLabels(['Revenue Rank', 'Unit Rank', 'Brand']);
	  	this.data_table.setTableSummaries(['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change']);
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

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Revenue';
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
		/*
		data = data.filter((obj) => {
			const current = this.time_frame.getTimePeriod();
			const previous = this.time_frame.getTimePeriod(false);
			let pass;
			switch (this.time_frame_mode) {
				case 'week':
					if (current.period_start >= period_start && current_end <= period_end) pass = true;
					break;

				case 'month':
				case 'year':
					const current_period = this.timePeriod.association === HomeLanding.START_DATE
						? current_start : current_end;
					if (current_period >= period_start && current_period <= period_end) pass = true;
					break;

				default:
					pass = false;
					break;
			}
			return pass ? obj : null;
		});

		console.log(data);
		*/

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
	 * Returns the current time period object
	 * @return TimePeriod object
	 */
	getTimePeriod() {
		return this.time_period;
	}
}