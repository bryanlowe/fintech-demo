import {customElement} from 'aurelia-framework';
import {bindable, bindingMode, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as $ from 'jquery';
import * as DataTable from 'datatables.net-buttons-bs';
import './../../../scripts/vendors/pivot/pivot.min.js';
import './../../../scripts/vendors/pivot/jquery_pivot.js';
 
@customElement('data-table')
@useView('./data-table-element.html')
/**
 * Data table takes data and displays in an interactive table
 */
@inject(BindingEngine, EventAggregator)
export class DataTableElement { 
	@bindable table_input: any; 
  @bindable display_all_rows: boolean = false; 
  @bindable({ defaultBindingMode: bindingMode.twoWay }) table_output: any;  
  private subscription: any = null;
  private data_table: any = null;
  private hidden_columns = [];

  constructor(private binding_engine: BindingEngine, private events: EventAggregator){}

  spinnerOpen() {
    this.events.publish('$openSpinner');
  }

  spinnerClose() {
    this.events.publish('$closeSpinner');
  }

  private outputData() {
    let export_config = {
      modifier: {
        order: this.display_all_rows ? 'current' : 'index',
        page: this.display_all_rows ? 'all' : 'current',
      },
      format: {
        body: (innerHtml, rowIndex, columnIndex, cellNode) => {
          const value = Number(innerHtml.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
          return !isNaN(value) ? value : innerHtml;
        }
      }
    };
    if (this.hidden_columns.length) {
      export_config['columns'] = Array.from(Array(this.data_table.columns().header().length).keys()).filter((value) => this.hidden_columns.indexOf(value) === -1);
    }
    const data = this.data_table.buttons.exportData(export_config);
    this.table_output = data;
  }

  private setupPivot(input){
    this.spinnerOpen();
    if (DataTable) { // check if the plugin exists, there is a delay between loading and attaching
      this.hidden_columns = [];
      $('.pivot_header_fields').remove();
      input.callbacks = {afterUpdateResults: () => { 
          this.data_table = $('#data-table-container table').DataTable({
            scrollY: "500px",
            scrollX: "1200px",
            scrollCollapse: true,
            select: 'single'
          });
          $('#data-table-container table').addClass('table-bordered');
          $('#data-table-container table th, #data-table-container table td').css('white-space', 'nowrap');
          $('#data-table-container table th').css('font-size', '10px');
          this.drawTable();
      }};
      $('#data-menu-container').pivot_display('setup', input);
      this.spinnerClose();
    } else {
      setTimeout(() => {
        this.setupPivot(input);
      }, 100);
    }
  }

  private drawTable() {
    this.data_table.column('0:visible').order('asc').draw();
    const column_limit = 12;
    const num_of_columns = this.data_table.columns().header().length;
    const filter_num = $('input.row-labelable:checked').length;
    const extra_columns = num_of_columns > column_limit ? num_of_columns - column_limit : 0;
    if (extra_columns) {     
      this.hidden_columns = Array.from(Array(extra_columns).keys()).filter((value) => value >= filter_num);
      this.data_table.columns(this.hidden_columns).visible(false, false);
      this.data_table.columns.adjust().draw(false); // adjust column sizing and redraw
    }
    this.outputData();
  }


	attached(){
    // subscribe to data table row changes
    this.subscription = this.binding_engine.propertyObserver(this, 'table_input')
        .subscribe((new_value, old_value) => {
          this.setupPivot(new_value);
        });
    this.subscription = this.binding_engine.propertyObserver(this, 'display_all_rows')
        .subscribe((new_value, old_value) => this.outputData());
  }

  detached(){
    this.subscription.dispose();
  }
} 