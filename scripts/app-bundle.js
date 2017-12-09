define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function findDefaultRoute(router) {
        return router.navigation[0].relativeHref;
    }
    var App = (function () {
        function App() {
            this.year = (new Date()).getFullYear();
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.map([
                { route: '', redirect: findDefaultRoute(router) }
            ]);
            config.mapUnknownRoutes('not-found');
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .feature('pages');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('not-found',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NotFound = (function () {
        function NotFound() {
        }
        return NotFound;
    }());
    exports.NotFound = NotFound;
});

define('models/marketview/DataGraphModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataGraphModel = (function () {
        function DataGraphModel(graph_type) {
            this.graph_type = graph_type;
            this.graph_data = new GraphData();
        }
        DataGraphModel.prototype.setGraphOptions = function (graph_options) {
            this.graph_options = graph_options || {};
        };
        DataGraphModel.prototype.getGraphData = function () {
            return this.graph_data;
        };
        DataGraphModel.prototype.getGraphInput = function () {
            return {
                type: this.graph_type,
                data: this.graph_data.getGraphDataInput(),
                options: this.graph_options
            };
        };
        return DataGraphModel;
    }());
    exports.DataGraphModel = DataGraphModel;
    var GraphData = (function () {
        function GraphData() {
            this.datasets = [];
        }
        GraphData.prototype.setLabels = function (labels) {
            if (labels === void 0) { labels = []; }
            this.labels = labels;
        };
        GraphData.prototype.addDataset = function (dataset) {
            this.datasets.push(dataset);
        };
        GraphData.prototype.resetDataset = function () {
            this.datasets = [];
        };
        GraphData.prototype.getGraphDataInput = function () {
            return {
                labels: this.labels,
                datasets: this.datasets
            };
        };
        return GraphData;
    }());
});

define('models/marketview/DataTableModel',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataTableModel = (function () {
        function DataTableModel() {
            this.table_fields = [];
            this.table_row_labels = [];
            this.table_column_labels = [];
            this.table_summaries = [];
        }
        DataTableModel.prototype.setTableData = function (table_data) {
            this.table_data = table_data ? JSON.stringify(table_data) : null;
        };
        DataTableModel.prototype.setTableFields = function (table_fields) {
            this.table_fields = table_fields || [];
        };
        DataTableModel.prototype.setTableRowLabels = function (table_row_labels) {
            this.table_row_labels = table_row_labels || [];
        };
        DataTableModel.prototype.setTableColumnLabels = function (table_column_labels) {
            if (table_column_labels === void 0) { table_column_labels = []; }
            this.table_column_labels = table_column_labels;
        };
        DataTableModel.prototype.setTableSummaries = function (table_summaries) {
            this.table_summaries = table_summaries || [];
        };
        DataTableModel.prototype.getTableInput = function () {
            return {
                json: this.table_data,
                fields: this.table_fields,
                rowLabels: this.table_row_labels,
                columnLabels: this.table_column_labels,
                summaries: this.table_summaries
            };
        };
        return DataTableModel;
    }());
    exports.DataTableModel = DataTableModel;
});

define('models/marketview/TimePeriodModel',["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimePeriodModel = (function () {
        function TimePeriodModel() {
            this.week = new Set();
            this.month = new Set();
            this.year = new Set();
            this.time_mode = TimePeriodModel.START_DATE;
            this.current_time_period = new TimeFrame();
            this.previous_time_period = new TimeFrame();
        }
        TimePeriodModel.prototype.addWeek = function (week) {
            this.week.add(week);
        };
        TimePeriodModel.prototype.getWeek = function () {
            return Array.from(this.week);
        };
        TimePeriodModel.prototype.addMonth = function (month) {
            this.month.add(moment(new Date(month)).startOf('month').format('MMMM DD YYYY') + ' - ' + moment(new Date(month)).endOf('month').format('MMMM DD YYYY'));
        };
        TimePeriodModel.prototype.getMonth = function () {
            return Array.from(this.month);
        };
        TimePeriodModel.prototype.addYear = function (year) {
            this.year.add(moment('Jan 1 ' + year).startOf('year').format('MMMM DD YYYY') + ' - ' + moment('Dec 31 ' + year).endOf('year').format('MMMM DD YYYY'));
        };
        TimePeriodModel.prototype.getYear = function () {
            return Array.from(this.year);
        };
        TimePeriodModel.prototype.useStartDate = function () {
            this.time_mode = TimePeriodModel.START_DATE;
        };
        TimePeriodModel.prototype.useEndDate = function () {
            this.time_mode = TimePeriodModel.END_DATE;
        };
        TimePeriodModel.prototype.getTimeMode = function () {
            return this.time_mode;
        };
        TimePeriodModel.prototype.setTimePeriod = function (start, end, current_mode) {
            if (current_mode === void 0) { current_mode = true; }
            var time_period = current_mode ? this.current_time_period : this.previous_time_period;
            time_period.set(start, end);
        };
        TimePeriodModel.prototype.getTimePeriod = function (current_mode) {
            if (current_mode === void 0) { current_mode = true; }
            return current_mode ? this.current_time_period.get() : this.previous_time_period.get();
        };
        TimePeriodModel.START_DATE = 0;
        TimePeriodModel.END_DATE = 1;
        return TimePeriodModel;
    }());
    exports.TimePeriodModel = TimePeriodModel;
    var TimeFrame = (function () {
        function TimeFrame() {
        }
        TimeFrame.prototype.set = function (start, end) {
            if (start === void 0) { start = null; }
            if (end === void 0) { end = null; }
            this.start = start ? new Date(start) : null;
            this.end = end ? new Date(end) : null;
        };
        TimeFrame.prototype.get = function () {
            return {
                period_start: this.start,
                period_end: this.end
            };
        };
        return TimeFrame;
    }());
});

define('models/marketview/MarketViewModel',["require", "exports", "./DataGraphModel", "./DataTableModel", "moment", "./../../resources/plugins/palette"], function (require, exports, DataGraphModel_1, DataTableModel_1, moment, palette) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MarketViewModel = (function () {
        function MarketViewModel() {
            this.compare_list = [];
            this.data_types = [];
            this.filter_list = [];
            this.exclude_industry = false;
            this.compare_options = [];
            this.data_format = { week: 'MMMM DD YYYY', month: 'MMMM YYYY', year: 'YYYY' };
            this.data_graphs = { line: new DataGraphModel_1.DataGraphModel('line'), bar: new DataGraphModel_1.DataGraphModel('bar'), pie: new DataGraphModel_1.DataGraphModel('pie') };
            this.data_table = new DataTableModel_1.DataTableModel();
        }
        MarketViewModel.prototype.setModelData = function (model_data) {
            this.model_data = model_data || null;
        };
        MarketViewModel.prototype.setGraphData = function (graph_input) {
            this.graph_input = graph_input || null;
        };
        MarketViewModel.prototype.setTimeFrame = function (mode) {
            this.time_frame_mode = mode || 'week';
        };
        MarketViewModel.prototype.updateModelState = function () {
        };
        MarketViewModel.prototype.setCompareList = function (list, exclude_industry) {
            if (exclude_industry === void 0) { exclude_industry = false; }
            this.compare_list = list || [];
            this.exclude_industry = exclude_industry;
        };
        MarketViewModel.prototype.getModelState = function () {
            return {
                time_frame_mode: this.time_frame_mode,
                data_types: this.data_types,
                filter_list: this.filter_list,
                exclude_industry: this.exclude_industry,
                compare_options: this.compare_options,
                compare_list: this.compare_list
            };
        };
        MarketViewModel.prototype.initializeState = function (sample_dataset, sample_product) {
            if (sample_product === void 0) { sample_product = []; }
            if (!this.compare_list.length) {
                for (var i = 0, ii = sample_dataset.length; i < ii; i++) {
                    if (this.compare_options.indexOf(sample_dataset[i].brand) === -1)
                        this.compare_options.push(sample_dataset[i].brand);
                }
            }
            if (!this.filter_list.length)
                this.filter_list = sample_product.map(function (obj) { return obj.spec_type; });
        };
        MarketViewModel.prototype.updateDataTable = function () {
            var totals = this.getTotals();
            var data_array = [].concat.apply([], this.model_data.map(function (obj) { return obj.dataset; }));
            var sample_product = data_array[0].product;
            this.initializeState(data_array, sample_product);
            this.fieldDefinitions(sample_product);
            data_array = this.pivotData(data_array, totals);
            data_array.sort(this.sortDataArray);
            if (this.exclude_industry)
                data_array = data_array.filter(function (item) { return item[0] !== 'Industry'; });
            this.data_table.setTableData([this.data_table.getTableInput().columnLabels].concat(data_array));
            this.data_table.setTableColumnLabels(['Date']);
            this.data_table.setTableRowLabels(['Brand']);
            this.data_table.setTableSummaries(['Revenue']);
            return this.data_table.getTableInput();
        };
        MarketViewModel.prototype.updateDataGraph = function (type) {
            var graph_input = this.parseGraphInput();
            switch (type) {
                case 'bar':
                    this.createBarGraph(graph_input);
                    break;
                case 'line':
                    this.createLineGraph(graph_input);
                    break;
                case 'pie':
                    this.createPieGraph(graph_input);
                    break;
                default:
                    return null;
            }
            return this.data_graphs[type].getGraphInput();
        };
        MarketViewModel.prototype.createLineGraph = function (graph_input) {
            var gd = this.data_graphs.line.getGraphData();
            var options = { responsive: true, scales: { xAxes: [{ ticks: { autoSkip: false } }] } };
            if (graph_input.graph_data.length > 20)
                options['legend'] = { display: false };
            this.data_graphs.line.setGraphOptions(options);
            gd.setLabels(graph_input.graph_labels);
            gd.resetDataset();
            for (var i = 0, ii = graph_input.graph_data.length; i < ii; i++) {
                gd.addDataset({
                    fill: false,
                    label: graph_input.graph_dataset_labels[i],
                    data: graph_input.graph_data[i],
                    backgroundColor: graph_input.colors[i],
                    borderColor: graph_input.colors[i]
                });
            }
        };
        MarketViewModel.prototype.createBarGraph = function (graph_input) {
            var gd = this.data_graphs.bar.getGraphData();
            var options = { responsive: true, scales: { yAxes: [{ ticks: { beginAtZero: true } }], xAxes: [{ ticks: { autoSkip: false } }] } };
            if (graph_input.graph_data.length > 20)
                options['legend'] = { display: false };
            this.data_graphs.bar.setGraphOptions(options);
            gd.setLabels(graph_input.graph_labels);
            gd.resetDataset();
            for (var i = 0, ii = graph_input.graph_data.length; i < ii; i++) {
                gd.addDataset({
                    fill: false,
                    label: graph_input.graph_dataset_labels[i],
                    data: graph_input.graph_data[i],
                    backgroundColor: graph_input.colors[i],
                    borderColor: graph_input.colors[i]
                });
            }
        };
        MarketViewModel.prototype.createPieGraph = function (graph_input) {
            var gd = this.data_graphs.pie.getGraphData();
            var options = { responsive: true, legend: false };
            var labels = [], totals = [];
            this.data_graphs.pie.setGraphOptions(options);
            gd.resetDataset();
            for (var i = 0, ii = graph_input.graph_data.length; i < ii; i++) {
                labels.push(graph_input.graph_dataset_labels[i]);
                totals.push(graph_input.graph_data[i].reduce(function (a, b) { return a + b; }, 0));
            }
            gd.setLabels(labels);
            gd.addDataset({
                fill: false,
                data: totals,
                backgroundColor: graph_input.colors
            });
        };
        MarketViewModel.prototype.getGraphInput = function (type) {
            return this.updateDataGraph(type);
        };
        MarketViewModel.prototype.parseGraphInput = function () {
            var _this = this;
            var graph_data = [], graph_labels = [], graph_dataset_labels = [], colors = [], rows = this.graph_input.body;
            rows.forEach(function (row) {
                graph_dataset_labels.push(row.slice(0, _this.graph_input.filter_limit).join(':'));
                graph_data.push(row.slice(_this.graph_input.filter_limit, row.length));
            });
            graph_labels = this.graph_input.header.slice(this.graph_input.filter_limit, this.graph_input.header.length);
            colors = palette('tol-rainbow', graph_dataset_labels.length, 0, null).map(function (hex) { return '#' + hex; });
            return { graph_dataset_labels: graph_dataset_labels, graph_data: graph_data, graph_labels: graph_labels, colors: colors };
        };
        MarketViewModel.prototype.getTotals = function () {
            var totals = {};
            for (var i = 0, ii = this.model_data.length; i < ii; i++) {
                totals[this.model_data[i]._id] = { unit_total: this.model_data[i].unit_total, revenue_total: this.model_data[i].revenue_total };
            }
            return totals;
        };
        MarketViewModel.prototype.sortDataArray = function (a, b) {
            var brandA = a[0].toLowerCase();
            var brandB = b[0].toLowerCase();
            var dateA = (new Date(a[1])).getTime();
            var dateB = (new Date(b[1])).getTime();
            if (brandA === brandB) {
                return dateA - dateB;
            }
            return brandA > brandB ? 1 : -1;
        };
        MarketViewModel.prototype.filterByCompareList = function (entry, replacement) {
            if (replacement === void 0) { replacement = 'Industry'; }
            if (this.compare_list.length)
                return this.compare_list.indexOf(entry) >= 0 ? entry : replacement;
            return entry;
        };
        MarketViewModel.prototype.formatDate = function (date) {
            return moment(date).format(this.data_format[this.time_frame_mode]);
        };
        MarketViewModel.prototype.formatDataValue = function (value) {
            return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };
        return MarketViewModel;
    }());
    exports.MarketViewModel = MarketViewModel;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('models/marketview/BrandShareModel',["require", "exports", "./MarketViewModel"], function (require, exports, MarketViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BrandShareModel = (function (_super) {
        __extends(BrandShareModel, _super);
        function BrandShareModel() {
            var _this = _super.call(this) || this;
            _this.data_types = ['Revenue', 'Revenue Percentage', 'Units', 'Units Percentage'];
            return _this;
        }
        BrandShareModel.prototype.fieldDefinitions = function (product) {
            var _this = this;
            var field_definitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return _this.formatDataValue(value); } },
                { name: 'Unit_Total', type: 'float', filterable: false, rowLabelable: false },
                { name: 'Units Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: function (row) { return (row.Units / row.Unit_Total) * 100; }, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + _this.formatDataValue(value); } },
                { name: 'Revenue_Total', type: 'float', filterable: false, rowLabelable: false },
                { name: 'Revenue Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: function (row) { return (row.Revenue / row.Revenue_Total) * 100; }, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } }
            ];
            var columns = ['Brand'];
            columns[columns.length] = 'Date';
            columns[columns.length] = 'Units';
            columns[columns.length] = 'Unit_Total';
            columns[columns.length] = 'Revenue';
            columns[columns.length] = 'Revenue_Total';
            for (var i = 0, ii = product.length; i < ii; i++) {
                columns[columns.length] = product[i].spec_type;
                field_definitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
            }
            this.data_table.setTableFields(field_definitions);
            this.data_table.setTableColumnLabels(columns);
        };
        BrandShareModel.prototype.pivotData = function (data, totals) {
            var _this = this;
            if (totals === void 0) { totals = {}; }
            return data.map(function (obj) {
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand);
                result[result.length] = _this.formatDate(obj.last_sale_date);
                result[result.length] = obj.units;
                result[result.length] = totals[obj.last_sale_date].unit_total;
                result[result.length] = obj.revenue;
                result[result.length] = totals[obj.last_sale_date].revenue_total;
                for (var i = 0, ii = obj.product.length; i < ii; i++) {
                    result[result.length] = obj.product[i].spec_value;
                }
                return result;
            });
        };
        return BrandShareModel;
    }(MarketViewModel_1.MarketViewModel));
    exports.BrandShareModel = BrandShareModel;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('models/marketview/PricingModel',["require", "exports", "./MarketViewModel"], function (require, exports, MarketViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PricingModel = (function (_super) {
        __extends(PricingModel, _super);
        function PricingModel() {
            var _this = _super.call(this) || this;
            _this.data_types = ['Revenue', 'Units'];
            return _this;
        }
        PricingModel.prototype.fieldDefinitions = function (product) {
            var _this = this;
            var field_definitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: function (value) { return _this.formatDataValue(value); } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: function (value) { return '$' + _this.formatDataValue(value); } }
            ];
            var columns = ['Brand'];
            columns[columns.length] = 'Date';
            columns[columns.length] = 'Units';
            columns[columns.length] = 'Revenue';
            for (var i = 0, ii = product.length; i < ii; i++) {
                columns[columns.length] = product[i].spec_type;
                field_definitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
            }
            this.data_table.setTableFields(field_definitions);
            this.data_table.setTableColumnLabels(columns);
        };
        PricingModel.prototype.pivotData = function (data, totals) {
            var _this = this;
            if (totals === void 0) { totals = {}; }
            return data.map(function (obj) {
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand);
                result[result.length] = _this.formatDate(obj.last_sale_date);
                result[result.length] = obj.units;
                result[result.length] = obj.revenue;
                for (var i = 0, ii = obj.product.length; i < ii; i++) {
                    result[result.length] = obj.product[i].spec_value;
                }
                return result;
            });
        };
        return PricingModel;
    }(MarketViewModel_1.MarketViewModel));
    exports.PricingModel = PricingModel;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('models/marketview/RankingModel',["require", "exports", "./MarketViewModel", "./TimePeriodModel", "moment"], function (require, exports, MarketViewModel_1, TimePeriodModel_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RankingModel = (function (_super) {
        __extends(RankingModel, _super);
        function RankingModel() {
            var _this = _super.call(this) || this;
            _this.time_period = new TimePeriodModel_1.TimePeriodModel();
            _this.data_types = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
            return _this;
        }
        RankingModel.prototype.getModelState = function () {
            return Object.assign({ time_period: this.time_period }, _super.prototype.getModelState.call(this));
        };
        RankingModel.prototype.initializeState = function (sample_dataset, sample_product) {
            if (sample_product === void 0) { sample_product = []; }
            _super.prototype.initializeState.call(this, sample_dataset, sample_product);
            var current_time_set = this.time_period.getTimePeriod().period_start ? true : false;
            for (var i = 0, ii = sample_dataset.length; i < ii; i++) {
                this.time_period.addWeek(sample_dataset[i].time_period.week_start + ' - ' + sample_dataset[i].time_period.week_end);
                this.time_period.addMonth(sample_dataset[i].time_period.month_start);
                this.time_period.addYear(sample_dataset[i].time_period.year_start);
                if (!current_time_set) {
                    switch (this.time_frame_mode) {
                        case 'month':
                            var month = sample_dataset[i].time_period.month_start;
                            this.time_period.setTimePeriod(moment(new Date(month)).startOf('month').format('MMMM DD YYYY'), moment(new Date(month)).endOf('month').format('MMMM DD YYYY'));
                            break;
                        case 'year':
                            var year = sample_dataset[i].time_period.year_start;
                            this.time_period.setTimePeriod(moment('Jan 1 ' + year).startOf('year').format('MMMM DD YYYY'), moment('Dec 31 ' + year).endOf('year').format('MMMM DD YYYY'));
                            break;
                        default:
                            this.time_period.setTimePeriod(sample_dataset[i].time_period.week_start, sample_dataset[i].time_period.week_end);
                            break;
                    }
                    current_time_set = true;
                }
            }
        };
        RankingModel.prototype.updateDataTable = function () {
            var data_array = [].concat.apply([], this.model_data.map(function (obj) { return obj.dataset; }));
            var sample_product = data_array[0].product;
            this.initializeState(data_array, sample_product);
            this.fieldDefinitions(sample_product);
            data_array = this.pivotData(data_array);
            if (this.exclude_industry)
                data_array = data_array.filter(function (item) { return item[2] !== 'Industry'; });
            this.data_table.setTableData([this.data_table.getTableInput().columnLabels].concat(data_array));
            this.data_table.setTableColumnLabels();
            this.data_table.setTableRowLabels(['Revenue Rank', 'Unit Rank', 'Brand']);
            this.data_table.setTableSummaries(['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change']);
            return this.data_table.getTableInput();
        };
        RankingModel.prototype.fieldDefinitions = function (product) {
            var _this = this;
            var field_definitions = [
                { name: 'Revenue Rank', type: 'float', filterable: true },
                { name: 'Unit Rank', type: 'float', filterable: true },
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Unit Sales', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return _this.formatDataValue(value); } },
                { name: 'Unit Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue Sales', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + _this.formatDataValue(value); } },
                { name: 'Revenue Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } }
            ];
            var columns = ['Revenue Rank'];
            columns[columns.length] = 'Unit Rank';
            columns[columns.length] = 'Brand';
            columns[columns.length] = 'Unit Sales';
            columns[columns.length] = 'Unit Change';
            columns[columns.length] = 'Revenue Sales';
            columns[columns.length] = 'Revenue Change';
            for (var i = 0, ii = product.length; i < ii; i++) {
                columns[columns.length] = product[i].spec_type;
                field_definitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
            }
            this.data_table.setTableFields(field_definitions);
            this.data_table.setTableColumnLabels(columns);
        };
        RankingModel.prototype.pivotData = function (data, totals) {
            var _this = this;
            if (totals === void 0) { totals = {}; }
            var previous = this.time_period.getTimePeriod(false);
            var current_time_period = this.time_frame_mode !== 'week' ? this.compressData(this.filterByTimePeriod(data, true)) : this.filterByTimePeriod(data, true);
            var previous_time_period = this.time_frame_mode !== 'week' ? this.compressData(this.filterByTimePeriod(data, true, false)) : this.filterByTimePeriod(data, true, false);
            data = current_time_period.map(function (obj, index) {
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand, 'Industry');
                result[result.length] = obj.units;
                var unitGrowth = index && previous.period_start ? ((current_time_period[index].units - previous_time_period[index].units) / previous_time_period[index].units) * 100 : 0;
                result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
                result[result.length] = obj.revenue;
                var revenueGrowth = index && previous.period_start ? ((current_time_period[index].revenue - previous_time_period[index].revenue) / previous_time_period[index].revenue) * 100 : 0;
                result[result.length] = isFinite(revenueGrowth) ? revenueGrowth : isNaN(revenueGrowth) ? 0 : 100;
                for (var i = 0, ii = obj.product.length; i < ii; i++) {
                    result[result.length] = obj.product[i].spec_value;
                }
                return result;
            });
            data.sort(function (a, b) { return b[1] - a[1]; });
            for (var i = 0, ii = data.length; i < ii; i++) {
                data[i].unshift(i + 1);
            }
            data.sort(function (a, b) { return b[4] - a[4]; });
            for (var i = 0, ii = data.length; i < ii; i++) {
                data[i].unshift(i + 1);
            }
            return data;
        };
        RankingModel.prototype.sortDataArray = function (a, b) {
            var brandA = a[0].toLowerCase();
            var brandB = b[0].toLowerCase();
            var dateA = (new Date(a[1])).getTime();
            var dateB = (new Date(b[1])).getTime();
            if (brandA === brandB) {
                return dateA - dateB;
            }
            return brandA > brandB ? 1 : -1;
        };
        RankingModel.prototype.filterByTimePeriod = function (data, filter, current_time) {
            var _this = this;
            if (filter === void 0) { filter = false; }
            if (current_time === void 0) { current_time = true; }
            var time_mode = this.time_period.getTimeMode();
            return data.filter(function (obj) {
                var period_start, period_end;
                switch (_this.time_frame_mode) {
                    case 'month':
                        var month = time_mode ? obj.time_period.month_start : obj.time_period.month_end;
                        period_start = moment(new Date(month)).startOf('month').format('MMMM DD YYYY');
                        period_end = moment(new Date(month)).endOf('month').format('MMMM DD YYYY');
                        break;
                    case 'year':
                        var year = time_mode ? obj.time_period.year_start : obj.time_period.year_end;
                        period_start = moment('Jan 1 ' + year).startOf('year').format('MMMM DD YYYY');
                        period_end = moment('Dec 31 ' + year).endOf('year').format('MMMM DD YYYY');
                        break;
                    default:
                        period_start = obj.time_period.week_start;
                        period_end = obj.time_period.week_end;
                        break;
                }
                return _this.validTimeFrame(period_start, period_end, filter, current_time) ? obj : null;
            });
        };
        RankingModel.prototype.validTimeFrame = function (period_start, period_end, filter, current_time) {
            if (filter === void 0) { filter = false; }
            if (current_time === void 0) { current_time = true; }
            var current = this.time_period.getTimePeriod();
            var previous = this.time_period.getTimePeriod(false);
            var result = false;
            var test_period_start = new Date(period_start);
            var test_period_end = new Date(period_end);
            if (filter) {
                if (current_time) {
                    return (current.period_start >= test_period_start && current.period_end <= test_period_end);
                }
                else {
                    return (previous.period_start >= test_period_start && previous.period_end <= test_period_end);
                }
            }
            if (current.period_start >= test_period_start && current.period_end <= test_period_end)
                result = true;
            if (previous.period_start >= test_period_start && previous.period_end <= test_period_end)
                result = true;
            return result;
        };
        RankingModel.prototype.compressData = function (dataset) {
            var result = {};
            for (var i = 0, ii = dataset.length; i < ii; i++) {
                var label = [dataset[i].brand];
                for (var j = 0, product = dataset[i].product, jj = product.length; j < jj; j++) {
                    label.push(product[j].spec_value);
                }
                label = label.join('|::|');
                if (result.hasOwnProperty(label)) {
                    result[label].units += dataset[i].units;
                    result[label].revenue += dataset[i].revenue;
                }
                else {
                    result[label] = Object.assign({}, dataset[i]);
                }
            }
            return Object.values(result);
        };
        RankingModel.prototype.getTimePeriod = function () {
            return this.time_period;
        };
        return RankingModel;
    }(MarketViewModel_1.MarketViewModel));
    exports.RankingModel = RankingModel;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('models/marketview/SalesGrowthModel',["require", "exports", "./MarketViewModel"], function (require, exports, MarketViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SalesGrowthModel = (function (_super) {
        __extends(SalesGrowthModel, _super);
        function SalesGrowthModel() {
            var _this = _super.call(this) || this;
            _this.data_types = ['Revenue', 'Revenue Percentage', 'Units', 'Units Percentage'];
            return _this;
        }
        SalesGrowthModel.prototype.fieldDefinitions = function (product) {
            var _this = this;
            var field_definitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return _this.formatDataValue(value); } },
                { name: 'Units Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + _this.formatDataValue(value); } },
                { name: 'Revenue Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value, field) { return value.toFixed(2) + '%'; } }
            ];
            var columns = ['Brand'];
            columns[columns.length] = 'Date';
            columns[columns.length] = 'Units';
            columns[columns.length] = 'Units Percentage';
            columns[columns.length] = 'Revenue';
            columns[columns.length] = 'Revenue Percentage';
            for (var i = 0, ii = product.length; i < ii; i++) {
                columns[columns.length] = product[i].spec_type;
                field_definitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
            }
            this.data_table.setTableFields(field_definitions);
            this.data_table.setTableColumnLabels(columns);
        };
        SalesGrowthModel.prototype.pivotData = function (data, totals) {
            var _this = this;
            if (totals === void 0) { totals = {}; }
            return data.map(function (obj, index, arr) {
                var unit_growth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
                var revenue_growth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0;
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand);
                result[result.length] = _this.formatDate(obj.last_sale_date);
                result[result.length] = index ? arr[index].units - arr[index - 1].units : 0;
                result[result.length] = isFinite(unit_growth) ? unit_growth : isNaN(unit_growth) ? 0 : 100;
                result[result.length] = index ? arr[index].revenue - arr[index - 1].revenue : 0;
                result[result.length] = isFinite(revenue_growth) ? revenue_growth : isNaN(revenue_growth) ? 0 : 100;
                for (var i = 0, ii = obj.product.length; i < ii; i++) {
                    result[result.length] = obj.product[i].spec_value;
                }
                return result;
            });
        };
        return SalesGrowthModel;
    }(MarketViewModel_1.MarketViewModel));
    exports.SalesGrowthModel = SalesGrowthModel;
});

