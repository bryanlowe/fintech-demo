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
	 * returns the GraphData class object
	 * @return void
	 */
	getGraphData(): GraphData {
		return this.graph_data;
	}

	/**
	 * Returns the graph properties
	 * @return object
	 */
	getGraphInput(): any {
		return {
			type: this.graph_type,
			data: this.graph_data.getGraphDataInput(),
			options: this.graph_options
		};
	}
}

/**
 * Graph input data class
 */
class GraphData {
	private labels: string[];
	private datasets: any[] = [];

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
	 * @param any dataset
	 * @return void
	 */
	addDataset(dataset: any): void {
		this.datasets.push(dataset);
	}

	/**
	 * resets the dataset for the data class
	 * @return void
	 */
	resetDataset(): void {
		this.datasets = [];
	}

	/**
	 * Returns the graph data properties
	 * @return object
	 */
	getGraphDataInput(): any {
		return {
			labels: this.labels,
			datasets: this.datasets
		};
	}
}