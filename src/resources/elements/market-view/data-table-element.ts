import {customElement} from 'aurelia-framework';
import {bindable, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import * as $ from 'jquery';
import * as DataTable from 'datatables.net-responsive-bs';
 
@customElement('data-table')
@useView('./data-table-element.html')
/**
 * Data table takes data and displays in an interactive table
 */
@inject(BindingEngine)
export class DataTableElement { 
	@bindable tableData: any = {header: [], rows: []}; 
  private subscription: any = null;
  private dataTable: any = null;

  constructor(private bindingEngine: BindingEngine){}

  /**
   * updates the data table
   */
  private updateDatatable(){
    this.constructDataRows();
  }

  /**
   * Creates the table header
   */
  private constructHeader(){
    // create headers
    var thead = '<thead><tr>';
    for(var i = 0, ii = this.tableData.header.length; i < ii; i++){
        thead += '<th>' + this.tableData.header[i] + '</th>';
    }
    thead += '</tr></thead>';
    $('#datatable-responsive').prepend(thead);
  }

  /**
   * Populates the table rows
   */
  private constructDataRows(){
    if(DataTable){ // check if the plugin exists, there is a delay between loading and attaching
      // Destroy the dataTable and empty because the columns may change!
      if (this.dataTable !== null ) {
          this.dataTable.destroy();
          this.dataTable = null;
          $('#datatable-responsive').empty();
      }
      this.constructHeader();

      this.dataTable = $('#datatable-responsive').DataTable({
        "data": this.tableData.rows
      });
    } else {
      setTimeout(() => {
        this.constructDataRows();
      }, 100);
    }
  }

	attached(){
    // subscribe to data table row changes
    this.subscription = this.bindingEngine.propertyObserver(this.tableData, 'header')
      .subscribe((newValue, oldValue) => this.updateDatatable());
  }

  detached(){
    this.subscription.dispose();
  }
} 