define('models/index',["require", "exports", "./marketview/BrandShareModel", "./marketview/DataTableModel", "./marketview/DataGraphModel", "./marketview/MarketViewModel", "./marketview/PricingModel", "./marketview/RankingModel", "./marketview/SalesGrowthModel", "./marketview/TimePeriodModel"], function (require, exports, BrandShareModel_1, DataTableModel_1, DataGraphModel_1, MarketViewModel_1, PricingModel_1, RankingModel_1, SalesGrowthModel_1, TimePeriodModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrandShare = BrandShareModel_1.BrandShareModel;
    exports.DataTable = DataTableModel_1.DataTableModel;
    exports.DataGraph = DataGraphModel_1.DataGraphModel;
    exports.MarketView = MarketViewModel_1.MarketViewModel;
    exports.Pricing = PricingModel_1.PricingModel;
    exports.Ranking = RankingModel_1.RankingModel;
    exports.SalesGrowth = SalesGrowthModel_1.SalesGrowthModel;
    exports.TimePeriod = TimePeriodModel_1.TimePeriodModel;
});

define('pages/index',["require", "exports", "aurelia-router"], function (require, exports, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        var router = config.container.get(aurelia_router_1.Router);
        router.addRoute({ route: 'home', name: 'home', moduleId: 'pages/home/main', nav: true });
    }
    exports.configure = configure;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            './elements/common/load-spinner-element',
            './elements/market-view/data-graph-element',
            './elements/market-view/data-table-element',
            './elements/market-view/data-control-element',
            './elements/market-view/pivot-table-element',
            './plugins/palette',
        ]);
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('pages/home/main',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Home = (function () {
        function Home() {
        }
        Home.prototype.configureRouter = function (config) {
            config.map([
                { route: '', name: 'welcome', moduleId: './components/index', title: 'FSI - Welcome' }
            ]);
        };
        Home = __decorate([
            aurelia_framework_1.inlineView('<template><router-view></router-view></template>')
        ], Home);
        return Home;
    }());
    exports.Home = Home;
});

define('pages/page-elements/sidebar-menu',["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SidebarMenu = (function () {
        function SidebarMenu() {
        }
        SidebarMenu.prototype.anchorClicked = function (event) {
            var target = event.srcElement.id;
            var $li = $('#' + target.replace("chevron", "li")).parent();
            if ($li.is('.active')) {
                $li.removeClass('active active-sm');
                $('ul:first', $li).slideUp(function () {
                });
            }
            else {
                if (!$li.parent().is('.child_menu')) {
                    $('#sidebar-menu').find('li').removeClass('active active-sm');
                    $('#sidebar-menu').find('li ul').slideUp();
                }
                $li.addClass('active');
                $('ul:first', $li).slideDown(function () {
                });
            }
        };
        SidebarMenu.prototype.plot = function () {
            console.log('in sidebar');
            this.$BODY = $('body');
            this.$MENU_TOGGLE = $('#menu_toggle');
            this.$SIDEBAR_MENU = $('#sidebar-menu');
            this.$SIDEBAR_FOOTER = $('.sidebar-footer');
            this.$LEFT_COL = $('.left_col');
            this.$RIGHT_COL = $('.right_col');
            this.$NAV_MENU = $('.nav_menu');
            this.$FOOTER = $('footer');
            var $a = this.$SIDEBAR_MENU.find('a');
            this.$SIDEBAR_MENU.find('a').on('click', function (ev) {
                var $li = $(this).parent();
                if ($li.is('.active')) {
                    $li.removeClass('active active-sm');
                    $('ul:first', $li).slideUp(function () {
                        this.setContentHeight();
                    });
                }
                else {
                    if (!$li.parent().is('.child_menu')) {
                        this.$SIDEBAR_MENU.find('li').removeClass('active active-sm');
                        this.$SIDEBAR_MENU.find('li ul').slideUp();
                    }
                    $li.addClass('active');
                    $('ul:first', $li).slideDown(function () {
                        this.setContentHeight();
                    });
                }
            });
            this.$MENU_TOGGLE.on('click', function () {
                if (this.$BODY.hasClass('nav-md')) {
                    this.$SIDEBAR_MENU.find('li.active ul').hide();
                    this.$SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
                }
                else {
                    this.$SIDEBAR_MENU.find('li.active-sm ul').show();
                    this.$SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
                }
                this.$BODY.toggleClass('nav-md nav-sm');
                this.setContentHeight();
            });
        };
        SidebarMenu.prototype.setContentHeight = function () {
            this.$RIGHT_COL.css('min-height', $(window).height());
            var bodyHeight = this.$BODY.outerHeight(), footerHeight = this.$BODY.hasClass('footer_fixed') ? -10 : this.$FOOTER.height(), leftColHeight = this.$LEFT_COL.eq(1).height() + this.$SIDEBAR_FOOTER.height(), contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;
            contentHeight -= this.$NAV_MENU.height() + footerHeight;
            this.$RIGHT_COL.css('min-height', contentHeight);
        };
        ;
        return SidebarMenu;
    }());
    exports.SidebarMenu = SidebarMenu;
});

define('pages/page-elements/site-footer',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SiteFooter = (function () {
        function SiteFooter() {
        }
        return SiteFooter;
    }());
    exports.SiteFooter = SiteFooter;
});

