import {HttpClient} from 'aurelia-fetch-client';
import {bindable, bindingMode, inject} from 'aurelia-framework';
import * as $ from 'jquery';

@inject(HttpClient)
export class HomeLanding { 
	private self = this; // this object has to be saved in order to access class properties from callbacks
	@bindable({ defaultBindingMode: bindingMode.twoWay }) pageState: any;
	private model: any;
	@bindable tableData: any = {header: [], data: []};
	@bindable graphData: any;

	constructor(private httpClient: HttpClient){
		// initial page state
		this.pageState = {
			model: 'brandshare',
			time_frame: 'weeks',
			data_type: 'revenue',
			data_format: 'whole'
		};

		// set httpClient
		this.httpClient = httpClient.configure(config => {
	      config
	        .useStandardConfiguration()
	        .withBaseUrl('/');
	    });
	}

	/**
	 * Constructs the table data object
	 */
	constructTable(){
		// sort the model by time_frame
		this.model.sort((a, b) => {
			a = new Date(a._id);
			b = new Date(b._id);
			return a - b;
		});

		// Create the table header
		this.tableData.header = this.model.map(function(obj){
			return obj._id;
		});

		// Create the table data
		let data = {};
		this.model.forEach((sale_statement) => {
			sale_statement.dataset.forEach((data_entry) => {
				data[data_entry.brand] = data[data_entry.brand] || [];
				if(this.pageState.data_type === 'revenue'){
					data[data_entry.brand].push(((this.pageState.data_format === 'whole') ? data_entry.revenue : (data_entry.revenue / sale_statement.revenue_total * 100)).toFixed(2));
				} else {
					data[data_entry.brand].push(((this.pageState.data_format === 'whole') ? data_entry.units : (data_entry.units / sale_statement.unit_total * 100)).toFixed(2) + '%');
				}
			});
		});

		// apppend the brand before the number set
		for(let key in data){
			let temp = [key];
			this.tableData.data.push(temp.concat(data[key]));
		}
	}

	/**
	 * Fetches new data from the data model end point
	 */
	fetchModelData(class_obj){
		return this.httpClient.fetch(this.pageState.model+'/'+this.pageState.time_frame)
			.then(response => response.json())
			.then(data => class_obj.model = data);
	}

	/**
	 * Initialize the page state and data model
	 */
	attached(){
		this.fetchModelData(this)
			.then(() => {
				this.constructTable();
			});
		
	}
}