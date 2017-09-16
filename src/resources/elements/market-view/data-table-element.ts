import {customElement} from 'aurelia-framework';
import {bindable, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import * as $ from 'jquery';
import * as DataTable from 'datatables.net';
import './../../../scripts/vendors/pivot/pivot.min.js';
import './../../../scripts/vendors/pivot/jquery_pivot.js';
 
@customElement('data-table')
@useView('./data-table-element.html')
/**
 * Data table takes data and displays in an interactive table
 */
@inject(BindingEngine)
export class DataTableElement { 
	@bindable tableData: any = {json: ''};  
  private subscription: any = null;
  private dataTable: any = null;

  constructor(private bindingEngine: BindingEngine){}

  /**
   * updates the pivot table
   */
  private updatePivottable(){
        this.setupPivot(this.tableData);  
  }

  private setupPivot(input){
    if(DataTable){ // check if the plugin exists, there is a delay between loading and attaching
        input.callbacks = {afterUpdateResults: () => {
            let table = $('#data-table-container table').DataTable({
              scrollY: "500px",
              scrollX: "1200px",
              scrollCollapse: true,
              paging: false,
              select: 'single'
            });
            $('#data-table-container table').addClass('table-bordered');
            table.column('0:visible').order('asc').draw();
        }};
        $('#data-menu-container').pivot_display('setup', input);
      } else {
        setTimeout(() => {
          this.setupPivot(input);
        }, 100);
      }
    }


	attached(){
    // subscribe to data table row changes
    this.subscription = this.bindingEngine.propertyObserver(this.tableData, 'json')
        .subscribe((newValue, oldValue) => this.updatePivottable());
  }

  detached(){
    this.subscription.dispose();
  }
} 