define('pages/page-elements/topbar-menu',["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopbarMenu = (function () {
        function TopbarMenu() {
        }
        TopbarMenu.prototype.toggleClicked = function (event) {
            var target = event.srcElement.id;
            var body = $('body');
            var menu = $('#sidebar-menu');
            if (body.hasClass('nav-md')) {
                menu.find('li.active ul').hide();
                menu.find('li.active').addClass('active-sm').removeClass('active');
            }
            else {
                menu.find('li.active-sm ul').show();
                menu.find('li.active-sm').addClass('active').removeClass('active-sm');
            }
            body.toggleClass('nav-md nav-sm');
        };
        return TopbarMenu;
    }());
    exports.TopbarMenu = TopbarMenu;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/home/components/index',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-binding", "aurelia-event-aggregator", "./../../../models/index", "jquery"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_binding_1, aurelia_event_aggregator_1, index_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HomeLanding = (function () {
        function HomeLanding(http_client, binding_engine, events) {
            this.http_client = http_client;
            this.binding_engine = binding_engine;
            this.events = events;
            this.display_all_rows = false;
            this.data_refresh = false;
            this.graph_refresh = false;
            this.observers = [];
            this.page_state = {
                model: 'brandshare',
                time_frame: 'week',
                graph_type: 'line',
                compare_list: [],
                exclude_industry: false,
            };
            this.model_list = {
                brandshare: new index_1.BrandShare(),
                pricing: new index_1.Pricing(),
                salesgrowth: new index_1.SalesGrowth(),
                ranking: new index_1.Ranking()
            };
            this.http_client = http_client.configure(function (config) {
                config
                    .useStandardConfiguration()
                    .withBaseUrl('/');
            });
        }
        HomeLanding.prototype.updateModelProperties = function () {
            this.model_list[this.page_state.model].setModelData(this.model_data);
            this.model_list[this.page_state.model].setTimeFrame(this.page_state.time_frame);
            this.model_list[this.page_state.model].setCompareList(this.page_state.compare_list, this.page_state.exclude_industry);
        };
        HomeLanding.prototype.updateDataTable = function () {
            if (this.model_data) {
                this.updateModelProperties();
                this.table_input = this.model_list[this.page_state.model].updateDataTable();
                this.model_state = this.model_list[this.page_state.model].getModelState();
            }
        };
        HomeLanding.prototype.updateDataGraph = function () {
            this.table_output['filter_limit'] = $('input.row-labelable:checked').length;
            this.model_list[this.page_state.model].setGraphData(this.table_output);
            this.graph_input = this.model_list[this.page_state.model].getGraphInput(this.page_state.graph_type);
        };
        HomeLanding.prototype.spinnerOpen = function () {
            this.events.publish('$openSpinner');
        };
        HomeLanding.prototype.spinnerClose = function () {
            this.events.publish('$closeSpinner');
        };
        HomeLanding.prototype.fetchModelData = function () {
            var _this = this;
            var _class = this;
            this.spinnerOpen();
            return this.http_client.fetch('marketview/data')
                .then(function (response) { return response.json(); })
                .then(function (data) { _class.model_data = data; })
                .then(function () {
                _this.spinnerClose();
            });
        };
        HomeLanding.prototype.setObservers = function () {
            var _this = this;
            this.observers.push(this.binding_engine.propertyObserver(this, 'data_refresh')
                .subscribe(function (new_value, old_value) {
                if (_this.data_refresh) {
                    _this.updateDataTable();
                    _this.data_refresh = false;
                }
            }));
            this.observers.push(this.binding_engine.propertyObserver(this, 'graph_refresh')
                .subscribe(function (new_value, old_value) {
                if (_this.graph_refresh) {
                    _this.updateDataGraph();
                    _this.graph_refresh = false;
                }
            }));
        };
        HomeLanding.prototype.attached = function () {
            var _this = this;
            this.setObservers();
            this.fetchModelData()
                .then(function () {
                _this.updateDataTable();
            });
        };
        HomeLanding.prototype.detached = function () {
            for (var i = 0, ii = this.observers.length; i < ii; i++) {
                this.observers[i].dispose();
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "page_state", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "model_state", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "table_output", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], HomeLanding.prototype, "display_all_rows", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], HomeLanding.prototype, "data_refresh", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], HomeLanding.prototype, "graph_refresh", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "table_input", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "model_data", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "graph_input", void 0);
        HomeLanding = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator])
        ], HomeLanding);
        return HomeLanding;
    }());
    exports.HomeLanding = HomeLanding;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/common/load-spinner-element',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-binding", "aurelia-event-aggregator", "jquery"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_binding_1, aurelia_event_aggregator_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadSpinnerElement = (function () {
        function LoadSpinnerElement(bindingEngine, events) {
            this.bindingEngine = bindingEngine;
            this.events = events;
            this.toggle = false;
            this.subscriptionList = [];
        }
        LoadSpinnerElement.prototype.attached = function () {
            this.subscriptionList.push(this.events.subscribe('$openSpinner', function () { return $('#load-spinner').show(); }));
            this.subscriptionList.push(this.events.subscribe('$closeSpinner', function () { return $('#load-spinner').hide(); }));
        };
        LoadSpinnerElement.prototype.detached = function () {
            for (var i = 0, ii = this.subscriptionList.length; i < ii; i++) {
                this.subscriptionList[i].dispose();
            }
        };
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Boolean)
        ], LoadSpinnerElement.prototype, "toggle", void 0);
        LoadSpinnerElement = __decorate([
            aurelia_framework_1.customElement('load-spinner'),
            aurelia_framework_2.useView('./load-spinner-element.html'),
            aurelia_framework_2.inject(aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator])
        ], LoadSpinnerElement);
        return LoadSpinnerElement;
    }());
    exports.LoadSpinnerElement = LoadSpinnerElement;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/market-view/data-control-element',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-binding", "aurelia-event-aggregator", "aurelia-pal", "jquery"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_binding_1, aurelia_event_aggregator_1, aurelia_pal_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataControlElement = (function () {
        function DataControlElement(binding_engine, events) {
            this.binding_engine = binding_engine;
            this.events = events;
            this.display_all_rows = false;
            this.data_refresh = false;
            this.graph_refresh = false;
            this.observers = [];
            this.mutation_observers = [];
        }
        DataControlElement.prototype.initialize = function () {
            var _this = this;
            $('input[type="radio"][name="graph_type"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked'))
                    _this.page_state.graph_type = $(_jqThis).val();
                _this.graph_refresh = true;
            });
            $('input[type="radio"][name="time_frame"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked')) {
                    _this.page_state.time_frame = $(_jqThis).val();
                    if (_this.page_state.model === 'ranking') {
                        _this.model_state.time_period.setTimePeriod(null, null);
                        _this.model_state.time_period.setTimePeriod(null, null, false);
                    }
                    _this.data_refresh = true;
                    _this.resetButtons();
                }
            });
            $('input[type="radio"][name="display_option"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked'))
                    _this.display_all_rows = $(_jqThis).val() === 'all';
            });
            $('input[type="radio"][name="data_model"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked'))
                    _this.page_state.model = $(_jqThis).val();
                _this.data_refresh = true;
            });
            $('input[type="checkbox"][name="industry"]').change(function (event) {
                var _jqThis = event.currentTarget;
                _this.page_state.exclude_industry = $(_jqThis).is(':checked') ? false : true;
                _this.data_refresh = true;
            });
            this.initDataTypes();
            this.initFilterOptions();
            $('.keep-open').on({
                "shown.bs.dropdown": function (event) { $(event.currentTarget).attr('closable', false); },
                "click": function () { },
                "hide.bs.dropdown": function (event) { return $(event.currentTarget).attr('closable') == 'true'; }
            });
            $('.keep-open .dLabel, .keep-open .dToggle').on({
                "click": function (event) {
                    $(event.currentTarget).parent().attr('closable', true);
                }
            });
        };
        DataControlElement.prototype.initCompareOptions = function () {
            var include = [];
            $('input[type="checkbox"][name="compare_option"]').each(function (index, element) {
                if ($(element).is(':checked'))
                    include.push($(element).val());
            });
            this.page_state.compare_list = include;
            this.resetButtons();
            this.data_refresh = true;
        };
        DataControlElement.prototype.initDataTypes = function () {
            $('input[type="radio"][name="data_type"], input[type="checkbox"][name="data_type"]').unbind('change');
            $('input[type="radio"][name="data_type"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked')) {
                    $('input[type="checkbox"].summary:checked').click();
                    $('input[type="checkbox"][data-field="' + $(_jqThis).val() + '"].summary').click();
                }
            });
            $('input[type="checkbox"][name="data_type"]').change(function (event) {
                $('input[type="checkbox"][data-field="' + $(event.currentTarget).val() + '"].summary').click();
            });
        };
        DataControlElement.prototype.initFilterOptions = function () {
            $('input[type="checkbox"][name="filter_item"]').unbind('change');
            $('input[type="checkbox"][name="filter_item"]').change(function (event) {
                var _jqThis = event.currentTarget;
                $('input[type="checkbox"][data-field="' + $(_jqThis).val() + '"].row-labelable').click();
            });
            if (this.page_state.model === 'ranking')
                $('input[type="checkbox"][name="filter_item"]:first').click();
        };
        DataControlElement.prototype.initTimePeriodList = function () {
            var _this = this;
            $('input[type="radio"][name="time_period"]').change(function (event) {
                var _jqThis = event.currentTarget;
                var time_period_buttons = $('input[type="radio"][name="time_period"]');
                if ($(_jqThis).is(':checked')) {
                    var current_time_period = $(_jqThis).val().split(' - ');
                    _this.model_state.time_period.setTimePeriod(current_time_period[0], current_time_period[1]);
                    var previous_radio_index = $('input[type="radio"][name="time_period"]').index(_jqThis) - 1;
                    var previous_time_period = previous_radio_index > 0 ? time_period_buttons.eq(previous_radio_index).val().split(' - ') : null;
                    if (previous_time_period) {
                        _this.model_state.time_period.setTimePeriod(previous_time_period[0], previous_time_period[1], false);
                    }
                    else {
                        _this.model_state.time_period.setTimePeriod(null, null, false);
                    }
                    _this.data_refresh = true;
                }
            });
            $('input[type="radio"][name="time_splice"]').unbind('change');
            $('input[type="radio"][name="time_splice"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked')) {
                    if ($(_jqThis).val() === 'start') {
                        _this.model_state.time_period.useStartDate();
                    }
                    else {
                        _this.model_state.time_period.useEndDate();
                    }
                    _this.data_refresh = true;
                }
            });
        };
        DataControlElement.prototype.resetButtons = function () {
            $.each($('input[type="checkbox"][name="data_type"], input[type="checkbox"][name="filter_item"]'), function (key, value) {
                if ($(value).is(':checked'))
                    $(value).click();
            });
            $('input[type="radio"][name="data_type"]:first').click();
            if (this.page_state.model === 'ranking') {
                $('input[type="radio"][name="time_period"]').unbind('change');
                $('input[type="radio"][name="time_period"]:first').click();
                this.initTimePeriodList();
            }
            this.initDataTypes();
            this.initFilterOptions();
        };
        DataControlElement.prototype.attached = function () {
            var _this = this;
            this.initialize();
            var compare_list_observer = aurelia_pal_1.DOM.createMutationObserver(function () {
                _this.initCompareOptions();
            });
            this.mutation_observers.push(compare_list_observer.observe($('#compare_entries')[0], { childList: true, subtree: true, attributes: true, characterData: true }));
            var dataTypeObserver = aurelia_pal_1.DOM.createMutationObserver(function () {
                _this.initDataTypes();
            });
            this.mutation_observers.push(dataTypeObserver.observe($('#data_type_list')[0], { childList: true, subtree: true, characterData: true }));
            var filter_list_observer = aurelia_pal_1.DOM.createMutationObserver(function () {
                _this.initFilterOptions();
            });
            this.mutation_observers.push(filter_list_observer.observe($('#filter_list')[0], { childList: true, subtree: true, characterData: true }));
            this.observers.push(this.binding_engine.propertyObserver(this, 'model_state')
                .subscribe(function (new_value, old_value) {
                if (_this.model_state) {
                    _this.filter_list = _this.model_state.filter_list;
                    _this.initFilterOptions();
                    _this.initDataTypes();
                    if (_this.model_state.hasOwnProperty('time_period')) {
                        if (_this.page_state.time_frame === 'week') {
                            _this.time_period_list = _this.model_state.time_period.getWeek();
                        }
                        else if (_this.page_state.time_frame === 'month') {
                            _this.time_period_list = _this.model_state.time_period.getMonth();
                        }
                        else if (_this.page_state.time_frame === 'year') {
                            _this.time_period_list = _this.model_state.time_period.getYear();
                        }
                        _this.initTimePeriodList();
                    }
                }
            }));
        };
        DataControlElement.prototype.detached = function () {
            for (var i = 0, ii = this.mutation_observers.length; i < ii; i++) {
                this.mutation_observers[i].disconnect();
            }
            for (var i = 0, ii = this.observers.length; i < ii; i++) {
                this.observers[i].dispose();
            }
        };
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], DataControlElement.prototype, "page_state", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], DataControlElement.prototype, "model_state", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], DataControlElement.prototype, "display_all_rows", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], DataControlElement.prototype, "time_period_list", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], DataControlElement.prototype, "filter_list", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], DataControlElement.prototype, "data_refresh", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], DataControlElement.prototype, "graph_refresh", void 0);
        DataControlElement = __decorate([
            aurelia_framework_1.customElement('data-control'),
            aurelia_framework_2.useView('./data-control-element.html'),
            aurelia_framework_2.inject(aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator])
        ], DataControlElement);
        return DataControlElement;
    }());
    exports.DataControlElement = DataControlElement;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/market-view/data-graph-element',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-binding", "jquery", "chart.js"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_binding_1, $, Chart) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataGraphElement = (function () {
        function DataGraphElement(binding_engine) {
            this.binding_engine = binding_engine;
        }
        DataGraphElement.prototype.updateDataGraph = function () {
            if (!this.chart || this.chart.config.type !== this.graph_input.type) {
                this.createNewChart();
                return;
            }
            this.chart.data = this.graph_input.data;
            this.chart.update();
        };
        DataGraphElement.prototype.createNewChart = function () {
            $('#chartjsGraph, .chartjs-hidden-iframe').remove();
            $('#graph-container').append('<canvas id="chartjsGraph"></canvas>');
            if (this.graph_input.type === 'pie') {
                $('#graph-container').css('width', '600px');
            }
            else {
                $('#graph-container').css('width', '1072px');
            }
            var context = $("#chartjsGraph")[0];
            this.chart = new Chart(context, {
                type: this.graph_input.type,
                data: this.graph_input.data,
                options: this.graph_input.options
            });
        };
        DataGraphElement.prototype.attached = function () {
            var _this = this;
            this.subscription = this.binding_engine.propertyObserver(this, 'graph_input')
                .subscribe(function (new_value, old_value) { return _this.updateDataGraph(); });
        };
        DataGraphElement.prototype.detached = function () {
            this.subscription.dispose();
        };
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Object)
        ], DataGraphElement.prototype, "graph_input", void 0);
        DataGraphElement = __decorate([
            aurelia_framework_1.customElement('data-graph'),
            aurelia_framework_2.useView('./data-graph-element.html'),
            aurelia_framework_2.inject(aurelia_binding_1.BindingEngine),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine])
        ], DataGraphElement);
        return DataGraphElement;
    }());
    exports.DataGraphElement = DataGraphElement;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/market-view/data-table-element',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-binding", "aurelia-event-aggregator", "jquery", "datatables.net-buttons-bs", "./../../../scripts/vendors/pivot/pivot.min.js", "./../../../scripts/vendors/pivot/jquery_pivot.js"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_binding_1, aurelia_event_aggregator_1, $, DataTable) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataTableElement = (function () {
        function DataTableElement(binding_engine, events) {
            this.binding_engine = binding_engine;
            this.events = events;
            this.display_all_rows = false;
            this.graph_refresh = false;
            this.subscription = null;
            this.data_table = null;
            this.hidden_columns = [];
        }
        DataTableElement.prototype.spinnerOpen = function () {
            this.events.publish('$openSpinner');
        };
        DataTableElement.prototype.spinnerClose = function () {
            this.events.publish('$closeSpinner');
        };
        DataTableElement.prototype.outputData = function () {
            var _this = this;
            var export_config = {
                modifier: {
                    order: this.display_all_rows ? 'current' : 'index',
                    page: this.display_all_rows ? 'all' : 'current',
                },
                format: {
                    body: function (innerHtml, rowIndex, columnIndex, cellNode) {
                        var value = Number(innerHtml.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
                        return !isNaN(value) ? value : innerHtml;
                    }
                }
            };
            if (this.hidden_columns.length) {
                export_config['columns'] = Array.from(Array(this.data_table.columns().header().length).keys()).filter(function (value) { return _this.hidden_columns.indexOf(value) === -1; });
            }
            var data = this.data_table.buttons.exportData(export_config);
            this.table_output = data;
            this.graph_refresh = true;
        };
        DataTableElement.prototype.setupPivot = function (input) {
            var _this = this;
            this.spinnerOpen();
            if (DataTable) {
                this.hidden_columns = [];
                $('.pivot_header_fields').remove();
                input.callbacks = { afterUpdateResults: function () {
                        _this.data_table = $('#data-table-container table').DataTable({
                            scrollY: "500px",
                            scrollX: "1200px",
                            scrollCollapse: true,
                            select: 'single'
                        });
                        $('#data-table-container table').addClass('table-bordered');
                        $('#data-table-container table th, #data-table-container table td').css('white-space', 'nowrap');
                        $('#data-table-container table th').css('font-size', '10px');
                        _this.drawTable();
                    } };
                $('#data-menu-container').pivot_display('setup', input);
                this.spinnerClose();
            }
            else {
                setTimeout(function () {
                    _this.setupPivot(input);
                }, 100);
            }
        };
        DataTableElement.prototype.drawTable = function () {
            this.data_table.column('0:visible').order('asc').draw();
            var column_limit = 12;
            var num_of_columns = this.data_table.columns().header().length;
            var filter_num = $('input.row-labelable:checked').length;
            var extra_columns = num_of_columns > column_limit ? num_of_columns - column_limit : 0;
            if (extra_columns) {
                this.hidden_columns = Array.from(Array(extra_columns).keys()).filter(function (value) { return value >= filter_num; });
                this.data_table.columns(this.hidden_columns).visible(false, false);
                this.data_table.columns.adjust().draw(false);
            }
            this.outputData();
        };
        DataTableElement.prototype.attached = function () {
            var _this = this;
            this.subscription = this.binding_engine.propertyObserver(this, 'table_input')
                .subscribe(function (new_value, old_value) {
                _this.setupPivot(new_value);
            });
            this.subscription = this.binding_engine.propertyObserver(this, 'display_all_rows')
                .subscribe(function (new_value, old_value) { return _this.outputData(); });
        };
        DataTableElement.prototype.detached = function () {
            this.subscription.dispose();
        };
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Object)
        ], DataTableElement.prototype, "table_input", void 0);
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Boolean)
        ], DataTableElement.prototype, "display_all_rows", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], DataTableElement.prototype, "table_output", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], DataTableElement.prototype, "graph_refresh", void 0);
        DataTableElement = __decorate([
            aurelia_framework_1.customElement('data-table'),
            aurelia_framework_2.useView('./data-table-element.html'),
            aurelia_framework_2.inject(aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator])
        ], DataTableElement);
        return DataTableElement;
    }());
    exports.DataTableElement = DataTableElement;
});



define("resources/elements/market-view/import-element", [],function(){});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/market-view/pivot-table-element',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-binding", "jquery", "pivottable"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_binding_1, $, PivotTable) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PivotTableElement = (function () {
        function PivotTableElement(bindingEngine) {
            this.bindingEngine = bindingEngine;
            this.tableData = { json: '' };
            this.subscription = null;
        }
        PivotTableElement.prototype.updatePivottable = function () {
            this.setupPivot(this.tableData.input);
        };
        PivotTableElement.prototype.setupPivot = function (input) {
            var _this = this;
            if (PivotTable) {
                $("#pivot-table-container").pivot(input, {
                    rows: ["Brand", "Model"],
                    cols: ["Date"],
                    aggregator: this.brandshare('revenue', 'whole'),
                    colOrder: 'value_a_to_z'
                });
            }
            else {
                setTimeout(function () {
                    _this.setupPivot(input);
                }, 100);
            }
        };
        PivotTableElement.prototype.brandshare = function (dataType, dataFormat) {
            return function (data, rowKey, colKey) {
                return {
                    result: 0,
                    total: 0,
                    push: function (record) { this.result = dataType === 'revenue' ? record.Revenue : record.Units; this.total += this.result; },
                    value: function () { return colKey.length ? this.result : this.total; },
                    format: function (x) { x = x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); return dataFormat === 'whole' ? x : x + '%'; },
                };
            };
        };
        PivotTableElement.prototype.attached = function () {
            var _this = this;
            this.subscription = this.bindingEngine.propertyObserver(this.tableData, 'input')
                .subscribe(function (newValue, oldValue) { return _this.updatePivottable(); });
        };
        PivotTableElement.prototype.detached = function () {
            this.subscription.dispose();
        };
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Object)
        ], PivotTableElement.prototype, "tableData", void 0);
        PivotTableElement = __decorate([
            aurelia_framework_1.customElement('pivot-table'),
            aurelia_framework_2.useView('./pivot-table-element.html'),
            aurelia_framework_2.inject(aurelia_binding_1.BindingEngine),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine])
        ], PivotTableElement);
        return PivotTableElement;
    }());
    exports.PivotTableElement = PivotTableElement;
});

