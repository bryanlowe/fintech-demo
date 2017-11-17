import {customElement} from 'aurelia-framework';
import {bindable, bindingMode, inject, useView, TaskQueue} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DOM} from 'aurelia-pal';
import * as $ from 'jquery';
 
@customElement('data-control')
@useView('./data-control-element.html')
/**
 * Data control manipulates the data table and chart
 */
@inject(BindingEngine, EventAggregator, TaskQueue)
export class DataControlElement { 
  @bindable({ defaultBindingMode: bindingMode.twoWay }) pageState: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) compareList: string[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) compareOptions: string[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataTypes: string[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) filterList: string[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) excludeIndustry: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) displayAllRows: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) timePeriod: any;
  @bindable periodStartList: string[] = [];
  @bindable periodEndList: string[] = [];
  private observers: any[] = [];
  private mutationObservers: any[] = []; 
  constructor(private bindingEngine: BindingEngine, private events: EventAggregator, private taskQueue: TaskQueue){}

  initialize() {
    // graph buttons
    $('input[type="radio"][name="graph_type"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) 
        this.pageState.graph_type = $(_jqThis).val();
    });

    // time frame buttons
    $('input[type="radio"][name="time_frame"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) {
        this.pageState.time_frame = $(_jqThis).val();
        this.updateTimePeriods();
      }
    });

    // display options buttons
    $('input[type="radio"][name="display_option"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) 
        this.displayAllRows = $(_jqThis).val() === 'all';
    });

    // data model buttons
    $('input[type="radio"][name="data_model"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) 
        this.pageState.model = $(_jqThis).val();
    });

    // exclude industry button
    $('input[type="checkbox"][name="industry"]').change((event) => {
      const _jqThis = event.currentTarget;
      this.excludeIndustry = $(_jqThis).is(':checked') ? false : true;
    });

    this.initDataTypes();
    this.initPeriodLists();

    // keeping dropdowns open if needed
    $('.keep-open').on({
      "shown.bs.dropdown": (event) => { $(event.currentTarget).attr('closable', false); },
      "click":             () => { },
      "hide.bs.dropdown":  (event) => { return $(event.currentTarget).attr('closable') == 'true'; }
    });
    $('.keep-open .dLabel, .keep-open .dToggle').on({
      "click": (event) => {
        $(event.currentTarget).parent().attr('closable', true );
      }
    });
  }

  initCompareOptions() {
    let include = [];
    $('input[type="checkbox"][name="compare_option"]').each((index, element) => {
      if ($(element).is(':checked')) include.push($(element).val());
    });
    this.compareList = include;
  }

  initDataTypes() {
    // data type buttons
    $('input[type="radio"][name="data_type"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) {
        $('input[type="checkbox"].summary:checked').click();
        $('input[type="checkbox"][data-field="' + $(_jqThis).val() + '"].summary').click();
      }
    });

    $('input[type="checkbox"][name="data_type"]').change((event) => {
      $('input[type="checkbox"][data-field="' + $(event.currentTarget).val() + '"].summary').click();
    });
  }

  initFilterOptions() {
    $('input[type="checkbox"][name="filter_item"]').change((event) => {
      const _jqThis = event.currentTarget;
      $('input[type="checkbox"][data-field="' + $(_jqThis).val() + '"].row-labelable').click();
    });
    if (this.pageState.model === 'ranking') $('input[type="checkbox"][name="filter_item"]:first').click();
  }

  updateTimePeriods() {
    const date = this.pageState.time_frame ? this.pageState.time_frame : 'week';
    this.periodStartList = Array.from(this.timePeriod[date + '_start']);
    this.periodEndList = Array.from(this.timePeriod[date + '_end']);
  }

  initPeriodLists() {
    // time period buttons
    $('input[type="radio"][name="period_start"]').unbind('change');
    $('input[type="radio"][name="period_start"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked'))
        this.timePeriod.period_start = $(_jqThis).val();
      console.log({start: this.timePeriod.period_start});
    });

    $('input[type="radio"][name="period_end"]').unbind('change');
    $('input[type="radio"][name="period_end"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked'))
        this.timePeriod.period_end = $(_jqThis).val();
      console.log({end: this.timePeriod.period_end});
    });
  }

  attached(){
    // initialize controls
    this.initialize();

    // set DOM observers
    let compareListObserver = DOM.createMutationObserver(() => {
      this.initCompareOptions();
    });
    this.mutationObservers.push(compareListObserver.observe($('#compareEntries')[0], {childList: true, subtree: true, attributes: true, characterData: true}));

    let dataTypeObserver = DOM.createMutationObserver(() => {
      this.initDataTypes();
    });
    this.mutationObservers.push(dataTypeObserver.observe($('#dataTypeList')[0], {childList: true, subtree: true, characterData: true}));

    let filterlistObserver = DOM.createMutationObserver(() => {
      this.initFilterOptions();
    });
    this.mutationObservers.push(filterlistObserver.observe($('#filterList')[0], {childList: true, subtree: true, characterData: true}));

    let periodStartListObserver = DOM.createMutationObserver(() => {
      this.initDataTypes();
    });
    this.mutationObservers.push(periodStartListObserver.observe($('#periodStartList')[0], {childList: true, subtree: true, characterData: true}));

    let periodEndListObserver = DOM.createMutationObserver(() => {
      this.initDataTypes();
    });
    this.mutationObservers.push(periodEndListObserver.observe($('#periodEndList')[0], {childList: true, subtree: true, characterData: true}));

    // set au observers
    this.observers.push(this.bindingEngine.propertyObserver(this, 'dataTypes')
          .subscribe((newValue, oldValue) => this.initDataTypes()));
    this.observers.push(this.bindingEngine.propertyObserver(this, 'filterList')
          .subscribe((newValue, oldValue) => this.initFilterOptions()));
    this.observers.push(this.bindingEngine.propertyObserver(this, 'periodStartList')
          .subscribe((newValue, oldValue) => this.initPeriodLists()));
    this.observers.push(this.bindingEngine.propertyObserver(this, 'periodEndList')
          .subscribe((newValue, oldValue) => this.initPeriodLists()));
  }

  /**
   * Dispose of observers
   */
  detached(){
    for(let i = 0, ii = this.mutationObservers.length; i < ii; i++){
      this.mutationObservers[i].disconnect();
    }
    for(let i = 0, ii = this.observers.length; i < ii; i++){
      this.observers[i].dispose();
    }
  }
} 