import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
  	// elements
  	'./elements/common/load-spinner-element',
  	'./elements/market-view/data-graph-element',
  	'./elements/market-view/data-table-element',
  	'./elements/market-view/pivot-table-element',
  ]);
}
