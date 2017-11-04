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
  private hiddenColumns = [];

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
    let exportConfig = {
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
    };
    if (this.hiddenColumns.length) {
      exportConfig['columns'] = Array.from(Array(this.dataTable.columns().header().length).keys()).filter((value) => this.hiddenColumns.indexOf(value) === -1);
    }
    const data = this.dataTable.buttons.exportData(exportConfig);
    this.tableOutput = data;
  }

  private setupPivot(input){
    this.spinnerOpen();
    if(DataTable){ // check if the plugin exists, there is a delay between loading and attaching
      this.hiddenColumns = [];
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
          $('#data-table-container table th').css('font-size', '10px');
          this.dataTable.on('draw', () => {
            this.outputData();
          });
          this.dataTable.column('0:visible').order('asc').draw();
          this.hideExtraColumns();
      }};
      $('#data-menu-container').pivot_display('setup', input);
      this.spinnerClose();
    } else {
      setTimeout(() => {
        this.setupPivot(input);
      }, 100);
    }
  }

  private hideExtraColumns() {
    const columnLimit = 12;
    const numOfColumns = this.dataTable.columns().header().length;
    const filterNum = $('input.row-labelable:checked').length;
    const extraColumns = numOfColumns > columnLimit ? numOfColumns - columnLimit : 0;
    if (extraColumns) {     
      this.hiddenColumns = Array.from(Array(extraColumns).keys()).filter((value) => value >= filterNum);
      this.dataTable.columns(this.hiddenColumns).visible(false, false);
      this.dataTable.columns.adjust().draw(false); // adjust column sizing and redraw
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