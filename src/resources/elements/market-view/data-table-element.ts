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
	@bindable tableInput: any = {json: ''}; 
  @bindable displayAllRows: boolean = false; 
  @bindable({ defaultBindingMode: bindingMode.twoWay }) tableOutput: any;  
  private subscription: any = null;
  private dataTable: any = null;
  private skipCols = 1;

  constructor(private bindingEngine: BindingEngine, private events: EventAggregator){}

  spinnerOpen() {
    this.events.publish('$openSpinner');
  }

  spinnerClose() {
    this.events.publish('$closeSpinner');
  }

  /**
   * updates the pivot table
   */
  private updatePivottable(){
        this.setupPivot(this.tableInput);  
  }

  private outputData() {
    const data = this.dataTable.buttons.exportData({
      modifier: {
        order: this.displayAllRows ? 'current' : 'index',
        page: this.displayAllRows ? 'all' : 'current',
      },
      format: {
        body: (innerHtml, rowIndex, columnIndex, cellNode) => {
          const value = Number(innerHtml.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
          return !isNaN(value) ? value : innerHtml;
        }
      }
    });

    this.tableOutput = {data: data, skipCols: this.skipCols};
  }

  private setupPivot(input){
    this.spinnerOpen();
    if(DataTable){ // check if the plugin exists, there is a delay between loading and attaching
        $('.pivot_header_fields').remove();
        input.callbacks = {afterUpdateResults: () => { 
            this.dataTable = $('#data-table-container table').DataTable({
              scrollY: "500px",
              scrollX: "1200px",
              scrollCollapse: true,
              select: 'single'
            });
            $('#data-table-container table').addClass('table-bordered');
            $('#data-table-container table th, #data-table-container table td').css('white-space', 'nowrap');
            this.dataTable.on('draw', () => {
              this.outputData();
            });
            this.dataTable.column('0:visible').order('asc').draw();
        }};
        $('#data-menu-container').pivot_display('setup', input);
        this.spinnerClose();
      } else {
        setTimeout(() => {
          this.setupPivot(input);
        }, 100);
      }
    }


	attached(){
    // subscribe to data table row changes
    this.subscription = this.bindingEngine.propertyObserver(this.tableInput, 'json')
        .subscribe((newValue, oldValue) => this.updatePivottable());
    this.subscription = this.bindingEngine.propertyObserver(this, 'displayAllRows')
        .subscribe((newValue, oldValue) => this.outputData());
  }

  detached(){
    this.subscription.dispose();
  }
} 