define('resources/plugins/palette',['require','exports','module'],function (require, exports, module) {/** @license
 *
 *     Colour Palette Generator script.
 *     Copyright (c) 2014 Google Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License.  You may
 *     obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 *     implied.  See the License for the specific language governing
 *     permissions and limitations under the License.
 *
 * Furthermore, ColorBrewer colour schemes are covered by the following:
 *
 *     Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and
 *                        The Pennsylvania State University.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License. You may obtain
 *     a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 *     implied. See the License for the specific language governing
 *     permissions and limitations under the License.
 *
 *     Redistribution and use in source and binary forms, with or without
 *     modification, are permitted provided that the following conditions are
 *     met:
 *
 *     1. Redistributions as source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *     2. The end-user documentation included with the redistribution, if any,
 *     must include the following acknowledgment: "This product includes color
 *     specifications and designs developed by Cynthia Brewer
 *     (http://colorbrewer.org/)." Alternately, this acknowledgment may appear
 *     in the software itself, if and wherever such third-party
 *     acknowledgments normally appear.
 *
 *     4. The name "ColorBrewer" must not be used to endorse or promote products
 *     derived from this software without prior written permission. For written
 *     permission, please contact Cynthia Brewer at cbrewer@psu.edu.
 *
 *     5. Products derived from this software may not be called "ColorBrewer",
 *     nor may "ColorBrewer" appear in their name, without prior written
 *     permission of Cynthia Brewer.
 *
 * Furthermore, Solarized colour schemes are covered by the following:
 *
 *     Copyright (c) 2011 Ethan Schoonover
 *
 *     Permission is hereby granted, free of charge, to any person obtaining
 *     a copy of this software and associated documentation files (the
 *     "Software"), to deal in the Software without restriction, including
 *     without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to
 *     permit persons to whom the Software is furnished to do so, subject to
 *     the following conditions:
 *
 *     The above copyright notice and this permission notice shall be included
 *     in all copies or substantial portions of the Software.
 *
 *     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 *     OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *     LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *     OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *     WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

var palette = (function() {

  var proto = Array.prototype;
  var slice = function(arr, opt_begin, opt_end) {
    return proto.slice.apply(arr, proto.slice.call(arguments, 1));
  };

  var extend = function(arr, arr2) {
    return proto.push.apply(arr, arr2);
  };

  var function_type = typeof function() {};

  var INF = 1000000000;  // As far as we're concerned, that's infinity. ;)


  /**
   * Generate a colour palette from given scheme.
   *
   * If scheme argument is not a function it is passed to palettes.listSchemes
   * function (along with the number argument).  This may result in an array
   * of more than one available scheme.  If that is the case, scheme at
   * opt_index position is taken.
   *
   * This allows using different palettes for different data without having to
   * name the schemes specifically, for example:
   *
   *     palette_for_foo = palette('sequential', 10, 0);
   *     palette_for_bar = palette('sequential', 10, 1);
   *     palette_for_baz = palette('sequential', 10, 2);
   *
   * @param {!palette.SchemeType|string|palette.Palette} scheme Scheme to
   *     generate palette for.  Either a function constructed with
   *     palette.Scheme object, or anything that palette.listSchemes accepts
   *     as name argument.
   * @param {number} number Number of colours to return.  If negative, absolute
   *     value is taken and colours will be returned in reverse order.
   * @param {number=} opt_index If scheme is a name of a group or an array and
   *     results in more than one scheme, index of the scheme to use.  The
   *     index wraps around.
   * @param {...*} varargs Additional arguments to pass to palette or colour
   *     generator (if the chosen scheme uses those).
   * @return {Array<string>} Array of abs(number) 'RRGGBB' strings or null if
   *     no matching scheme was found.
   */
  var palette = function(scheme, number, opt_index, varargs) {
    number |= 0;
    if (number == 0) {
      return [];
    }

    if (typeof scheme !== function_type) {
      var arr = palette.listSchemes(
          /** @type {string|palette.Palette} */ (scheme), number);
      if (!arr.length) {
        return null;
      }
      scheme = arr[(opt_index || 0) % arr.length];
    }

    var args = slice(arguments, 2);
    args[0] = number;
    return scheme.apply(scheme, args);
  };


  /**
   * Returns a callable colour scheme object.
   *
   * Just after being created, the scheme has no colour palettes and no way of
   * generating any, thus generate method will return null.  To turn scheme
   * into a useful object, addPalette, addPalettes or setColorFunction methods
   * need to be used.
   *
   * To generate a colour palette with given number colours using function
   * returned by this method, just call it with desired number of colours.
   *
   * Since this function *returns* a callable object, it must *not* be used
   * with the new operator.
   *
   * @param {string} name Name of the scheme.
   * @param {string|!Array<string>=} opt_groups A group name or list of
   *     groups the scheme should be categorised under.  Three typical groups
   *     to use are 'qualitative', 'sequential' and 'diverging', but any
   *     groups may be created.
   * @return {!palette.SchemeType} A colour palette generator function, which
   *     in addition has methods and properties like a regular object.  Think
   *     of it as a callable object.
   */
  palette.Scheme = function(name, opt_groups) {
    /**
     * A map from a number to a colour palettes with given number of colours.
     * @type {!Object<number, palette.Palette>}
     */
    var palettes = {};

    /**
     * The biggest palette in palettes map.
     * @type {number}
     */
    var palettes_max = 0;

    /**
     * The smallest palette in palettes map.
     * @type {number}
     */
    var palettes_min = INF;

    var makeGenerator = function() {
      if (arguments.length <= 1) {
        return self.color_func.bind(self);
      } else {
        var args = slice(arguments);
        return function(x) {
          args[0] = x;
          return self.color_func.apply(self, args);
        };
      }
    };

    /**
     * Generate a colour palette from the scheme.
     *
     * If there was a palette added with addPalette (or addPalettes) with
     * enough colours, that palette will be used.  Otherwise, if colour
     * function has been set using setColorFunction method, that function will
     * be used to generate the palette.  Otherwise null is returned.
     *
     * @param {number} number Number of colours to return.  If negative,
     *     absolute value is taken and colours will be returned in reverse
     *     order.
     * @param {...*} varargs Additional arguments to pass to palette or colour
     *     generator (if the chosen scheme uses those).
     */
    var self = function(number, varargs) {
      number |= 0;
      if (!number) {
        return [];
      }

      var _number = number;
      number = Math.abs(number);

      if (number <= palettes_max) {
        for (var i = Math.max(number, palettes_min); !(i in palettes); ++i) {
          /* nop */
        }
        var colors = palettes[i];
        if (i > number) {
          var take_head =
              'shrinking_takes_head' in colors ?
              colors.shrinking_takes_head : self.shrinking_takes_head;
          if (take_head) {
            colors = colors.slice(0, number);
            i = number;
          } else {
            return palette.generate(
                function(x) { return colors[Math.round(x)]; },
                _number, 0, colors.length - 1);
          }
        }
        colors = colors.slice();
        if (_number < 0) {
          colors.reverse();
        }
        return colors;

      } else if (self.color_func) {
        return palette.generate(makeGenerator.apply(self, arguments),
                                _number, 0, 1, self.color_func_cyclic);

      } else {
        return null;
      }
    };

    /**
     * The name of the palette.
     * @type {string}
     */
    self.scheme_name = name;

    /**
     * A list of groups the palette belongs to.
     * @type {!Array<string>}
     */
    self.groups = opt_groups ?
      typeof opt_groups === 'string' ? [opt_groups] : opt_groups : [];

    /**
     * The biggest palette this scheme can generate.
     * @type {number}
     */
    self.max = 0;

    /**
     * The biggest palette this scheme can generate that is colour-blind
     * friendly.
     * @type {number}
     */
    self.cbf_max = INF;


    /**
     * Adds a colour palette to the colour scheme.
     *
     * @param {palette.Palette} palette An array of 'RRGGBB' strings
     *     representing the palette to add.
     * @param {boolean=} opt_is_cbf Whether the palette is colourblind friendly.
     */
    self.addPalette = function(palette, opt_is_cbf) {
      var len = palette.length;
      if (len) {
        palettes[len] = palette;
        palettes_min = Math.min(palettes_min, len);
        palettes_max = Math.max(palettes_max, len);
        self.max = Math.max(self.max, len);
        if (!opt_is_cbf && len != 1) {
          self.cbf_max = Math.min(self.cbf_max, len - 1);
        }
      }
    };

    /**
     * Adds number of colour palettes to the colour scheme.
     *
     * @param {palette.PalettesList} palettes A map or an array of colour
     *     palettes to add.  If map, i.e.  object, is used, properties should
     *     use integer property names.
     * @param {number=} opt_max Size of the biggest palette in palettes set.
     *     If not set, palettes must have a length property which will be used.
     * @param {number=} opt_cbf_max Size of the biggest palette which is still
     *     colourblind friendly.  1 by default.
     */
    self.addPalettes = function(palettes, opt_max, opt_cbf_max) {
      opt_max = opt_max || palettes.length;
      for (var i = 0; i < opt_max; ++i) {
        if (i in palettes) {
          self.addPalette(palettes[i], true);
        }
      }
      self.cbf_max = Math.min(self.cbf_max, opt_cbf_max || 1);
    };

    /**
     * Enable shrinking palettes taking head of the list of colours.
     *
     * When user requests n-colour palette but the smallest palette added with
     * addPalette (or addPalettes) is m-colour one (where n < m), n colours
     * across the palette will be returned.  For example:
     *     var ex = palette.Scheme('ex');
     *     ex.addPalette(['000000', 'bcbcbc', 'ffffff']);
     *     var pal = ex(2);
     *     // pal == ['000000', 'ffffff']
     *
     * This works for palettes where the distance between colours is
     * correlated to distance in the palette array, which is true in gradients
     * such as the one above.
     *
     * To turn this feature off shrinkByTakingHead can be set to true either
     * for all palettes in the scheme (if opt_idx is not given) or for palette
     * with given number of colours only.  In general, setting the option for
     * given palette overwrites whatever has been set for the scheme.  The
     * default, as described above, is false.
     *
     * Alternatively, the feature can be enabled by setting shrinking_takes_head
     * property for the palette Array or the scheme object.
     *
     * For example, all of the below give equivalent results:
     *     var pal = ['ff0000', '00ff00', '0000ff'];
     *
     *     var ex = palette.Scheme('ex');
     *     ex.addPalette(pal);               // ex(2) == ['ff0000', '0000ff']
     *     ex.shrinkByTakingHead(true);      // ex(2) == ['ff0000', '00ff00']
     *
     *     ex = palette.Scheme('ex');
     *     ex.addPalette(pal);               // ex(2) == ['ff0000', '0000ff']
     *     ex.shrinkByTakingHead(true, 3);   // ex(2) == ['ff0000', '00ff00']
     *
     *     ex = palette.Scheme('ex');
     *     ex.addPalette(pal);
     *     ex.addPalette(pal);               // ex(2) == ['ff0000', '0000ff']
     *     pal.shrinking_takes_head = true;  // ex(2) == ['ff0000', '00ff00']
     *
     * @param {boolean} enabled Whether to enable or disable the “shrinking
     *     takes head” feature.  It is disabled by default.
     * @param {number=} opt_idx If given, the “shrinking takes head” option
     *     for palette with given number of colours is set.  If such palette
     *     does not exist, nothing happens.
     */
    self.shrinkByTakingHead = function(enabled, opt_idx) {
      if (opt_idx !== void(0)) {
        if (opt_idx in palettes) {
          palettes[opt_idx].shrinking_takes_head = !!enabled;
        }
      } else {
        self.shrinking_takes_head = !!enabled;
      }
    };

    /**
     * Sets a colour generation function of the colour scheme.
     *
     * The function must accept a singe number argument whose value can be from
     * 0.0 to 1.0, and return a colour as an 'RRGGBB' string.  This function
     * will be used when generating palettes, i.e. if 11-colour palette is
     * requested, this function will be called with arguments 0.0, 0.1, …, 1.0.
     *
     * If the palette generated by the function is colourblind friendly,
     * opt_is_cbf should be set to true.
     *
     * In some cases, it is not desirable to reach 1.0 when generating
     * a palette.  This happens for hue-rainbows where the 0–1 range corresponds
     * to a 0°–360° range in hues, and since hue at 0° is the same as at 360°,
     * it's desired to stop short the end of the range when generating
     * a palette.  To accomplish this, opt_cyclic should be set to true.
     *
     * @param {palette.ColorFunction} func A colour generator function.
     * @param {boolean=} opt_is_cbf Whether palette generate with the function
     *     is colour-blind friendly.
     * @param {boolean=} opt_cyclic Whether colour at 0.0 is the same as the
     *     one at 1.0.
     */
    self.setColorFunction = function(func, opt_is_cbf, opt_cyclic) {
      self.color_func = func;
      self.color_func_cyclic = !!opt_cyclic;
      self.max = INF;
      if (!opt_is_cbf && self.cbf_max === INF) {
        self.cbf_max = 1;
      }
    };

    self.color = function(x, varargs) {
      if (self.color_func) {
        return self.color_func.apply(this, arguments);
      } else {
        return null;
      }
    };

    return self;
  };


  /**
   * Creates a new palette.Scheme and initialises it by calling addPalettes
   * method with the rest of the arguments.
   *
   * @param {string} name Name of the scheme.
   * @param {string|!Array<string>} groups A group name or list of group
   *     names the scheme belongs to.
   * @param {!Object<number, palette.Palette>|!Array<palette.Palette>}
   *     palettes A map or an array of colour palettes to add.  If map, i.e.
   *     object, is used, properties should use integer property names.
   * @param {number=} opt_max Size of the biggest palette in palettes set.
   *     If not set, palettes must have a length property which will be used.
   * @param {number=} opt_cbf_max Size of the biggest palette which is still
   *     colourblind friendly.  1 by default.
   * @return {!palette.SchemeType} A colour palette generator function, which
   *     in addition has methods and properties like a regular object.  Think
   *     of it as a callable object.
   */
  palette.Scheme.fromPalettes = function(name, groups,
                                         palettes, opt_max, opt_cbf_max) {
    var scheme = palette.Scheme(name, groups);
    scheme.addPalettes.apply(scheme, slice(arguments, 2));
    return scheme;
  };


  /**
   * Creates a new palette.Scheme and initialises it by calling
   * setColorFunction method with the rest of the arguments.
   *
   * @param {string} name Name of the scheme.
   * @param {string|!Array<string>} groups A group name or list of group
   *     names the scheme belongs to.
   * @param {palette.ColorFunction} func A colour generator function.
   * @param {boolean=} opt_is_cbf Whether palette generate with the function
   *     is colour-blind friendly.
   * @param {boolean=} opt_cyclic Whether colour at 0.0 is the same as the
   *     one at 1.0.
   * @return {!palette.SchemeType} A colour palette generator function, which
   *     in addition has methods and properties like a regular object.  Think
   *     of it as a callable object.
   */
  palette.Scheme.withColorFunction = function(name, groups,
                                              func, opt_is_cbf, opt_cyclic) {
    var scheme = palette.Scheme(name, groups);
    scheme.setColorFunction.apply(scheme, slice(arguments, 2));
    return scheme;
  };


  /**
   * A map of registered schemes.  Maps a scheme or group name to a list of
   * scheme objects.  Property name is either 'n-<name>' for single scheme
   * names or 'g-<name>' for scheme group names.
   *
   * @type {!Object<string, !Array<!Object>>}
   */
  var registered_schemes = {};


  /**
   * Registers a new colour scheme.
   *
   * @param {!palette.SchemeType} scheme The scheme to add.
   */
  palette.register = function(scheme) {
    registered_schemes['n-' + scheme.scheme_name] = [scheme];
    scheme.groups.forEach(function(g) {
      (registered_schemes['g-' + g] =
       registered_schemes['g-' + g] || []).push(scheme);
    });
    (registered_schemes['g-all'] =
       registered_schemes['g-all'] || []).push(scheme);
  };


  /**
   * List all schemes that match given name and number of colours.
   *
   * name argument can be either a string or an array of strings.  In the
   * former case, the function acts as if the argument was an array with name
   * as a single argument (i.e. “palette.listSchemes('foo')” is exactly the same
   * as “palette.listSchemes(['foo'])”).
   *
   * Each name can be either name of a palette (e.g. 'tol-sq' for Paul Tol's
   * sequential palette), or a name of a group (e.g. 'sequential' for all
   * sequential palettes).  Name can therefore map to a single scheme or
   * several schemes.
   *
   * Furthermore, name can be suffixed with '-cbf' to indicate that only
   * schemes that are colourblind friendly should be returned.  For example,
   * 'rainbow' returns a HSV rainbow scheme, but because it is not colourblind
   * friendly, 'rainbow-cbf' returns no schemes.
   *
   * Some schemes may produce colourblind friendly palettes for some number of
   * colours.  For example ColorBrewer's Dark2 scheme is colourblind friendly
   * if no more than 3 colours are generated.  If opt_number is not specified,
   * 'qualitative-cbf' will include 'cb-Dark2' but if opt_number is given as,
   * say, 5 it won't.
   *
   * Name can also be 'all' which will return all registered schemes.
   * Naturally, 'all-cbf' will return all colourblind friendly schemes.
   *
   * Schemes are added to the library using palette.register.  Schemes are
   * created using palette.Scheme function.  By default, the following schemes
   * are available:
   *
   *     Name            Description
   *     --------------  -----------------------------------------------------
   *     tol             Paul Tol's qualitative scheme, cbf, max 12 colours.
   *     tol-dv          Paul Tol's diverging scheme, cbf.
   *     tol-sq          Paul Tol's sequential scheme, cbf.
   *     tol-rainbow     Paul Tol's qualitative scheme, cbf.
   *
   *     rainbow         A rainbow palette.
   *
   *     cb-YlGn         ColorBrewer sequential schemes.
   *     cb-YlGnBu
   *     cb-GnBu
   *     cb-BuGn
   *     cb-PuBuGn
   *     cb-PuBu
   *     cb-BuPu
   *     cb-RdPu
   *     cb-PuRd
   *     cb-OrRd
   *     cb-YlOrRd
   *     cb-YlOrBr
   *     cb-Purples
   *     cb-Blues
   *     cb-Greens
   *     cb-Oranges
   *     cb-Reds
   *     cb-Greys
   *
   *     cb-PuOr         ColorBrewer diverging schemes.
   *     cb-BrBG
   *     cb-PRGn
   *     cb-PiYG
   *     cb-RdBu
   *     cb-RdGy
   *     cb-RdYlBu
   *     cb-Spectral
   *     cb-RdYlGn
   *
   *     cb-Accent       ColorBrewer qualitative schemes.
   *     cb-Dark2
   *     cb-Paired
   *     cb-Pastel1
   *     cb-Pastel2
   *     cb-Set1
   *     cb-Set2
   *     cb-Set3
   *
   *     sol-base        Solarized base colours.
   *     sol-accent      Solarized accent colours.
   *
   * The following groups are also available by default:
   *
   *     Name            Description
   *     --------------  -----------------------------------------------------
   *     all             All registered schemes.
   *     sequential      All sequential schemes.
   *     diverging       All diverging schemes.
   *     qualitative     All qualitative schemes.
   *     cb-sequential   All ColorBrewer sequential schemes.
   *     cb-diverging    All ColorBrewer diverging schemes.
   *     cb-qualitative  All ColorBrewer qualitative schemes.
   *
   * You can read more about Paul Tol's palettes at http://www.sron.nl/~pault/.
   * You can read more about ColorBrewer at http://colorbrewer2.org.
   *
   * @param {string|!Array<string>} name A name of a colour scheme, of
   *     a group of colour schemes, or an array of any of those.
   * @param {number=} opt_number When requesting only colourblind friendly
   *     schemes, number of colours the scheme must provide generating such
   *     that the palette is still colourblind friendly.  2 by default.
   * @return {!Array<!palette.SchemeType>} An array of colour scheme objects
   *     matching the criteria.  Sorted by scheme name.
   */
  palette.listSchemes = function(name, opt_number) {
    if (!opt_number) {
      opt_number = 2;
    } else if (opt_number < 0) {
      opt_number = -opt_number;
    }

    var ret = [];
    (typeof name === 'string' ? [name] : name).forEach(function(n) {
      var cbf = n.substring(n.length - 4) === '-cbf';
      if (cbf) {
        n = n.substring(0, n.length - 4);
      }
      var schemes =
          registered_schemes['g-' + n] ||
          registered_schemes['n-' + n] ||
          [];
      for (var i = 0, scheme; (scheme = schemes[i]); ++i) {
        if ((cbf ? scheme.cbf : scheme.max) >= opt_number) {
          ret.push(scheme);
        }
      }
    });

    ret.sort(function(a, b) {
      return a.scheme_name >= b.scheme_name ?
        a.scheme_name > b.scheme_name ? 1 : 0 : -1;
    });
    return ret;
  };


  /**
   * Generates a palette using given colour generating function.
   *
   * The color_func callback must accept a singe number argument whose value
   * can vary from 0.0 to 1.0 (or in general from opt_start to opt_end), and
   * return a colour as an 'RRGGBB' string.  This function will be used when
   * generating palettes, i.e. if 11-colour palette is requested, this
   * function will be called with arguments 0.0, 0.1, …, 1.0.
   *
   * In some cases, it is not desirable to reach 1.0 when generating
   * a palette.  This happens for hue-rainbows where the 0–1 range corresponds
   * to a 0°–360° range in hues, and since hue at 0° is the same as at 360°,
   * it's desired to stop short the end of the range when generating
   * a palette.  To accomplish this, opt_cyclic should be set to true.
   *
   * opt_start and opt_end may be used to change the range the colour
   * generation function is called with.  opt_end may be less than opt_start
   * which will case to traverse the range in reverse.  Another way to reverse
   * the palette is requesting negative number of colours.  The two methods do
   * not always lead to the same results (especially if opt_cyclic is set).
   *
   * @param {palette.ColorFunction} color_func A colours generating callback
   *     function.
   * @param {number} number Number of colours to generate in the palette.  If
   *     number is negative, colours in the palette will be reversed.  If only
   *     one colour is requested, colour at opt_start will be returned.
   * @param {number=} opt_start Optional starting point for the palette
   *     generation function.  Zero by default.
   * @param {number=} opt_end Optional ending point for the palette generation
   *     function.  One by default.
   * @param {boolean=} opt_cyclic If true, function will assume colour at
   *     point opt_start is the same as one at opt_end.
   * @return {palette.Palette} An array of 'RRGGBB' colours.
   */
  palette.generate = function(color_func, number, opt_start, opt_end,
                              opt_cyclic) {
    if (Math.abs(number) < 1) {
      return [];
    }

    opt_start = opt_start === void(0) ? 0 : opt_start;
    opt_end = opt_end === void(0) ? 1 : opt_end;

    if (Math.abs(number) < 2) {
      return [color_func(opt_start)];
    }

    var i = Math.abs(number);
    var x = opt_start;
    var ret = [];
    var step = (opt_end - opt_start) / (opt_cyclic ? i : (i - 1));

    for (; --i >= 0; x += step) {
      ret.push(color_func(x));
    }
    if (number < 0) {
      ret.reverse();
    }
    return ret;
  };


  /**
   * Clamps value to [0, 1] range.
   * @param {number} v Number to limit value of.
   * @return {number} If v is inside of [0, 1] range returns v, otherwise
   *     returns 0 or 1 depending which side of the range v is closer to.
   */
  var clamp = function(v) {
    return v > 0 ? (v < 1 ? v : 1) : 0;
  };

  /**
   * Converts r, g, b triple into RRGGBB hex representation.
   * @param {number} r Red value of the colour in the range [0, 1].
   * @param {number} g Green value of the colour in the range [0, 1].
   * @param {number} b Blue value of the colour in the range [0, 1].
   * @return {string} A lower-case RRGGBB representation of the colour.
   */
  palette.rgbColor = function(r, g, b) {
    return [r, g, b].map(function(v) {
      v = Number(Math.round(clamp(v) * 255)).toString(16);
      return v.length == 1 ? '0' + v : v;
    }).join('');
  };

  /**
   * Converts a linear r, g, b triple into RRGGBB hex representation.
   * @param {number} r Linear red value of the colour in the range [0, 1].
   * @param {number} g Linear green value of the colour in the range [0, 1].
   * @param {number} b Linear blue value of the colour in the range [0, 1].
   * @return {string} A lower-case RRGGBB representation of the colour.
   */
  palette.linearRgbColor = function(r, g, b) {
    // http://www.brucelindbloom.com/index.html?Eqn_XYZ_to_RGB.html
    return [r, g, b].map(function(v) {
      v = clamp(v);
      if (v <= 0.0031308) {
        v = 12.92 * v;
      } else {
        v = 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
      }
      v = Number(Math.round(v * 255)).toString(16);
      return v.length == 1 ? '0' + v : v;
    }).join('');
  };

  /**
   * Converts an HSV colours to RRGGBB hex representation.
   * @param {number} h Hue in the range [0, 1].
   * @param {number=} opt_s Saturation in the range [0, 1].  One by default.
   * @param {number=} opt_v Value in the range [0, 1].  One by default.
   * @return {string} An RRGGBB representation of the colour.
   */
  palette.hsvColor = function(h, opt_s, opt_v) {
    h *= 6;
    var s = opt_s === void(0) ? 1 : clamp(opt_s);
    var v = opt_v === void(0) ? 1 : clamp(opt_v);
    var x = v * (1 - s * Math.abs(h % 2 - 1));
    var m = v * (1 - s);
    switch (Math.floor(h) % 6) {
    case 0: return palette.rgbColor(v, x, m);
    case 1: return palette.rgbColor(x, v, m);
    case 2: return palette.rgbColor(m, v, x);
    case 3: return palette.rgbColor(m, x, v);
    case 4: return palette.rgbColor(x, m, v);
    default: return palette.rgbColor(v, m, x);
    }
  };

  palette.register(palette.Scheme.withColorFunction(
    'rainbow', 'qualitative', palette.hsvColor, false, true));

  return palette;
})();


