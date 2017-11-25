/**
 * This data model is used in the data graph element
 */
export class DataGraphModel {
	private graph_data: GraphData = new GraphData();
	private graph_options: any;

	constructor(private graph_type: string) {}

	/**
	 * Update graph options
	 * @param any graph_options
	 * @return void
	 */
	setGraphOptions(graph_options: any): void {
		this.graph_options = graph_options || {};
	}

	/**
	 * Retrieves the graph data object
	 * @param string[] labels
	 * @return void
	 */
	setDataLabels(labels: string[] = []): void {
		this.graph_data.setLabels(labels);
	}

	/**
	 * updates the dataset for the data class
	 * @param GraphDataset dataset
	 * @return void
	 */
	addDataset(dataset: GraphDataset): void {
		this.graph_data.addDataset(dataset);
	}

	/**
	 * Returns the graph properties
	 * @return object
	 */
	getGraphInput(): any {
		return {
			type: this.graph_type,
			data: this.graph_data,
			options: this.graph_options,
			toJSON(proto) {
			    let jsoned = {};
			    let toConvert = proto || this;
			    Object.getOwnPropertyNames(toConvert).forEach((prop) => {
			        const val = toConvert[prop];
			        // don't include those
			        if (prop === 'toJSON' || prop === 'constructor') {
			            return;
			        }
			        if (typeof val === 'function') {
			            jsoned[prop] = val.bind(jsoned);
			            return;
			        }
			        jsoned[prop] = val;
			    });

			    const inherited = Object.getPrototypeOf(toConvert);
			    if (inherited !== null) {
			        Object.keys(this.toJSON(inherited)).forEach(key => {
			            if (!!jsoned[key] || key === 'constructor' || key === 'toJSON')
			                return;
			            if (typeof inherited[key] === 'function') {
			                jsoned[key] = inherited[key].bind(jsoned);
			                return;
			            }
			            jsoned[key] = inherited[key];
			        });
			    }
			    return jsoned;
			}
		};
	}
}

/**
 * Graph input data class
 */
class GraphData {
	private labels: string[];
	private datasets: GraphDataset[] = [];

	/**
	 * Sets the labels for the data class
	 * @param string[] labels
	 * @return void
	 */
	setLabels(labels: string[] = []): void {
		this.labels = labels;
	}

	/**
	 * updates the dataset for the data class
	 * @param GraphDataset dataset
	 * @return void
	 */
	addDataset(dataset: GraphDataset): void {
		this.datasets.push(dataset);
	}
}

/**
 * Graph data set class
 */
export class GraphDataset {
	constructor(
		private fill: boolean, 
		private label: string, 
		private data: number[],
		private backgroundColor: string | string[],
		private borderColor: string | string[]
	){}
}