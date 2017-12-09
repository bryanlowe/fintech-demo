import {customElement} from 'aurelia-framework';
import {bindable, bindingMode, inject, useView} from 'aurelia-framework'; 
import {BindingEngine} from 'aurelia-binding';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DOM} from 'aurelia-pal';
import * as $ from 'jquery';
 
@customElement('data-control')
@useView('./data-control-element.html')
/**
 * Data control manipulates the data table and chart
 */
@inject(BindingEngine, EventAggregator)
export class DataControlElement { 
  @bindable({ defaultBindingMode: bindingMode.twoWay }) page_state: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) model_state: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) display_all_rows: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) time_period_list: string[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) filter_list: string[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) data_refresh: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) graph_refresh: boolean = false;
  private observers: any[] = [];
  private mutation_observers: any[] = []; 
  constructor(private binding_engine: BindingEngine, private events: EventAggregator){}

  initialize() {
    // graph buttons
    $('input[type="radio"][name="graph_type"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) 
        this.page_state.graph_type = $(_jqThis).val();
        this.graph_refresh = true;
    });

    // time frame buttons
    $('input[type="radio"][name="time_frame"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) {
        this.page_state.time_frame = $(_jqThis).val();
        if (this.page_state.model === 'ranking') { 
          this.model_state.time_period.setTimePeriod(null, null);
          this.model_state.time_period.setTimePeriod(null, null, false);
        }
        this.data_refresh = true;
        this.resetButtons();
      }
    });

    // display options buttons
    $('input[type="radio"][name="display_option"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) 
        this.display_all_rows = $(_jqThis).val() === 'all';
    });

    // data model buttons
    $('input[type="radio"][name="data_model"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')) 
        this.page_state.model = $(_jqThis).val();
        this.data_refresh = true;
    });

    // exclude industry button
    $('input[type="checkbox"][name="industry"]').change((event) => {
      const _jqThis = event.currentTarget;
      this.page_state.exclude_industry = $(_jqThis).is(':checked') ? false : true;
      this.data_refresh = true;
    });

    this.initDataTypes();
    this.initFilterOptions();

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
    this.page_state.compare_list = include;
    this.resetButtons();
    this.data_refresh = true;
  }

  initDataTypes() {
    $('input[type="radio"][name="data_type"], input[type="checkbox"][name="data_type"]').unbind('change');
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

  private initFilterOptions() {
    $('input[type="checkbox"][name="filter_item"]').unbind('change');
    $('input[type="checkbox"][name="filter_item"]').change((event) => {
      const _jqThis = event.currentTarget;
      $('input[type="checkbox"][data-field="' + $(_jqThis).val() + '"].row-labelable').click();
    });
    if (this.page_state.model === 'ranking') $('input[type="checkbox"][name="filter_item"]:first').click();
  }

  private initTimePeriodList() {
    $('input[type="radio"][name="time_period"]').change((event) => {
      const _jqThis = event.currentTarget;
      const time_period_buttons = $('input[type="radio"][name="time_period"]');
      if ($(_jqThis).is(':checked')) {
        // set current time period
        const current_time_period = $(_jqThis).val().split(' - ');
        this.model_state.time_period.setTimePeriod(current_time_period[0], current_time_period[1]);

        // set pervious time period, if any
        const previous_radio_index = $('input[type="radio"][name="time_period"]').index(_jqThis) - 1;
        const previous_time_period = previous_radio_index > 0 ? time_period_buttons.eq(previous_radio_index).val().split(' - ') : null;
        if (previous_time_period) { 
          this.model_state.time_period.setTimePeriod(previous_time_period[0], previous_time_period[1], false);
        } else {
          this.model_state.time_period.setTimePeriod(null, null, false);
        }
        this.data_refresh = true;
      }
    });

    // time splice buttons
    $('input[type="radio"][name="time_splice"]').unbind('change');
    $('input[type="radio"][name="time_splice"]').change((event) => {
      const _jqThis = event.currentTarget;
      if ($(_jqThis).is(':checked')){
        if ($(_jqThis).val() === 'start') {
          this.model_state.time_period.useStartDate();
        } else {
          this.model_state.time_period.useEndDate();
        }
        this.data_refresh = true;
      } 
    });
  }

  private resetButtons() {
    // unclick active checkbox buttons
    $.each($('input[type="checkbox"][name="data_type"], input[type="checkbox"][name="filter_item"]'), (key, value) => {
      if ($(value).is(':checked')) $(value).click();
    });

    // reset data type state
    $('input[type="radio"][name="data_type"]:first').click();

    // reset time period
    if (this.page_state.model === 'ranking') {
      $('input[type="radio"][name="time_period"]').unbind('change');
      $('input[type="radio"][name="time_period"]:first').click();
      this.initTimePeriodList();
    }

    // initialize buttons
    this.initDataTypes();
    this.initFilterOptions();
  }

  attached(){
    // initialize controls
    this.initialize();

    // set DOM observers
    let compare_list_observer = DOM.createMutationObserver(() => {
      this.initCompareOptions();
    });
    this.mutation_observers.push(compare_list_observer.observe($('#compare_entries')[0], {childList: true, subtree: true, attributes: true, characterData: true}));

    let dataTypeObserver = DOM.createMutationObserver(() => {
      this.initDataTypes();
    });
    this.mutation_observers.push(dataTypeObserver.observe($('#data_type_list')[0], {childList: true, subtree: true, characterData: true}));

    let filter_list_observer = DOM.createMutationObserver(() => {
      this.initFilterOptions();
    });
    this.mutation_observers.push(filter_list_observer.observe($('#filter_list')[0], {childList: true, subtree: true, characterData: true}));

    // set au observers
    this.observers.push(this.binding_engine.propertyObserver(this, 'model_state')
      .subscribe((new_value, old_value) => {
        if (this.model_state) {
          this.filter_list = this.model_state.filter_list;
          this.initFilterOptions();
          this.initDataTypes();

          if (this.model_state.hasOwnProperty('time_period')) {
            if (this.page_state.time_frame === 'week') {
              this.time_period_list = this.model_state.time_period.getWeek();
            } else if (this.page_state.time_frame === 'month') {
              this.time_period_list = this.model_state.time_period.getMonth();
            } else if (this.page_state.time_frame === 'year') {
              this.time_period_list = this.model_state.time_period.getYear();
            }
            this.initTimePeriodList();
          }
        }
      }));
  }

  /**
   * Dispose of observers
   */
  detached(){
    for(let i = 0, ii = this.mutation_observers.length; i < ii; i++){
      this.mutation_observers[i].disconnect();
    }
    for(let i = 0, ii = this.observers.length; i < ii; i++){
      this.observers[i].dispose();
    }
  }
} 