/** @typedef {function(number): string} */
palette.ColorFunction;

/** @typedef {!Array<string>} */
palette.Palette;

/** @typedef {!Object<number, palette.Palette>|!Array<palette.Palette>} */
palette.PalettesList;

/**
 * @typedef {
 *   function(number, ...?): Array<string>|
 *   {
 *     scheme_name: string,
 *     groups: !Array<string>,
 *     max: number,
 *     cbf_max: number,
 *     addPalette: function(!Array<string>, boolean=),
 *     addPalettes: function(palette.PalettesList, number=, number=),
 *     shrinkByTakingHead: function(boolean, number=),
 *     setColorFunction: function(palette.ColorFunction, boolean=, boolean=),
 *     color: function(number, ...?): ?string}}
 */
palette.SchemeType;


/* Paul Tol's schemes start here. *******************************************/
/* See http://www.sron.nl/~pault/ */

(function() {
  var rgb = palette.rgbColor;

  /**
   * Calculates value of a polynomial at given point.
   * For example, poly(x, 1, 2, 3) calculates value of “1 + 2*x + 2*X^2”.
   * @param {number} x Value to calculate polynomial for.
   * @param {...number} varargs Coefficients of the polynomial specified in
   *     the order of rising powers of x including constant as the first
   *     variable argument.
   */
  var poly = function(x, varargs) {
    var i = arguments.length - 1, n = arguments[i];
    while (i > 1) {
      n = n * x + arguments[--i];
    }
    return n;
  };

  /**
   * Calculate approximate value of error function with maximum error of 0.0005.
   * See <https://en.wikipedia.org/wiki/Error_function>.
   * @param {number} x Argument of the error function.
   * @return {number} Value of error function for x.
   */
  var erf = function(x) {
    // https://en.wikipedia.org/wiki/Error_function#Approximation_with_elementary_functions
    // This produces a maximum error of 0.0005 which is more then we need.  In
    // the worst case, that error is multiplied by four and then divided by two
    // before being multiplied by 255, so in the end, the error is multiplied by
    // 510 which produces 0.255 which is less than a single colour step.
    var y = poly(Math.abs(x), 1, 0.278393, 0.230389, 0.000972, 0.078108);
    y *= y; // y^2
    y *= y; // y^4
    y = 1 - 1 / y;
    return x < 0 ? -y : y;
  };

  palette.register(palette.Scheme.fromPalettes('tol', 'qualitative', [
    ['4477aa'],
    ['4477aa', 'cc6677'],
    ['4477aa', 'ddcc77', 'cc6677'],
    ['4477aa', '117733', 'ddcc77', 'cc6677'],
    ['332288', '88ccee', '117733', 'ddcc77', 'cc6677'],
    ['332288', '88ccee', '117733', 'ddcc77', 'cc6677', 'aa4499'],
    ['332288', '88ccee', '44aa99', '117733', 'ddcc77', 'cc6677', 'aa4499'],
    ['332288', '88ccee', '44aa99', '117733', '999933', 'ddcc77', 'cc6677',
     'aa4499'],
    ['332288', '88ccee', '44aa99', '117733', '999933', 'ddcc77', 'cc6677',
     '882255', 'aa4499'],
    ['332288', '88ccee', '44aa99', '117733', '999933', 'ddcc77', '661100',
     'cc6677', '882255', 'aa4499'],
    ['332288', '6699cc', '88ccee', '44aa99', '117733', '999933', 'ddcc77',
     '661100', 'cc6677', '882255', 'aa4499'],
    ['332288', '6699cc', '88ccee', '44aa99', '117733', '999933', 'ddcc77',
     '661100', 'cc6677', 'aa4466', '882255', 'aa4499']
  ], 12, 12));

  /**
   * Calculates a colour along Paul Tol's sequential colours axis.
   * See <http://www.sron.nl/~pault/colourschemes.pdf> figure 7 and equation 1.
   * @param {number} x Position of the colour on the axis in the [0, 1] range.
   * @return {string} An RRGGBB representation of the colour.
   */
  palette.tolSequentialColor = function(x) {
    return rgb(1 - 0.392 * (1 + erf((x - 0.869) / 0.255)),
               1.021 - 0.456 * (1 + erf((x - 0.527) / 0.376)),
               1 - 0.493 * (1 + erf((x - 0.272) / 0.309)));
  };

  palette.register(palette.Scheme.withColorFunction(
    'tol-sq', 'sequential', palette.tolSequentialColor, true));

  /**
   * Calculates a colour along Paul Tol's diverging colours axis.
   * See <http://www.sron.nl/~pault/colourschemes.pdf> figure 8 and equation 2.
   * @param {number} x Position of the colour on the axis in the [0, 1] range.
   * @return {string} An RRGGBB representation of the colour.
   */
  palette.tolDivergingColor = function(x) {
    var g = poly(x, 0.572, 1.524, -1.811) / poly(x, 1, -0.291, 0.1574);
    return rgb(poly(x, 0.235, -2.13, 26.92, -65.5, 63.5, -22.36),
               g * g,
               1 / poly(x, 1.579, -4.03, 12.92, -31.4, 48.6, -23.36));
  };

  palette.register(palette.Scheme.withColorFunction(
    'tol-dv', 'diverging', palette.tolDivergingColor, true));

  /**
   * Calculates a colour along Paul Tol's rainbow colours axis.
   * See <http://www.sron.nl/~pault/colourschemes.pdf> figure 13 and equation 3.
   * @param {number} x Position of the colour on the axis in the [0, 1] range.
   * @return {string} An RRGGBB representation of the colour.
   */
  palette.tolRainbowColor = function(x) {
    return rgb(poly(x, 0.472, -0.567, 4.05) / poly(x, 1, 8.72, -19.17, 14.1),
               poly(x, 0.108932, -1.22635, 27.284, -98.577, 163.3, -131.395,
                    40.634),
               1 / poly(x, 1.97, 3.54, -68.5, 243, -297, 125));
  };

  palette.register(palette.Scheme.withColorFunction(
    'tol-rainbow', 'qualitative', palette.tolRainbowColor, true));
})();


/* Solarized colour schemes start here. *************************************/
/* See http://ethanschoonover.com/solarized */

(function() {
  /*
   * Those are not really designed to be used in graphs, but we're keeping
   * them here in case someone cares.
   */
  palette.register(palette.Scheme.fromPalettes('sol-base', 'sequential', [
    ['002b36', '073642', '586e75', '657b83', '839496', '93a1a1', 'eee8d5',
     'fdf6e3']
  ], 1, 8));
  palette.register(palette.Scheme.fromPalettes('sol-accent', 'qualitative', [
    ['b58900', 'cb4b16', 'dc322f', 'd33682', '6c71c4', '268bd2', '2aa198',
     '859900']
  ]));
})();


/* ColorBrewer colour schemes start here. ***********************************/
/* See http://colorbrewer2.org/ */

