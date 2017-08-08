import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
  	// elements
  	'./elements/market-view/data-graph-element',
  	'./elements/market-view/data-table-element',
  ]);
}
