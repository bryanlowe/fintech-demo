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
	@bindable tableData: any = {header: [], data: []}; 
  private subscription: any = null;
  private dataTable: any = null;

  constructor(private bindingEngine: BindingEngine){}

  /**
   * updates the data table
   */
  private updateDatatable(){
    this.constructHeader();
    this.constructDataRows();
  }

  private constructHeader(){
    // create headers
    var thead = '<tr><th>Brand</th>';
    for(var i = 0, ii = this.tableData.header.length; i < ii; i++){
        thead += '<th>' + this.tableData.header[i] + '</th>';
    }
    thead += '</tr>';
    $('#datatable-thead').html(thead);
  }

  private constructDataRows(){
    if(DataTable){
      $('#datatable').DataTable({
        "data": this.tableData.data
      });
    } else {
      setTimeout(() => {
        this.constructDataRows();
      }, 100);
    }
    //console.log(DataTable);

    
    
    //let temp = new $.fn.DataTable.Api('#datatable');
    //$('#datatable').DataTable().api();
    //$('#datatable').dataTable();
    //console.log($('#datatable'));
  }

	attached(){
    // subscribe
    this.subscription = this.bindingEngine.propertyObserver(this.tableData, 'header')
      .subscribe((newValue, oldValue) => this.updateDatatable());
  }

  detached(){
    this.subscription.dispose();
  }
} 