(function() {
  var schemes = {
    YlGn: {
      type: 'sequential',
      cbf: 42,
      3: ['f7fcb9', 'addd8e', '31a354'],
      4: ['ffffcc', 'c2e699', '78c679', '238443'],
      5: ['ffffcc', 'c2e699', '78c679', '31a354', '006837'],
      6: ['ffffcc', 'd9f0a3', 'addd8e', '78c679', '31a354', '006837'],
      7: ['ffffcc', 'd9f0a3', 'addd8e', '78c679', '41ab5d', '238443',
          '005a32'],
      8: ['ffffe5', 'f7fcb9', 'd9f0a3', 'addd8e', '78c679', '41ab5d',
          '238443', '005a32'],
      9: ['ffffe5', 'f7fcb9', 'd9f0a3', 'addd8e', '78c679', '41ab5d',
          '238443', '006837', '004529']
    },
    YlGnBu: {
      type: 'sequential',
      cbf: 42,
      3: ['edf8b1', '7fcdbb', '2c7fb8'],
      4: ['ffffcc', 'a1dab4', '41b6c4', '225ea8'],
      5: ['ffffcc', 'a1dab4', '41b6c4', '2c7fb8', '253494'],
      6: ['ffffcc', 'c7e9b4', '7fcdbb', '41b6c4', '2c7fb8', '253494'],
      7: ['ffffcc', 'c7e9b4', '7fcdbb', '41b6c4', '1d91c0', '225ea8',
          '0c2c84'],
      8: ['ffffd9', 'edf8b1', 'c7e9b4', '7fcdbb', '41b6c4', '1d91c0',
          '225ea8', '0c2c84'],
      9: ['ffffd9', 'edf8b1', 'c7e9b4', '7fcdbb', '41b6c4', '1d91c0',
          '225ea8', '253494', '081d58']
    },
    GnBu: {
      type: 'sequential',
      cbf: 42,
      3: ['e0f3db', 'a8ddb5', '43a2ca'],
      4: ['f0f9e8', 'bae4bc', '7bccc4', '2b8cbe'],
      5: ['f0f9e8', 'bae4bc', '7bccc4', '43a2ca', '0868ac'],
      6: ['f0f9e8', 'ccebc5', 'a8ddb5', '7bccc4', '43a2ca', '0868ac'],
      7: ['f0f9e8', 'ccebc5', 'a8ddb5', '7bccc4', '4eb3d3', '2b8cbe',
          '08589e'],
      8: ['f7fcf0', 'e0f3db', 'ccebc5', 'a8ddb5', '7bccc4', '4eb3d3',
          '2b8cbe', '08589e'],
      9: ['f7fcf0', 'e0f3db', 'ccebc5', 'a8ddb5', '7bccc4', '4eb3d3',
          '2b8cbe', '0868ac', '084081']
    },
    BuGn: {
      type: 'sequential',
      cbf: 42,
      3: ['e5f5f9', '99d8c9', '2ca25f'],
      4: ['edf8fb', 'b2e2e2', '66c2a4', '238b45'],
      5: ['edf8fb', 'b2e2e2', '66c2a4', '2ca25f', '006d2c'],
      6: ['edf8fb', 'ccece6', '99d8c9', '66c2a4', '2ca25f', '006d2c'],
      7: ['edf8fb', 'ccece6', '99d8c9', '66c2a4', '41ae76', '238b45',
          '005824'],
      8: ['f7fcfd', 'e5f5f9', 'ccece6', '99d8c9', '66c2a4', '41ae76',
          '238b45', '005824'],
      9: ['f7fcfd', 'e5f5f9', 'ccece6', '99d8c9', '66c2a4', '41ae76',
          '238b45', '006d2c', '00441b']
    },
    PuBuGn: {
      type: 'sequential',
      cbf: 42,
      3: ['ece2f0', 'a6bddb', '1c9099'],
      4: ['f6eff7', 'bdc9e1', '67a9cf', '02818a'],
      5: ['f6eff7', 'bdc9e1', '67a9cf', '1c9099', '016c59'],
      6: ['f6eff7', 'd0d1e6', 'a6bddb', '67a9cf', '1c9099', '016c59'],
      7: ['f6eff7', 'd0d1e6', 'a6bddb', '67a9cf', '3690c0', '02818a',
          '016450'],
      8: ['fff7fb', 'ece2f0', 'd0d1e6', 'a6bddb', '67a9cf', '3690c0',
          '02818a', '016450'],
      9: ['fff7fb', 'ece2f0', 'd0d1e6', 'a6bddb', '67a9cf', '3690c0',
          '02818a', '016c59', '014636']
    },
    PuBu: {
      type: 'sequential',
      cbf: 42,
      3: ['ece7f2', 'a6bddb', '2b8cbe'],
      4: ['f1eef6', 'bdc9e1', '74a9cf', '0570b0'],
      5: ['f1eef6', 'bdc9e1', '74a9cf', '2b8cbe', '045a8d'],
      6: ['f1eef6', 'd0d1e6', 'a6bddb', '74a9cf', '2b8cbe', '045a8d'],
      7: ['f1eef6', 'd0d1e6', 'a6bddb', '74a9cf', '3690c0', '0570b0',
          '034e7b'],
      8: ['fff7fb', 'ece7f2', 'd0d1e6', 'a6bddb', '74a9cf', '3690c0',
          '0570b0', '034e7b'],
      9: ['fff7fb', 'ece7f2', 'd0d1e6', 'a6bddb', '74a9cf', '3690c0',
          '0570b0', '045a8d', '023858']
    },
    BuPu: {
      type: 'sequential',
      cbf: 42,
      3: ['e0ecf4', '9ebcda', '8856a7'],
      4: ['edf8fb', 'b3cde3', '8c96c6', '88419d'],
      5: ['edf8fb', 'b3cde3', '8c96c6', '8856a7', '810f7c'],
      6: ['edf8fb', 'bfd3e6', '9ebcda', '8c96c6', '8856a7', '810f7c'],
      7: ['edf8fb', 'bfd3e6', '9ebcda', '8c96c6', '8c6bb1', '88419d',
          '6e016b'],
      8: ['f7fcfd', 'e0ecf4', 'bfd3e6', '9ebcda', '8c96c6', '8c6bb1',
          '88419d', '6e016b'],
      9: ['f7fcfd', 'e0ecf4', 'bfd3e6', '9ebcda', '8c96c6', '8c6bb1',
          '88419d', '810f7c', '4d004b']
    },
    RdPu: {
      type: 'sequential',
      cbf: 42,
      3: ['fde0dd', 'fa9fb5', 'c51b8a'],
      4: ['feebe2', 'fbb4b9', 'f768a1', 'ae017e'],
      5: ['feebe2', 'fbb4b9', 'f768a1', 'c51b8a', '7a0177'],
      6: ['feebe2', 'fcc5c0', 'fa9fb5', 'f768a1', 'c51b8a', '7a0177'],
      7: ['feebe2', 'fcc5c0', 'fa9fb5', 'f768a1', 'dd3497', 'ae017e',
          '7a0177'],
      8: ['fff7f3', 'fde0dd', 'fcc5c0', 'fa9fb5', 'f768a1', 'dd3497',
          'ae017e', '7a0177'],
      9: ['fff7f3', 'fde0dd', 'fcc5c0', 'fa9fb5', 'f768a1', 'dd3497',
          'ae017e', '7a0177', '49006a']
    },
    PuRd: {
      type: 'sequential',
      cbf: 42,
      3: ['e7e1ef', 'c994c7', 'dd1c77'],
      4: ['f1eef6', 'd7b5d8', 'df65b0', 'ce1256'],
      5: ['f1eef6', 'd7b5d8', 'df65b0', 'dd1c77', '980043'],
      6: ['f1eef6', 'd4b9da', 'c994c7', 'df65b0', 'dd1c77', '980043'],
      7: ['f1eef6', 'd4b9da', 'c994c7', 'df65b0', 'e7298a', 'ce1256',
          '91003f'],
      8: ['f7f4f9', 'e7e1ef', 'd4b9da', 'c994c7', 'df65b0', 'e7298a',
          'ce1256', '91003f'],
      9: ['f7f4f9', 'e7e1ef', 'd4b9da', 'c994c7', 'df65b0', 'e7298a',
          'ce1256', '980043', '67001f']
    },
    OrRd: {
      type: 'sequential',
      cbf: 42,
      3: ['fee8c8', 'fdbb84', 'e34a33'],
      4: ['fef0d9', 'fdcc8a', 'fc8d59', 'd7301f'],
      5: ['fef0d9', 'fdcc8a', 'fc8d59', 'e34a33', 'b30000'],
      6: ['fef0d9', 'fdd49e', 'fdbb84', 'fc8d59', 'e34a33', 'b30000'],
      7: ['fef0d9', 'fdd49e', 'fdbb84', 'fc8d59', 'ef6548', 'd7301f',
          '990000'],
      8: ['fff7ec', 'fee8c8', 'fdd49e', 'fdbb84', 'fc8d59', 'ef6548',
          'd7301f', '990000'],
      9: ['fff7ec', 'fee8c8', 'fdd49e', 'fdbb84', 'fc8d59', 'ef6548',
          'd7301f', 'b30000', '7f0000']
    },
    YlOrRd: {
      type: 'sequential',
      cbf: 42,
      3: ['ffeda0', 'feb24c', 'f03b20'],
      4: ['ffffb2', 'fecc5c', 'fd8d3c', 'e31a1c'],
      5: ['ffffb2', 'fecc5c', 'fd8d3c', 'f03b20', 'bd0026'],
      6: ['ffffb2', 'fed976', 'feb24c', 'fd8d3c', 'f03b20', 'bd0026'],
      7: ['ffffb2', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a', 'e31a1c',
          'b10026'],
      8: ['ffffcc', 'ffeda0', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a',
          'e31a1c', 'b10026'],
      9: ['ffffcc', 'ffeda0', 'fed976', 'feb24c', 'fd8d3c', 'fc4e2a',
          'e31a1c', 'bd0026', '800026']
    },
    YlOrBr: {
      type: 'sequential',
      cbf: 42,
      3: ['fff7bc', 'fec44f', 'd95f0e'],
      4: ['ffffd4', 'fed98e', 'fe9929', 'cc4c02'],
      5: ['ffffd4', 'fed98e', 'fe9929', 'd95f0e', '993404'],
      6: ['ffffd4', 'fee391', 'fec44f', 'fe9929', 'd95f0e', '993404'],
      7: ['ffffd4', 'fee391', 'fec44f', 'fe9929', 'ec7014', 'cc4c02',
          '8c2d04'],
      8: ['ffffe5', 'fff7bc', 'fee391', 'fec44f', 'fe9929', 'ec7014',
          'cc4c02', '8c2d04'],
      9: ['ffffe5', 'fff7bc', 'fee391', 'fec44f', 'fe9929', 'ec7014',
          'cc4c02', '993404', '662506']
    },
    Purples: {
      type: 'sequential',
      cbf: 42,
      3: ['efedf5', 'bcbddc', '756bb1'],
      4: ['f2f0f7', 'cbc9e2', '9e9ac8', '6a51a3'],
      5: ['f2f0f7', 'cbc9e2', '9e9ac8', '756bb1', '54278f'],
      6: ['f2f0f7', 'dadaeb', 'bcbddc', '9e9ac8', '756bb1', '54278f'],
      7: ['f2f0f7', 'dadaeb', 'bcbddc', '9e9ac8', '807dba', '6a51a3',
          '4a1486'],
      8: ['fcfbfd', 'efedf5', 'dadaeb', 'bcbddc', '9e9ac8', '807dba',
          '6a51a3', '4a1486'],
      9: ['fcfbfd', 'efedf5', 'dadaeb', 'bcbddc', '9e9ac8', '807dba',
          '6a51a3', '54278f', '3f007d']
    },
    Blues: {
      type: 'sequential',
      cbf: 42,
      3: ['deebf7', '9ecae1', '3182bd'],
      4: ['eff3ff', 'bdd7e7', '6baed6', '2171b5'],
      5: ['eff3ff', 'bdd7e7', '6baed6', '3182bd', '08519c'],
      6: ['eff3ff', 'c6dbef', '9ecae1', '6baed6', '3182bd', '08519c'],
      7: ['eff3ff', 'c6dbef', '9ecae1', '6baed6', '4292c6', '2171b5',
          '084594'],
      8: ['f7fbff', 'deebf7', 'c6dbef', '9ecae1', '6baed6', '4292c6',
          '2171b5', '084594'],
      9: ['f7fbff', 'deebf7', 'c6dbef', '9ecae1', '6baed6', '4292c6',
          '2171b5', '08519c', '08306b']
    },
    Greens: {
      type: 'sequential',
      cbf: 42,
      3: ['e5f5e0', 'a1d99b', '31a354'],
      4: ['edf8e9', 'bae4b3', '74c476', '238b45'],
      5: ['edf8e9', 'bae4b3', '74c476', '31a354', '006d2c'],
      6: ['edf8e9', 'c7e9c0', 'a1d99b', '74c476', '31a354', '006d2c'],
      7: ['edf8e9', 'c7e9c0', 'a1d99b', '74c476', '41ab5d', '238b45',
          '005a32'],
      8: ['f7fcf5', 'e5f5e0', 'c7e9c0', 'a1d99b', '74c476', '41ab5d',
          '238b45', '005a32'],
      9: ['f7fcf5', 'e5f5e0', 'c7e9c0', 'a1d99b', '74c476', '41ab5d',
          '238b45', '006d2c', '00441b']
    },
    Oranges: {
      type: 'sequential',
      cbf: 42,
      3: ['fee6ce', 'fdae6b', 'e6550d'],
      4: ['feedde', 'fdbe85', 'fd8d3c', 'd94701'],
      5: ['feedde', 'fdbe85', 'fd8d3c', 'e6550d', 'a63603'],
      6: ['feedde', 'fdd0a2', 'fdae6b', 'fd8d3c', 'e6550d', 'a63603'],
      7: ['feedde', 'fdd0a2', 'fdae6b', 'fd8d3c', 'f16913', 'd94801',
          '8c2d04'],
      8: ['fff5eb', 'fee6ce', 'fdd0a2', 'fdae6b', 'fd8d3c', 'f16913',
          'd94801', '8c2d04'],
      9: ['fff5eb', 'fee6ce', 'fdd0a2', 'fdae6b', 'fd8d3c', 'f16913',
          'd94801', 'a63603', '7f2704']
    },
    Reds: {
      type: 'sequential',
      cbf: 42,
      3: ['fee0d2', 'fc9272', 'de2d26'],
      4: ['fee5d9', 'fcae91', 'fb6a4a', 'cb181d'],
      5: ['fee5d9', 'fcae91', 'fb6a4a', 'de2d26', 'a50f15'],
      6: ['fee5d9', 'fcbba1', 'fc9272', 'fb6a4a', 'de2d26', 'a50f15'],
      7: ['fee5d9', 'fcbba1', 'fc9272', 'fb6a4a', 'ef3b2c', 'cb181d',
          '99000d'],
      8: ['fff5f0', 'fee0d2', 'fcbba1', 'fc9272', 'fb6a4a', 'ef3b2c',
          'cb181d', '99000d'],
      9: ['fff5f0', 'fee0d2', 'fcbba1', 'fc9272', 'fb6a4a', 'ef3b2c',
          'cb181d', 'a50f15', '67000d']
    },
    Greys: {
      type: 'sequential',
      cbf: 42,
      3: ['f0f0f0', 'bdbdbd', '636363'],
      4: ['f7f7f7', 'cccccc', '969696', '525252'],
      5: ['f7f7f7', 'cccccc', '969696', '636363', '252525'],
      6: ['f7f7f7', 'd9d9d9', 'bdbdbd', '969696', '636363', '252525'],
      7: ['f7f7f7', 'd9d9d9', 'bdbdbd', '969696', '737373', '525252',
          '252525'],
      8: ['ffffff', 'f0f0f0', 'd9d9d9', 'bdbdbd', '969696', '737373',
          '525252', '252525'],
      9: ['ffffff', 'f0f0f0', 'd9d9d9', 'bdbdbd', '969696', '737373',
          '525252', '252525', '000000']
    },
    PuOr: {
      type: 'diverging',
      cbf: 42,
      3: ['f1a340', 'f7f7f7', '998ec3'],
      4: ['e66101', 'fdb863', 'b2abd2', '5e3c99'],
      5: ['e66101', 'fdb863', 'f7f7f7', 'b2abd2', '5e3c99'],
      6: ['b35806', 'f1a340', 'fee0b6', 'd8daeb', '998ec3', '542788'],
      7: ['b35806', 'f1a340', 'fee0b6', 'f7f7f7', 'd8daeb', '998ec3',
          '542788'],
      8: ['b35806', 'e08214', 'fdb863', 'fee0b6', 'd8daeb', 'b2abd2',
          '8073ac', '542788'],
      9: ['b35806', 'e08214', 'fdb863', 'fee0b6', 'f7f7f7', 'd8daeb',
          'b2abd2', '8073ac', '542788'],
      10: ['7f3b08', 'b35806', 'e08214', 'fdb863', 'fee0b6', 'd8daeb',
           'b2abd2', '8073ac', '542788', '2d004b'],
      11: ['7f3b08', 'b35806', 'e08214', 'fdb863', 'fee0b6', 'f7f7f7',
           'd8daeb', 'b2abd2', '8073ac', '542788', '2d004b']
    },
    BrBG: {
      type: 'diverging',
      cbf: 42,
      3: ['d8b365', 'f5f5f5', '5ab4ac'],
      4: ['a6611a', 'dfc27d', '80cdc1', '018571'],
      5: ['a6611a', 'dfc27d', 'f5f5f5', '80cdc1', '018571'],
      6: ['8c510a', 'd8b365', 'f6e8c3', 'c7eae5', '5ab4ac', '01665e'],
      7: ['8c510a', 'd8b365', 'f6e8c3', 'f5f5f5', 'c7eae5', '5ab4ac',
          '01665e'],
      8: ['8c510a', 'bf812d', 'dfc27d', 'f6e8c3', 'c7eae5', '80cdc1',
          '35978f', '01665e'],
      9: ['8c510a', 'bf812d', 'dfc27d', 'f6e8c3', 'f5f5f5', 'c7eae5',
          '80cdc1', '35978f', '01665e'],
      10: ['543005', '8c510a', 'bf812d', 'dfc27d', 'f6e8c3', 'c7eae5',
           '80cdc1', '35978f', '01665e', '003c30'],
      11: ['543005', '8c510a', 'bf812d', 'dfc27d', 'f6e8c3', 'f5f5f5',
           'c7eae5', '80cdc1', '35978f', '01665e', '003c30']
    },
    PRGn: {
      type: 'diverging',
      cbf: 42,
      3: ['af8dc3', 'f7f7f7', '7fbf7b'],
      4: ['7b3294', 'c2a5cf', 'a6dba0', '008837'],
      5: ['7b3294', 'c2a5cf', 'f7f7f7', 'a6dba0', '008837'],
      6: ['762a83', 'af8dc3', 'e7d4e8', 'd9f0d3', '7fbf7b', '1b7837'],
      7: ['762a83', 'af8dc3', 'e7d4e8', 'f7f7f7', 'd9f0d3', '7fbf7b',
          '1b7837'],
      8: ['762a83', '9970ab', 'c2a5cf', 'e7d4e8', 'd9f0d3', 'a6dba0',
          '5aae61', '1b7837'],
      9: ['762a83', '9970ab', 'c2a5cf', 'e7d4e8', 'f7f7f7', 'd9f0d3',
          'a6dba0', '5aae61', '1b7837'],
      10: ['40004b', '762a83', '9970ab', 'c2a5cf', 'e7d4e8', 'd9f0d3',
           'a6dba0', '5aae61', '1b7837', '00441b'],
      11: ['40004b', '762a83', '9970ab', 'c2a5cf', 'e7d4e8', 'f7f7f7',
           'd9f0d3', 'a6dba0', '5aae61', '1b7837', '00441b']
    },
    PiYG: {
      type: 'diverging',
      cbf: 42,
      3: ['e9a3c9', 'f7f7f7', 'a1d76a'],
      4: ['d01c8b', 'f1b6da', 'b8e186', '4dac26'],
      5: ['d01c8b', 'f1b6da', 'f7f7f7', 'b8e186', '4dac26'],
      6: ['c51b7d', 'e9a3c9', 'fde0ef', 'e6f5d0', 'a1d76a', '4d9221'],
      7: ['c51b7d', 'e9a3c9', 'fde0ef', 'f7f7f7', 'e6f5d0', 'a1d76a',
          '4d9221'],
      8: ['c51b7d', 'de77ae', 'f1b6da', 'fde0ef', 'e6f5d0', 'b8e186',
          '7fbc41', '4d9221'],
      9: ['c51b7d', 'de77ae', 'f1b6da', 'fde0ef', 'f7f7f7', 'e6f5d0',
          'b8e186', '7fbc41', '4d9221'],
      10: ['8e0152', 'c51b7d', 'de77ae', 'f1b6da', 'fde0ef', 'e6f5d0',
           'b8e186', '7fbc41', '4d9221', '276419'],
      11: ['8e0152', 'c51b7d', 'de77ae', 'f1b6da', 'fde0ef', 'f7f7f7',
           'e6f5d0', 'b8e186', '7fbc41', '4d9221', '276419']
    },
    RdBu: {
      type: 'diverging',
      cbf: 42,
      3: ['ef8a62', 'f7f7f7', '67a9cf'],
      4: ['ca0020', 'f4a582', '92c5de', '0571b0'],
      5: ['ca0020', 'f4a582', 'f7f7f7', '92c5de', '0571b0'],
      6: ['b2182b', 'ef8a62', 'fddbc7', 'd1e5f0', '67a9cf', '2166ac'],
      7: ['b2182b', 'ef8a62', 'fddbc7', 'f7f7f7', 'd1e5f0', '67a9cf',
          '2166ac'],
      8: ['b2182b', 'd6604d', 'f4a582', 'fddbc7', 'd1e5f0', '92c5de',
          '4393c3', '2166ac'],
      9: ['b2182b', 'd6604d', 'f4a582', 'fddbc7', 'f7f7f7', 'd1e5f0',
          '92c5de', '4393c3', '2166ac'],
      10: ['67001f', 'b2182b', 'd6604d', 'f4a582', 'fddbc7', 'd1e5f0',
           '92c5de', '4393c3', '2166ac', '053061'],
      11: ['67001f', 'b2182b', 'd6604d', 'f4a582', 'fddbc7', 'f7f7f7',
           'd1e5f0', '92c5de', '4393c3', '2166ac', '053061']
    },
    RdGy: {
      type: 'diverging',
      cbf: 42,
      3: ['ef8a62', 'ffffff', '999999'],
      4: ['ca0020', 'f4a582', 'bababa', '404040'],
      5: ['ca0020', 'f4a582', 'ffffff', 'bababa', '404040'],
      6: ['b2182b', 'ef8a62', 'fddbc7', 'e0e0e0', '999999', '4d4d4d'],
      7: ['b2182b', 'ef8a62', 'fddbc7', 'ffffff', 'e0e0e0', '999999',
          '4d4d4d'],
      8: ['b2182b', 'd6604d', 'f4a582', 'fddbc7', 'e0e0e0', 'bababa',
          '878787', '4d4d4d'],
      9: ['b2182b', 'd6604d', 'f4a582', 'fddbc7', 'ffffff', 'e0e0e0',
          'bababa', '878787', '4d4d4d'],
      10: ['67001f', 'b2182b', 'd6604d', 'f4a582', 'fddbc7', 'e0e0e0',
           'bababa', '878787', '4d4d4d', '1a1a1a'],
      11: ['67001f', 'b2182b', 'd6604d', 'f4a582', 'fddbc7', 'ffffff',
           'e0e0e0', 'bababa', '878787', '4d4d4d', '1a1a1a']
    },
    RdYlBu: {
      type: 'diverging',
      cbf: 42,
      3: ['fc8d59', 'ffffbf', '91bfdb'],
      4: ['d7191c', 'fdae61', 'abd9e9', '2c7bb6'],
      5: ['d7191c', 'fdae61', 'ffffbf', 'abd9e9', '2c7bb6'],
      6: ['d73027', 'fc8d59', 'fee090', 'e0f3f8', '91bfdb', '4575b4'],
      7: ['d73027', 'fc8d59', 'fee090', 'ffffbf', 'e0f3f8', '91bfdb',
          '4575b4'],
      8: ['d73027', 'f46d43', 'fdae61', 'fee090', 'e0f3f8', 'abd9e9',
          '74add1', '4575b4'],
      9: ['d73027', 'f46d43', 'fdae61', 'fee090', 'ffffbf', 'e0f3f8',
          'abd9e9', '74add1', '4575b4'],
      10: ['a50026', 'd73027', 'f46d43', 'fdae61', 'fee090', 'e0f3f8',
           'abd9e9', '74add1', '4575b4', '313695'],
      11: ['a50026', 'd73027', 'f46d43', 'fdae61', 'fee090', 'ffffbf',
           'e0f3f8', 'abd9e9', '74add1', '4575b4', '313695']
    },
    Spectral: {
      type: 'diverging',
      cbf: 0,
      3: ['fc8d59', 'ffffbf', '99d594'],
      4: ['d7191c', 'fdae61', 'abdda4', '2b83ba'],
      5: ['d7191c', 'fdae61', 'ffffbf', 'abdda4', '2b83ba'],
      6: ['d53e4f', 'fc8d59', 'fee08b', 'e6f598', '99d594', '3288bd'],
      7: ['d53e4f', 'fc8d59', 'fee08b', 'ffffbf', 'e6f598', '99d594',
          '3288bd'],
      8: ['d53e4f', 'f46d43', 'fdae61', 'fee08b', 'e6f598', 'abdda4',
          '66c2a5', '3288bd'],
      9: ['d53e4f', 'f46d43', 'fdae61', 'fee08b', 'ffffbf', 'e6f598',
          'abdda4', '66c2a5', '3288bd'],
      10: ['9e0142', 'd53e4f', 'f46d43', 'fdae61', 'fee08b', 'e6f598',
           'abdda4', '66c2a5', '3288bd', '5e4fa2'],
      11: ['9e0142', 'd53e4f', 'f46d43', 'fdae61', 'fee08b', 'ffffbf',
           'e6f598', 'abdda4', '66c2a5', '3288bd', '5e4fa2']
    },
    RdYlGn: {
      type: 'diverging',
      cbf: 0,
      3: ['fc8d59', 'ffffbf', '91cf60'],
      4: ['d7191c', 'fdae61', 'a6d96a', '1a9641'],
      5: ['d7191c', 'fdae61', 'ffffbf', 'a6d96a', '1a9641'],
      6: ['d73027', 'fc8d59', 'fee08b', 'd9ef8b', '91cf60', '1a9850'],
      7: ['d73027', 'fc8d59', 'fee08b', 'ffffbf', 'd9ef8b', '91cf60',
          '1a9850'],
      8: ['d73027', 'f46d43', 'fdae61', 'fee08b', 'd9ef8b', 'a6d96a',
          '66bd63', '1a9850'],
      9: ['d73027', 'f46d43', 'fdae61', 'fee08b', 'ffffbf', 'd9ef8b',
          'a6d96a', '66bd63', '1a9850'],
      10: ['a50026', 'd73027', 'f46d43', 'fdae61', 'fee08b', 'd9ef8b',
           'a6d96a', '66bd63', '1a9850', '006837'],
      11: ['a50026', 'd73027', 'f46d43', 'fdae61', 'fee08b', 'ffffbf',
           'd9ef8b', 'a6d96a', '66bd63', '1a9850', '006837']
    },
    Accent: {
      type: 'qualitative',
      cbf: 0,
      3: ['7fc97f', 'beaed4', 'fdc086'],
      4: ['7fc97f', 'beaed4', 'fdc086', 'ffff99'],
      5: ['7fc97f', 'beaed4', 'fdc086', 'ffff99', '386cb0'],
      6: ['7fc97f', 'beaed4', 'fdc086', 'ffff99', '386cb0', 'f0027f'],
      7: ['7fc97f', 'beaed4', 'fdc086', 'ffff99', '386cb0', 'f0027f',
          'bf5b17'],
      8: ['7fc97f', 'beaed4', 'fdc086', 'ffff99', '386cb0', 'f0027f',
          'bf5b17', '666666']
    },
    Dark2: {
      type: 'qualitative',
      cbf: 3,
      3: ['1b9e77', 'd95f02', '7570b3'],
      4: ['1b9e77', 'd95f02', '7570b3', 'e7298a'],
      5: ['1b9e77', 'd95f02', '7570b3', 'e7298a', '66a61e'],
      6: ['1b9e77', 'd95f02', '7570b3', 'e7298a', '66a61e', 'e6ab02'],
      7: ['1b9e77', 'd95f02', '7570b3', 'e7298a', '66a61e', 'e6ab02',
          'a6761d'],
      8: ['1b9e77', 'd95f02', '7570b3', 'e7298a', '66a61e', 'e6ab02',
          'a6761d', '666666']
    },
    Paired: {
      type: 'qualitative',
      cbf: 4,
      3: ['a6cee3', '1f78b4', 'b2df8a'],
      4: ['a6cee3', '1f78b4', 'b2df8a', '33a02c'],
      5: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99'],
      6: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99', 'e31a1c'],
      7: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99', 'e31a1c',
          'fdbf6f'],
      8: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99', 'e31a1c',
          'fdbf6f', 'ff7f00'],
      9: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99', 'e31a1c',
          'fdbf6f', 'ff7f00', 'cab2d6'],
      10: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99', 'e31a1c',
           'fdbf6f', 'ff7f00', 'cab2d6', '6a3d9a'],
      11: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99', 'e31a1c',
           'fdbf6f', 'ff7f00', 'cab2d6', '6a3d9a', 'ffff99'],
      12: ['a6cee3', '1f78b4', 'b2df8a', '33a02c', 'fb9a99', 'e31a1c',
           'fdbf6f', 'ff7f00', 'cab2d6', '6a3d9a', 'ffff99', 'b15928']
    },
    Pastel1: {
      type: 'qualitative',
      cbf: 0,
      3: ['fbb4ae', 'b3cde3', 'ccebc5'],
      4: ['fbb4ae', 'b3cde3', 'ccebc5', 'decbe4'],
      5: ['fbb4ae', 'b3cde3', 'ccebc5', 'decbe4', 'fed9a6'],
      6: ['fbb4ae', 'b3cde3', 'ccebc5', 'decbe4', 'fed9a6', 'ffffcc'],
      7: ['fbb4ae', 'b3cde3', 'ccebc5', 'decbe4', 'fed9a6', 'ffffcc',
          'e5d8bd'],
      8: ['fbb4ae', 'b3cde3', 'ccebc5', 'decbe4', 'fed9a6', 'ffffcc',
          'e5d8bd', 'fddaec'],
      9: ['fbb4ae', 'b3cde3', 'ccebc5', 'decbe4', 'fed9a6', 'ffffcc',
          'e5d8bd', 'fddaec', 'f2f2f2']
    },
    Pastel2: {
      type: 'qualitative',
      cbf: 0,
      3: ['b3e2cd', 'fdcdac', 'cbd5e8'],
      4: ['b3e2cd', 'fdcdac', 'cbd5e8', 'f4cae4'],
      5: ['b3e2cd', 'fdcdac', 'cbd5e8', 'f4cae4', 'e6f5c9'],
      6: ['b3e2cd', 'fdcdac', 'cbd5e8', 'f4cae4', 'e6f5c9', 'fff2ae'],
      7: ['b3e2cd', 'fdcdac', 'cbd5e8', 'f4cae4', 'e6f5c9', 'fff2ae',
          'f1e2cc'],
      8: ['b3e2cd', 'fdcdac', 'cbd5e8', 'f4cae4', 'e6f5c9', 'fff2ae',
          'f1e2cc', 'cccccc']
    },
    Set1: {
      type: 'qualitative',
      cbf: 0,
      3: ['e41a1c', '377eb8', '4daf4a'],
      4: ['e41a1c', '377eb8', '4daf4a', '984ea3'],
      5: ['e41a1c', '377eb8', '4daf4a', '984ea3', 'ff7f00'],
      6: ['e41a1c', '377eb8', '4daf4a', '984ea3', 'ff7f00', 'ffff33'],
      7: ['e41a1c', '377eb8', '4daf4a', '984ea3', 'ff7f00', 'ffff33',
          'a65628'],
      8: ['e41a1c', '377eb8', '4daf4a', '984ea3', 'ff7f00', 'ffff33',
          'a65628', 'f781bf'],
      9: ['e41a1c', '377eb8', '4daf4a', '984ea3', 'ff7f00', 'ffff33',
          'a65628', 'f781bf', '999999']
    },
    Set2: {
      type: 'qualitative',
      cbf: 3,
      3: ['66c2a5', 'fc8d62', '8da0cb'],
      4: ['66c2a5', 'fc8d62', '8da0cb', 'e78ac3'],
      5: ['66c2a5', 'fc8d62', '8da0cb', 'e78ac3', 'a6d854'],
      6: ['66c2a5', 'fc8d62', '8da0cb', 'e78ac3', 'a6d854', 'ffd92f'],
      7: ['66c2a5', 'fc8d62', '8da0cb', 'e78ac3', 'a6d854', 'ffd92f',
          'e5c494'],
      8: ['66c2a5', 'fc8d62', '8da0cb', 'e78ac3', 'a6d854', 'ffd92f',
          'e5c494', 'b3b3b3']
    },
    Set3: {
      type: 'qualitative',
      cbf: 0,
      3: ['8dd3c7', 'ffffb3', 'bebada'],
      4: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072'],
      5: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3'],
      6: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3', 'fdb462'],
      7: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3', 'fdb462',
          'b3de69'],
      8: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3', 'fdb462',
          'b3de69', 'fccde5'],
      9: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3', 'fdb462',
          'b3de69', 'fccde5', 'd9d9d9'],
      10: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3', 'fdb462',
           'b3de69', 'fccde5', 'd9d9d9', 'bc80bd'],
      11: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3', 'fdb462',
           'b3de69', 'fccde5', 'd9d9d9', 'bc80bd', 'ccebc5'],
      12: ['8dd3c7', 'ffffb3', 'bebada', 'fb8072', '80b1d3', 'fdb462',
           'b3de69', 'fccde5', 'd9d9d9', 'bc80bd', 'ccebc5', 'ffed6f']
    }
  };

  for (var name in schemes) {
    var scheme = schemes[name];
    scheme = palette.Scheme.fromPalettes(
      'cb-' + name, [scheme.type, 'cb-' + scheme.type], scheme, 12, scheme.cbf);
    palette.register(scheme);
  }
})();
module.exports = palette;

});

