import {MarketViewModel as MarketView} from './MarketViewModel';

export class SalesGrowthModel extends MarketView {

	constructor() {
		super();
		this.data_types = ['Revenue', 'Revenue Percentage', 'Units', 'Units Percentage'];
	}

	/**
	 * Creates the field definitions
	 * @param {object} product
	 * @return void
	 */
	protected fieldDefinitions(product): void {
		let field_definitions = [
	  		{name: 'Brand', type: 'string', filterable: true},
        	{name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: (a, b) => (new Date(a)).getTime() - (new Date(b)).getTime()},
        	{name: 'Units', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => this.formatDataValue(value)},
        	{name: 'Units Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: (value) => value.toFixed(2) + '%'},
        	{name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: (value) => '$' + this.formatDataValue(value)},
        	{name: 'Revenue Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: (value, field) => value.toFixed(2) + '%'}
        ];

	  	let columns = ['Brand'];
	  	columns[columns.length] = 'Date';
	  	columns[columns.length] = 'Units';
	  	columns[columns.length] = 'Units Percentage';
	  	columns[columns.length] = 'Revenue';
	  	columns[columns.length] = 'Revenue Percentage';
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
		return data.map((obj, index, arr) => {
			// get the growth constants
			const unit_growth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
			const revenue_growth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0;

			// build the pivot data
	    	let result = [];
	    	result[result.length] = this.filterByCompareList(obj.brand);
	    	result[result.length] = this.formatDate(obj.last_sale_date);
	    	result[result.length] = index ? arr[index].units - arr[index - 1].units : 0;
	    	result[result.length] = isFinite(unit_growth) ? unit_growth : isNaN(unit_growth) ? 0 : 100;
	    	result[result.length] = index ? arr[index].revenue - arr[index - 1].revenue : 0;
	    	result[result.length] = isFinite(revenue_growth) ? revenue_growth : isNaN(revenue_growth) ? 0 : 100;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});
	}
}