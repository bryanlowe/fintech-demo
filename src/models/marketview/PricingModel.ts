import {MarketViewModel as MarketView} from './MarketViewModel';

export class PricingModel extends MarketView {

	constructor() {
		super();
		this.data_types = ['Revenue', 'Units'];
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
        	{name: 'Units', type: 'float',  filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: (value) => this.formatDataValue(value)},
        	{name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: (value) => '$' + this.formatDataValue(value)}
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
		return data.map((obj) => {
			// build the pivot data
	    	let result = [];
	    	result[result.length] = this.filterByCompareList(obj.brand);
	    	result[result.length] = this.formatDate(obj.last_sale_date);
	    	result[result.length] = obj.units;
	    	result[result.length] = obj.revenue;
	    	for(let i = 0, ii = obj.product.length; i < ii; i++){
	      		result[result.length] = obj.product[i].spec_value;
	    	}
	    	return result;
	  	});
	}
}