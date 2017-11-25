import {bindable, bindingMode} from 'aurelia-framework';
import {MarketViewModel as MarketView} from './MarketViewModel';
import {TimePeriodModel as TimePeriod} from './TimePeriodModel';

export class RankingModel extends MarketView {
	protected time_frame: TimePeriod = new TimePeriod();

	constructor() {
		super();
		this.data_types = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
	}

	/**
	 * Creates pivot data from the model
	 */
	updateDataTable(): void {
		// Create the dataArray
		const totals = this.getTotals();
		this.initializeState()

	  	let data_array = this.model_data.map((obj) => {
			const result = obj.dataset;

			// initialize compare options
			for (let i = 0, ii = result.length; i < ii; i++) {
				if (this.compare_options.indexOf(result[i].brand) === -1) this.compare_options.push(result[i].brand);
				this.time_frame.addWeek(result[i].time_period.week_start + ' - ' + result[i].time_period.week_end);
		    	this.time_frame.addMonth(result[i].time_period.month_start);
		    	this.time_frame.addYear(result[i].time_period.year_start);
			}

	    	return result;
	  	});
	  	data_array = [].concat.apply([], data_array);

	  	let product = data_array[0].product;
	  	data_array = this.pivotData(data_array, totals);
	  	this.fieldDefinitions(product);

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
		return this.time_frame;
	}
}