(function( $ ){
  'use strict';

var element,
    callbacks = {},
    resultsTitle, 
    resultsDivID;

var methods = {
  setup   : function(options){
    element = this; // set element for build_containers()
    if (options.callbacks) callbacks = options.callbacks;
    
    if(options.resultsDivID){
    	
    	resultsDivID = options.resultsDivID;
    	
    }
    else
    {
    	resultsDivID = 'results';
    }

    if (options.url !== undefined)
      methods.process_from_url(options);
    else
      methods.process(options);
  },
  process : function(options){
    if (callbacks.beforePopulate) {
      callbacks.beforePopulate();
    };

    var self = methods;

    pivot.init(options);

    resultsTitle = options.resultsTitle;

    if (options.skipBuildContainers === undefined || options.skipBuildContainers === false) self.build_containers();

    self.populate_containers();

    $(document).on('change', '.row-labelable', function(event) {
      self.update_label_fields('row');
    });

    $(document).on('change', '.column-labelable', function(event) {
      self.update_label_fields('column');
    });

    $(document).on('change', '.summary', function(event) {
      self.update_summary_fields();
    });

    methods.update_results();

    if (callbacks.afterPopulate) {
      callbacks.afterPopulate();
    };
  },
  process_from_url : function(options){
    var re = /\.json$/i,
        dataType;

    if (re.test(options.url))
      dataType = 'text/json'
    else
      dataType = 'text/csv'

    $.ajax({
      url: options.url,
      dataType: "text",
      accepts: "text/csv",
      success: function(data, status){
        if (dataType === 'text/json')
          options['json'] = data
        else
          options['csv']  = data

        methods.process(options)
      }
    });
  },
  populate_containers: function(){
    methods.build_toggle_fields('#row-label-fields',     pivot.fields().rowLabelable,    'row-labelable');
    methods.build_toggle_fields('#column-label-fields',  pivot.fields().columnLabelable, 'column-labelable');
    methods.build_toggle_fields('#summary-fields',       pivot.fields().summarizable,    'summary');
    methods.build_filter_list();
  },
  reprocess_display : function(options){
    if (options.rowLabels     === undefined) options.rowLabels    = [];
    if (options.columnLabels  === undefined) options.columnLabels = [];
    if (options.summaries     === undefined) options.summaries    = [];
    if (options.filters       === undefined) options.filters      = {};
    if (options.callbacks     === undefined) options.callbacks    = {};

    if (options.callbacks.beforeReprocessDisplay) {
      options.callbacks.afterReprocessDisplay();
    }

    pivot.filters().set(options.filters);
    pivot.display().summaries().set(options.summaries);
    pivot.display().rowLabels().set(options.rowLabels);
    pivot.display().columnLabels().set(options.columnLabels);

    methods.populate_containers();
    methods.update_results();

    if (options.callbacks.afterReprocessDisplay) {
      options.callbacks.afterReprocessDisplay();
    }
  },
  build_containers : function(){

    var containers = '<div class="pivot_header_fields">' +
                     '  <div class="pivot_field">' +
                     '  <span class="pivot_header2">Filter Fields</span>' +
                     '   <div id="filter-list"></div>' +
                     '  </div>' +
                     '  <div class="pivot_field">' +
                     '  <span class="pivot_header2">Row Label Fields</span>' +
                     '   <div id="row-label-fields"></div>' +
                     '  </div>' +
                     '  <div class="pivot_field">' +
                     '  <span class="pivot_header2">Column Label Fields</span>' +
                     '   <div id="column-label-fields"></div>' +
                     '  </div>' +
                     '  <div class="pivot_field">' +
                     '  <span class="pivot_header2">Summary Fields</span>' +
                     '   <div id="summary-fields"></div>' +
                     '  </div>' +
                     '</div>';
    $(element).append(containers);
  },
  // Filters
  build_filter_list : function(){
    var select = '<select id="select-constructor">'
    select += '<option></option>'
    $.each(pivot.fields().filterable, function(index, field){
      select += '<option>' + field.name + '</option>';
    })
    select += '</select>'
    $('#filter-list').empty().append(select);

    // show pre-defined filters (from init)
    $.each(pivot.filters().all(), function(fieldName, restriction){
      methods.build_filter_field(fieldName, restriction);
    });

    // Bind build action to select-constructor explicitly
    $('#select-constructor').change(function(){
      methods.build_filter_field($(this).val());
    })
  },
  build_filter_field : function(fieldName, selectedValue) {
    var snip,
        remove_filter,
        field = pivot.fields().get(fieldName);

    if (fieldName === '') return;

    // Check to see if this field has already been built
    var filterExists = $('#filter-list select[data-field="' + field.name + '"]');
    if (filterExists.length) return;

    if (field.filterType === 'regexp')
      snip = methods.build_regexp_filter_field(field, selectedValue);
    else
      snip = methods.build_select_filter_field(field, selectedValue);

    remove_filter = '<a class="remove-filter-field" style="cursor:pointer;">(X)</a></label>';
    $('#filter-list').append('<div><hr/><label>' + field.name + remove_filter + snip + '</div>');

    //Optional Chosen/Select2 integration
    if($.fn.chosen!==undefined) $('select.filter').chosen();
    else if($.fn.select2!==undefined) $('select.filter').select2();

    // Update field listeners
    $('select.filter').on('change', function(event) {
      methods.update_filtered_rows();
    });

    $('input[type=text].filter').on('keyup', function(event) {
      var filterInput = this,
          eventValue  = $(filterInput).val();

      setTimeout(function(){ if ($(filterInput).val() === eventValue) methods.update_filtered_rows()}, 500);
    });

    // remove_filter listener
    $('.remove-filter-field').click(function(){
      $(this).parents('div').first().remove();
      methods.update_filtered_rows();
    })
  },
  build_select_filter_field : function(field, selectedValue){
    var snip  = '<select class="filter span3" '+(field.filterType==='multiselect'?'multiple':'')+' data-field="' + field.name + '">' +
                '<option></option>',
        orderedValues = [];

    for (var value in field.values){
      orderedValues.push(value);
    };

    orderedValues = orderedValues.sort();
    jQuery.each(orderedValues, function(index, value){
      var selected = "";
      if (value === selectedValue) selected = 'selected="selected"';
      snip += '<option value="' + value + '" ' + selected + '>' + field.values[value].displayValue + '</option>';
    });
    snip += '</select>'

    return snip;
  },
  build_regexp_filter_field : function(field, value){
    if (value === undefined) value = "";
    return '<input type="text" class="filter span3" data-field="' + field.name + '" value="' + value + '">';
  },
  update_filtered_rows :  function(){
    var restrictions = {}, field;

    $('.filter').each(function(index){
      field = pivot.fields().get($(this).attr('data-field'));

      if (field) {
        if ($(this).val() !== null && $(this).val()[0] !== ''){
          if (field.filterType === 'regexp')
            restrictions[$(this).attr('data-field')] = new RegExp($(this).val(),'i');
          else
            restrictions[$(this).attr('data-field')] = $(this).val();
        }
      }
    });
    pivot.filters().set(restrictions);
    methods.update_results();
  },

  //toggles

  build_toggle_fields : function(div, fields, klass){
    $(div).empty();
    $.each(fields, function(index, field){
      $(div).append('<label class="checkbox">' +
                    '<input type="checkbox" class="' + klass + '" ' +
                      'data-field="' + field.name + '" ' +
                    '> ' + field.name +
                    '</label>');
    });

    var displayFields;
    if (klass === 'row-labelable')
      displayFields = pivot.display().rowLabels().get
    else if (klass === 'column-labelable')
      displayFields = pivot.display().columnLabels().get
    else
      displayFields = pivot.display().summaries().get

    for (var fieldName in displayFields) {
      var elem = $(div + ' input[data-field="' + fieldName +'"]');
      elem.prop("checked", true);
      methods.orderChecked(div, elem);
    };

    // order listener
    $(div + ' input').on("click", function(){
      if (this.checked) {
        methods.orderChecked(div, this);
      } else {
        var field = $(this).parent().detach()[0];
        $(div).append( field );
      };
    });
  },
  orderChecked : function(parent, elem){
    var last_checked = $(parent + ' input:checked');     // last changed field (lcf)
    var field        = $(elem).parent().detach()[0]; // pluck item from div
    var children     = $(parent).children();

    //subtract 1 because clicked field is already checked insert plucked item into div at index
    if ((last_checked.length-1) === 0)
      $(parent).prepend( field );
    else if (children.length < last_checked.length)
      $(parent).append( field );
    else
      $(children[last_checked.length-1]).before( field );
  },
  update_result_details : function(){
    var snip = '';
    var filters = '';
    $.each(pivot.filters().all(), function(k,v) {
      filters += '<em>' + k + '</em>' + " => " + v + " "
    });

    if ($('#pivot-detail').length !== 0)
      snip += '<b>Filters:</b> '    + filters + "<br/>"
      $('#pivot-detail').html(snip);
  },
  update_results : function(){
    if (callbacks && callbacks.beforeUpdateResults) {
      callbacks.beforeUpdateResults();
    };

    var results = pivot.results().all(),
        config  = pivot.config(),
        columns = pivot.results().columns(),
        snip    = '',
        fieldName;

    var result_table = $('#' + resultsDivID),
        result_rows;
    result_table.empty();

    snip += '<table id="pivot-table" class="table table-striped table-condensed"><thead>';

    // build columnLabel header row
    if (config.columnLabels.length > 0 && config.summaries.length > 1) {
      var summarySnip = '', summaryRow = '';
      $.each(config.summaries, function(index, fieldName){
        summarySnip += '<th>' + fieldName + '</th>';
      })

      snip += '<tr>'
      $.each(columns, function(index, column){
        switch (column.type){
          case 'row':
            snip += '<th rowspan="2">'+ column.fieldName + '</th>';
            break;
          case 'column':
            snip += '<th colspan="' + column.width + '">' + column.fieldName + '</th>';
            summaryRow += summarySnip
            break;
        }
      });
      snip += '</tr><tr>' + summaryRow + '</tr>';
    } else {
      snip += '<tr>'
      $.each(columns, function(index, column){
        if (column.type !== 'column' || config.summaries.length <= 1) {
          snip += '<th>' + column.fieldName + '</th>';
        } else {
          $.each(config.summaries, function(index, fieldName){
            snip += '<th>' + fieldName + '</th>';
          });
        }
      });
      snip += '</tr>'
    }
    snip += '</thead></tr><tbody id="result-rows"></tbody></table>';
    result_table.append(snip);

    result_rows = $('#result-rows');

    $.each(results,function(index, row){
      snip = '<tr>';
      $.each(columns, function(index, column){
        if (column.type !== 'column')
          snip += '<td>' + row[column.fieldName] + '</td>';
        else {
          $.each(config.summaries, function(index, fieldName){
            if (row[column.fieldName] !== undefined)
              snip += '<td>' + row[column.fieldName][fieldName] + '</td>';
            else
              snip += '<td>&nbsp;</td>';
          });
        }
      });
      snip += '</tr>';

      result_rows.append(snip);
    });
    methods.update_result_details();

    if (callbacks && callbacks.afterUpdateResults) {
      callbacks.afterUpdateResults();
    };
  },
  update_label_fields :  function(type){
    var display_fields = [];

    $('.' + type + '-labelable:checked').each(function(index){
        display_fields.push($(this).attr('data-field'));
    });

    pivot.display()[type + 'Labels']().set(display_fields);

    methods.update_results();
  },
  update_summary_fields : function(){
    var summary_fields = [];

    $('.summary:checked').each(function(index){
        summary_fields.push($(this).attr('data-field'));
    });

    pivot.display().summaries().set(summary_fields);

    methods.update_results();
  }
};

  $.fn.pivot_display = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + '  doesn\'t exists');
    }
  };

})( jQuery );

