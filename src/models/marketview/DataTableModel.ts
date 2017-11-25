/**
 * This data model is used in the data table element
 */
export class DataTableModel {
	private table_data: any;
	private table_fields: any[] = [];
	private table_row_labels: string[] = [];
	private table_column_labels: string[] = [];
	private table_summaries: string[] = [];

	/**
	 * Update table data
	 * @param any table_data
	 * @return void
	 */
	setTableData(table_data: any): void {
		this.table_data = table_data ? JSON.stringify(table_data) : null;
	}

	/**
	 * Update table fields
	 * @param any[] table_fields
	 * @return void
	 */
	setTableFields(table_fields: any[]): void {
		this.table_fields = table_fields || [];
	}

	/**
	 * Update table row labels
	 * @param string[] table_row_labels
	 * @return void
	 */
	setTableRowLabels(table_row_labels: string[]): void {
		this.table_row_labels = table_row_labels || [];
	}

	/**
	 * Update table column labels
	 * @param string[] table_column_labels
	 * @return void
	 */
	setTableColumnLabels(table_column_labels: string[]): void {
		this.table_column_labels = table_column_labels || [];
	}

	/**
	 * Update table summaries
	 * @param string[] table_summaries
	 * @return void
	 */
	setTableSummaries(table_summaries: string[]): void {
		this.table_summaries = table_summaries || [];
	}

	/**
	 * Returns the table properties
	 * @return object
	 */
	getTableInput(): any {
		return {
			json: this.table_data,
			fields: this.table_fields,
			rowLabels: this.table_row_labels,
			columnLabels: this.table_column_labels,
			summaries: this.table_summaries
		};
	}
}