define("scripts/vendors/pivot/jquery_pivot.js", [],function(){});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container body\">\n        <div class=\"main_container\">\n            <!-- main content -->\n            <router-view></router-view>\n            <!-- /main-content -->\n\n            <!-- tsite footer -->\n            <compose view-model=\"./pages/page-elements/site-footer\"></compose>\n            <!-- /site footer -->\n        </div>\n    </div>\n    <load-spinner></load-spinner>\n</template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template>\n\t<!-- Header -->\n    <header>\n        <div class=\"container sub-header\">\n            <div class=\"row\">\n                <div class=\"col-lg-12\">\n                    <div class=\"intro-text\">\n                        <span class=\"name\">Whoops, nothing here!</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </header>\n\n  \t<section class=\"container text-center\">\n    \t<h1>Something is broken…</h1>\n    \t<p>The page cannot be found.</p>\n  \t</section>\n</template>\n"; });
define('text!pages/page-elements/sidebar-menu.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\r\n          <div class=\"col-md-3 left_col\">\r\n          <div class=\"left_col scroll-view\">\r\n            <div class=\"navbar nav_title\" style=\"border: 0;\">\r\n              <a href=\"/\" class=\"site_title\"><span>Market View!</span></a>\r\n            </div>\r\n            <div class=\"clearfix\"></div>\r\n\r\n            <br />\r\n  \r\n            <!-- sidebar menu -->\r\n            <div id=\"sidebar-menu\" class=\"main_menu_side hidden-print main_menu\">\r\n              <div class=\"menu_section active\">\r\n                  <ul class=\"nav side-menu\" style=\"\">\r\n                      <li><a id=\"dataModelli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-database\"></i> Market View <span class=\"fa fa-chevron-down\"></span></a>\r\n                      </li>\r\n                  </ul>\r\n              </div>\r\n            </div>\r\n            <!-- /sidebar menu -->\r\n              \r\n          </div>\r\n        </div>\r\n</template>"; });
define('text!pages/page-elements/site-footer.html', ['module'], function(module) { module.exports = "<template>  \r\n  <!-- footer content -->\r\n        <footer>\r\n          <div class=\"pull-right\">\r\n            Gentelella - Bootstrap Admin Template by <a href=\"https://colorlib.com\">Colorlib</a>\r\n          </div>\r\n          <div class=\"clearfix\"></div>\r\n        </footer>\r\n        <!-- /footer content -->\r\n</template>"; });
define('text!less/freelancer.css', ['module'], function(module) { module.exports = "body {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  overflow-x: hidden;\n}\np {\n  font-size: 20px;\n}\np.small {\n  font-size: 16px;\n}\na,\na:hover,\na:focus,\na:active,\na.active {\n  color: #18BC9C;\n  outline: none;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n}\n/************Handshake Dividers************/\nhr.hs-light,\nhr.hs-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.hs-light:after,\nhr.hs-primary:after {\n  content: \"\\f2b5\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.hs-light {\n  border-color: white;\n}\nhr.hs-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.hs-primary {\n  border-color: #2C3E50;\n}\nhr.hs-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Handshake Dividers************/\n/************Star Dividers************/\nhr.star-light,\nhr.star-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.star-light:after,\nhr.star-primary:after {\n  content: \"\\f005\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.star-light {\n  border-color: white;\n}\nhr.star-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.star-primary {\n  border-color: #2C3E50;\n}\nhr.star-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Star Dividers************/\n.img-centered {\n  margin: 0 auto;\n}\nheader {\n  text-align: center;\n  background: #18BC9C;\n  color: white;\n}\nheader .container {\n  padding-top: 100px;\n  padding-bottom: 50px;\n}\nheader .container.sub-header {\n  padding-top: 125px;\n  padding-bottom: 25px;\n}\nheader img {\n  display: block;\n  margin: 0 auto 20px;\n}\nheader .intro-text .name {\n  display: block;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  font-size: 2em;\n}\nheader .intro-text .skills {\n  font-size: 1.25em;\n  font-weight: 300;\n}\n@media (min-width: 768px) {\n  header .container {\n    padding-top: 200px;\n    padding-bottom: 100px;\n  }\n  header .intro-text .name {\n    font-size: 4.75em;\n  }\n  header .intro-text .skills {\n    font-size: 1.75em;\n  }\n}\n.navbar-custom {\n  background: #2C3E50;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  border: none;\n}\n.navbar-custom a:focus {\n  outline: none;\n}\n.navbar-custom .navbar-brand {\n  color: white;\n}\n.navbar-custom .navbar-brand:hover,\n.navbar-custom .navbar-brand:focus,\n.navbar-custom .navbar-brand:active,\n.navbar-custom .navbar-brand.active {\n  color: white;\n}\n.navbar-custom .navbar-nav {\n  letter-spacing: 1px;\n}\n.navbar-custom .navbar-nav li a {\n  color: white;\n}\n.navbar-custom .navbar-nav li a:hover {\n  color: #18BC9C;\n  outline: none;\n}\n.navbar-custom .navbar-nav li a:focus,\n.navbar-custom .navbar-nav li a:active {\n  color: white;\n}\n.navbar-custom .navbar-nav li.active a {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-nav li.active a:hover,\n.navbar-custom .navbar-nav li.active a:focus,\n.navbar-custom .navbar-nav li.active a:active {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-toggle {\n  color: white;\n  text-transform: uppercase;\n  font-size: 10px;\n  border-color: white;\n}\n.navbar-custom .navbar-toggle:hover,\n.navbar-custom .navbar-toggle:focus {\n  background-color: #18BC9C;\n  color: white;\n  border-color: #18BC9C;\n}\n@media (min-width: 768px) {\n  .navbar-custom {\n    padding: 25px 0;\n    -webkit-transition: padding 0.3s;\n    -moz-transition: padding 0.3s;\n    transition: padding 0.3s;\n  }\n  .navbar-custom .navbar-brand {\n    font-size: 2em;\n    -webkit-transition: all 0.3s;\n    -moz-transition: all 0.3s;\n    transition: all 0.3s;\n  }\n  .navbar-custom.affix {\n    padding: 10px 0;\n  }\n  .navbar-custom.affix .navbar-brand {\n    font-size: 1.5em;\n  }\n}\nsection {\n  padding: 100px 0;\n}\nsection h2 {\n  margin: 0;\n  font-size: 3em;\n}\nsection.success {\n  background: #18BC9C;\n  color: white;\n}\n@media (max-width: 767px) {\n  section {\n    padding: 75px 0;\n  }\n  section.first {\n    padding-top: 75px;\n  }\n}\n#portfolio .portfolio-item {\n  margin: 0 0 15px;\n  right: 0;\n  padding-bottom: 25px;\n}\n#portfolio .portfolio-item .portfolio-link {\n  display: block;\n  position: relative;\n  max-width: 400px;\n  margin: 0 auto;\n}\n#portfolio .portfolio-item .portfolio-link .caption {\n  background: rgba(24, 188, 156, 0.9);\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  transition: all ease 0.5s;\n  -webkit-transition: all ease 0.5s;\n  -moz-transition: all ease 0.5s;\n}\n#portfolio .portfolio-item .portfolio-link .caption:hover {\n  opacity: 1;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content {\n  position: absolute;\n  width: 100%;\n  height: 20px;\n  font-size: 20px;\n  text-align: center;\n  top: 50%;\n  margin-top: -12px;\n  color: white;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content i {\n  margin-top: -12px;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h3,\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h4 {\n  margin: 0;\n}\n#portfolio * {\n  z-index: 2;\n}\n@media (min-width: 767px) {\n  #portfolio .portfolio-item {\n    margin: 0 0 30px;\n  }\n}\n.floating-label-form-group {\n  position: relative;\n  margin-bottom: 0;\n  padding-bottom: 0.5em;\n  border-bottom: 1px solid #eeeeee;\n}\n.floating-label-form-group input,\n.floating-label-form-group textarea {\n  z-index: 1;\n  position: relative;\n  padding-right: 0;\n  padding-left: 0;\n  border: none;\n  border-radius: 0;\n  font-size: 1.5em;\n  background: none;\n  box-shadow: none !important;\n  resize: none;\n}\n.floating-label-form-group label {\n  display: block;\n  z-index: 0;\n  position: relative;\n  top: 2em;\n  margin: 0;\n  font-size: 0.85em;\n  line-height: 1.764705882em;\n  vertical-align: middle;\n  vertical-align: baseline;\n  opacity: 0;\n  -webkit-transition: top 0.3s ease,opacity 0.3s ease;\n  -moz-transition: top 0.3s ease,opacity 0.3s ease;\n  -ms-transition: top 0.3s ease,opacity 0.3s ease;\n  transition: top 0.3s ease,opacity 0.3s ease;\n}\n.floating-label-form-group:not(:first-child) {\n  padding-left: 14px;\n  border-left: 1px solid #eeeeee;\n}\n.floating-label-form-group-with-value label {\n  top: 0;\n  opacity: 1;\n}\n.floating-label-form-group-with-focus label {\n  color: #18BC9C;\n}\nlabel.label-lg {\n  font-size: 1.5em;\n  line-height: 1.764705882em;\n}\nform .row:first-child .floating-label-form-group {\n  border-top: 1px solid #eeeeee;\n}\nfooter {\n  color: white;\n}\nfooter h3 {\n  margin-bottom: 30px;\n}\nfooter .footer-above {\n  padding-top: 50px;\n  background-color: #2C3E50;\n}\nfooter .footer-col {\n  margin-bottom: 50px;\n}\nfooter .footer-below {\n  padding: 25px 0;\n  background-color: #233140;\n}\n.btn-outline {\n  color: white;\n  font-size: 20px;\n  border: solid 2px white;\n  background: transparent;\n  transition: all 0.3s ease-in-out;\n  margin-top: 15px;\n}\n.btn-outline:hover,\n.btn-outline:focus,\n.btn-outline:active,\n.btn-outline.active {\n  color: #18BC9C;\n  background: white;\n  border: solid 2px white;\n}\n.btn-primary {\n  color: white;\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n  font-weight: 700;\n}\n.btn-primary:hover,\n.btn-primary:focus,\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  color: white;\n  background-color: #1a242f;\n  border-color: #161f29;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled,\n.btn-primary[disabled],\nfieldset[disabled] .btn-primary,\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled:active,\n.btn-primary[disabled]:active,\nfieldset[disabled] .btn-primary:active,\n.btn-primary.disabled.active,\n.btn-primary[disabled].active,\nfieldset[disabled] .btn-primary.active {\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n}\n.btn-primary .badge {\n  color: #2C3E50;\n  background-color: white;\n}\n.btn-success {\n  color: white;\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n  font-weight: 700;\n}\n.btn-success:hover,\n.btn-success:focus,\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  color: white;\n  background-color: #128f76;\n  border-color: #11866f;\n}\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled,\n.btn-success[disabled],\nfieldset[disabled] .btn-success,\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled:active,\n.btn-success[disabled]:active,\nfieldset[disabled] .btn-success:active,\n.btn-success.disabled.active,\n.btn-success[disabled].active,\nfieldset[disabled] .btn-success.active {\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n}\n.btn-success .badge {\n  color: #18BC9C;\n  background-color: white;\n}\n.btn-social {\n  display: inline-block;\n  height: 50px;\n  width: 50px;\n  border: 2px solid white;\n  border-radius: 100%;\n  text-align: center;\n  font-size: 20px;\n  line-height: 45px;\n}\n.btn:focus,\n.btn:active,\n.btn.active {\n  outline: none;\n}\n.scroll-top {\n  position: fixed;\n  right: 2%;\n  bottom: 2%;\n  width: 50px;\n  height: 50px;\n  z-index: 1049;\n}\n.scroll-top .btn {\n  font-size: 20px;\n  width: 50px;\n  height: 50px;\n  border-radius: 100%;\n  line-height: 28px;\n}\n.scroll-top .btn:focus {\n  outline: none;\n}\n.portfolio-modal .modal-content {\n  border-radius: 0;\n  background-clip: border-box;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  border: none;\n  min-height: 100%;\n  padding: 100px 0;\n  text-align: center;\n}\n.portfolio-modal .modal-content h2 {\n  margin: 0;\n  font-size: 3em;\n}\n.portfolio-modal .modal-content img {\n  margin-bottom: 30px;\n}\n.portfolio-modal .modal-content .item-details {\n  margin: 30px 0;\n}\n.portfolio-modal .close-modal {\n  position: absolute;\n  width: 75px;\n  height: 75px;\n  background-color: transparent;\n  top: 25px;\n  right: 25px;\n  cursor: pointer;\n}\n.portfolio-modal .close-modal:hover {\n  opacity: 0.3;\n}\n.portfolio-modal .close-modal .lr {\n  height: 75px;\n  width: 1px;\n  margin-left: 35px;\n  background-color: #2C3E50;\n  transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  /* IE 9 */\n  -webkit-transform: rotate(45deg);\n  /* Safari and Chrome */\n  z-index: 1051;\n}\n.portfolio-modal .close-modal .lr .rl {\n  height: 75px;\n  width: 1px;\n  background-color: #2C3E50;\n  transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  /* IE 9 */\n  -webkit-transform: rotate(90deg);\n  /* Safari and Chrome */\n  z-index: 1052;\n}\n.portfolio-modal .modal-backdrop {\n  opacity: 0;\n  display: none;\n}\n"; });
define('text!less/mixins.css', ['module'], function(module) { module.exports = ""; });
define('text!less/variables.css', ['module'], function(module) { module.exports = ""; });
define('text!pages/page-elements/topbar-menu.html', ['module'], function(module) { module.exports = "<template>\r\n  <!-- top navigation -->\r\n        <div class=\"top_nav\">\r\n            <div class=\"nav_menu\">\r\n                <nav style=\"height: 23px;\">\r\n                </nav>\r\n            </div>\r\n            </div>\r\n            <!-- /top navigation -->        \r\n</template>"; });
define('text!resources/plugins/palette.html', ['module'], function(module) { module.exports = "<template></template>"; });
define('text!pages/home/components/index.html', ['module'], function(module) { module.exports = "<template>\r\n    <!-- sidebar menu -->\r\n    <compose router.bind=\"router\" view-model=\"pages/page-elements/sidebar-menu\"></compose>\r\n    <!-- /sidebar menu -->\r\n\r\n    <!-- top navigation -->\r\n    <compose view-model=\"pages/page-elements/topbar-menu\"></compose>\r\n    <!-- /top navigation -->\r\n\r\n    <div class=\"right_col\" role=\"main\">\r\n        <!-- market view panel -->\r\n        <div id=\"market_view\" class=\"row\">\r\n            <div class=\"col-md-12 col-sm-12 col-xs-12\">\r\n                <div class=\"x_panel\">\r\n                    <div class=\"x_content\">\r\n                        <div id=\"market_view_controls\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-control page_state.bind=\"page_state\" model_state.bind=\"model_state\" data_refresh.bind=\"data_refresh\" graph_refresh.bind=\"graph_refresh\" display_all_rows.bind=\"display_all_rows\"></data-control>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        \r\n                        <div id=\"market_view_chart\" show.bind=\"page_state.model !== 'ranking'\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-graph graph_input.bind=\"graph_input\"></data-graph>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div id=\"market_view_table\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-table table_input.bind=\"table_input\" table_output.bind=\"table_output\" graph_refresh.bind=\"graph_refresh\" display_all_rows.bind=\"display_all_rows\"></data-table>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div> \r\n    </div>\r\n</template>"; });
define('text!resources/elements/common/load-spinner-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"pure-css-loader/css-loader.css\"></require>\r\n\t<div id=\"load-spinner\" style=\"display: none;\">\r\n\t\t<div class=\"loader loader-default is-active\"></div>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-control-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"control-container\" class=\"row center-block\">\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\">\r\n              \t<button type=\"button\" class=\"btn btn-dark\">Data Sets</button>\r\n              \t<button type=\"button\" class=\"btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n\t                <label class=\"btn btn-dark active\">\r\n\t\t\t         \t<input type=\"radio\" name=\"data_set\" value=\"brandshare\" id=\"brandshareModel\"> Dataset 1\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_set\" value=\"salesgrowth\" id=\"salesgrowthModel\"> Dataset 2\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_set\" value=\"pricing\" id=\"pricingModel\"> Dataset 3\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_set\" value=\"ranking\" id=\"rankingModel\"> Dataset 4\r\n\t\t\t        </label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\">\r\n              \t<button type=\"button\" class=\"btn btn-dark\">Data Model</button>\r\n              \t<button type=\"button\" class=\"btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n\t                <label class=\"btn btn-dark active\">\r\n\t\t\t         \t<input type=\"radio\" name=\"data_model\" value=\"brandshare\" id=\"brandshareModel\"> Brand Share\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_model\" value=\"salesgrowth\" id=\"salesgrowthModel\"> Sales Growth\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_model\" value=\"pricing\" id=\"pricingModel\"> Pricing\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_model\" value=\"ranking\" id=\"rankingModel\"> Ranking\r\n\t\t\t        </label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div> \r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"data_type_list\" class=\"dropdown btn-group\">\r\n              \t<button type=\"button\" class=\"btn btn-dark\">Data Type</button>\r\n              \t<button type=\"button\" class=\"btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n              \t\t<label if.bind=\"page_state.model === 'ranking'\" class=\"btn btn-dark active\" repeat.for=\"type of model_state.data_types\">\r\n              \t\t\t<input type=\"checkbox\" name=\"data_type\" value=\"${type}\" checked> ${type}\r\n              \t\t</label>\r\n              \t\t<label if.bind=\"page_state.model !== 'ranking'\" class=\"btn btn-dark\" class.bind=\"$first ? 'active' : ''\" repeat.for=\"type of model_state.data_types\">\r\n              \t\t\t<input type=\"radio\" name=\"data_type\" value=\"${type}\"> ${type}\r\n              \t\t</label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"filter_list\" class=\"dropdown keep-open btn-group\">\r\n              \t<button type=\"button\" class=\"dLabel btn btn-dark\">Filter</button>\r\n              \t<button type=\"button\" class=\"dToggle btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n              \t\t<label class=\"btn btn-dark\" repeat.for=\"item of filter_list\">\r\n              \t\t\t<input type=\"checkbox\" name=\"filter_item\" value=\"${item}\"> ${item}\r\n              \t\t</label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div>\r\n\r\n\t\t<div show.bind=\"page_state.model !== 'ranking'\" class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"compare_entries\" class=\"dropdown keep-open btn-group\">\r\n              \t<button type=\"button\" class=\"dLabel btn btn-dark\">Compare</button>\r\n              \t<button type=\"button\" class=\"dToggle btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n              \t\t<label class=\"btn btn-dark active\">\r\n\t\t\t          \t<input type=\"checkbox\" name=\"industry\" checked> Industry\r\n\t\t\t        </label>\r\n              \t\t<label class=\"btn btn-dark\" repeat.for=\"item of model_state.compare_options\">\r\n              \t\t\t<input type=\"checkbox\" name=\"compare_option\" value=\"${item}\"> ${item}\r\n              \t\t</label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div> \r\n\r\n\t\t<div show.bind=\"page_state.model !== 'ranking'\" class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\" data-toggle=\"buttons\">\r\n\t\t        <label class=\"btn btn-dark active\">\r\n\t\t          \t<input type=\"radio\" name=\"graph_type\" value=\"line\" id=\"lineGraphType\"> Line\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"graph_type\" value=\"bar\" id=\"barGraphType\"> Bar\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"graph_type\" value=\"pie\" id=\"pieGraphType\"> Pie\r\n\t\t        </label>\r\n\t\t    </div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"time-period-buttons\">\r\n\t\t\t\t<div class=\"btn-group\" data-toggle=\"buttons\">\r\n\t\t\t        <label class=\"btn btn-dark active\">\r\n\t\t\t         \t<input type=\"radio\" name=\"time_frame\" value=\"week\" id=\"weekTimeFrame\"> Week\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"time_frame\" value=\"month\" id=\"monthTimeFrame\"> Month\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"time_frame\" value=\"year\" id=\"yearTimeFrame\"> Year\r\n\t\t\t        </label>\r\n\t\t\t    </div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div show.bind=\"page_state.model === 'ranking'\" id=\"time-period-dropdown\" class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"timePeriodList\" class=\"btn-group\">\r\n              \t<button type=\"button\" class=\"btn btn-dark\">Time Period</button>\r\n              \t<button type=\"button\" class=\"btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\" style=\"max-height: 200px; overflow-y: auto;\">\r\n\t                <label class=\"btn btn-dark\" repeat.for=\"time_period of time_period_list\">\r\n              \t\t\t<input type=\"radio\" name=\"time_period\" value=\"${time_period}\"> ${time_period}\r\n              \t\t</label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div>\r\n\t\t<div show.bind=\"page_state.model === 'ranking'\" class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\" data-toggle=\"buttons\">\r\n\t\t        <label class=\"btn btn-dark active\">\r\n\t\t         \t<input type=\"radio\" name=\"time_splice\" value=\"start\"> Sales Period Start\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"time_splice\" value=\"end\"> Sales Period End\r\n\t\t        </label>\r\n\t\t    </div>\r\n\t\t</div>\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\" data-toggle=\"buttons\">\r\n\t\t        <label class=\"btn btn-dark active\">\r\n\t\t         \t<input type=\"radio\" name=\"display_option\" value=\"current\"> Current Page\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"display_option\" value=\"all\"> All Pages\r\n\t\t        </label>\r\n\t\t    </div>\r\n\t\t</div>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-graph-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"graph-container\">\r\n\t\t<canvas id=\"chartjsGraph\"></canvas>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-table-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"datatables.net-bs/css/dataTables.bootstrap.css\"></require>\r\n\t<div id=\"data-menu-container\" class=\"hidden\"></div>\r\n\t<div id=\"data-table-container\">\r\n\t\t<div id=\"results\" style=\"overflow-x: auto;\">\r\n\t\t\t<table id=\"datatable-responsive\" class=\"table table-striped table-bordered dt-responsive nowrap\" cellspacing=\"0\" width=\"100%\"></table>\r\n\t\t</div>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/import-element.html', ['module'], function(module) { module.exports = "<div class=\"btn-group\" data-toggle=\"buttons\">\r\n    <label class=\"btn btn-dark\">\r\n      \t<input type=\"radio\" name=\"import_btn\" value=\"line\" id=\"lineGraphType\"> Import\r\n    </label>\r\n</div>"; });
define('text!resources/elements/market-view/pivot-table-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"pivottable/pivot.min.css\"></require>\r\n\t<div id=\"pivot-table-container\">\r\n\t</div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map