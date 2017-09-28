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

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            './elements/market-view/data-graph-element',
            './elements/market-view/data-table-element',
            './elements/market-view/pivot-table-element',
        ]);
    }
    exports.configure = configure;
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
define('pages/home/components/index',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-binding", "aurelia-event-aggregator"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_binding_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HomeLanding = (function () {
        function HomeLanding(httpClient, bindingEngine, events) {
            this.httpClient = httpClient;
            this.bindingEngine = bindingEngine;
            this.events = events;
            this.self = this;
            this.model = null;
            this.graphData = { type: '', data: { labels: [], datasets: [] }, options: {} };
            this.tableData = { json: '', fields: [], rowLabels: [], columnLabels: [], summaries: [] };
            this.observers = [];
            this.subscriptionList = [];
            this.page_state = {
                model: 'brandshare',
                time_frame: 'week',
                data_type: 'revenue',
                data_format: 'whole',
                graph_type: 'line',
                company: 'Canon'
            };
            this.httpClient = httpClient.configure(function (config) {
                config
                    .useStandardConfiguration()
                    .withBaseUrl('/');
            });
        }
        HomeLanding.prototype.updatePageModel = function (model) {
            this.page_state.model = model;
        };
        HomeLanding.prototype.updatePageGraphType = function (graph_type) {
            this.page_state.graph_type = graph_type;
            this.updateDataGraph();
        };
        HomeLanding.prototype.updatePageTimeFrame = function (time_frame) {
            this.page_state.time_frame = time_frame;
        };
        HomeLanding.prototype.updatePageDataType = function (data_type) {
            this.page_state.data_type = data_type;
        };
        HomeLanding.prototype.updatePageDataFormat = function (data_format) {
            this.page_state.data_format = data_format;
        };
        HomeLanding.prototype.updatePageCompany = function (company) {
            this.page_state.company = company;
        };
        HomeLanding.prototype.updateExperiment = function (toggle) {
            this.tableData.toggle = toggle;
        };
        HomeLanding.prototype.getTotals = function () {
            var totals = {};
            for (var i = 0, ii = this.model.length; i < ii; i++) {
                totals[this.model[i]._id] = { unit_total: this.model[i].unit_total, revenue_total: this.model[i].revenue_total };
            }
            return totals;
        };
        HomeLanding.prototype.sortDataArray = function (a, b) {
            var brandA = a[0].toLowerCase();
            var brandB = b[0].toLowerCase();
            var dateA = (new Date(a[1])).getTime();
            var dateB = (new Date(b[1])).getTime();
            if (brandA === brandB) {
                return dateA - dateB;
            }
            return brandA > brandB ? 1 : -1;
        };
        HomeLanding.prototype.createPivotData = function () {
            var totals = this.getTotals();
            var tempArray = this.model.map(function (obj) {
                return obj.dataset;
            });
            tempArray = [].concat.apply([], tempArray);
            var product = tempArray[0].product;
            var dataArray, dataLabels;
            if (this.page_state.model === 'brandshare') {
                dataLabels = this.brandshareFieldDefs(product);
                dataArray = this.brandsharePivot(tempArray, totals);
            }
            else if (this.page_state.model === 'salesgrowth') {
                dataLabels = this.salesgrowthFieldDefs(product);
                dataArray = this.salesgrowthPivot(tempArray);
            }
            dataArray.sort(this.sortDataArray);
            dataArray = [dataLabels.columns].concat(dataArray);
            this.updateDataTable(dataArray, dataLabels.fieldDefinitions, ['Brand'], ['Date'], ['Revenue']);
        };
        HomeLanding.prototype.brandshareFieldDefs = function (product) {
            var fieldDefinitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'ISO_Date', type: 'date', filterable: false, rowLabelable: false },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Unit_Total', type: 'float', filterable: false, rowLabelable: false },
                { name: 'Units Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: function (row) { return (row.Units / row.Unit_Total) * 100; }, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Revenue_Total', type: 'float', filterable: false, rowLabelable: false },
                { name: 'Revenue Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: function (row) { return (row.Revenue / row.Revenue_Total) * 100; }, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } }
            ];
            var columns = ['Brand'];
            columns[columns.length] = 'Date';
            columns[columns.length] = 'ISO_Date';
            columns[columns.length] = 'Units';
            columns[columns.length] = 'Unit_Total';
            columns[columns.length] = 'Revenue';
            columns[columns.length] = 'Revenue_Total';
            for (var i = 0, ii = product.length; i < ii; i++) {
                columns[columns.length] = product[i].spec_type;
                fieldDefinitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
            }
            return { fieldDefinitions: fieldDefinitions, columns: columns };
        };
        HomeLanding.prototype.brandsharePivot = function (data, totals) {
            return data.map(function (obj) {
                var result = [];
                result[result.length] = obj.brand;
                result[result.length] = obj.time_frame;
                result[result.length] = obj.last_sale_date;
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
        HomeLanding.prototype.salesgrowthFieldDefs = function (product) {
            var fieldDefinitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'ISO_Date', type: 'date', filterable: false, rowLabelable: false },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Units Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Revenue Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value, field) { return value.toFixed(2) + '%'; } }
            ];
            var columns = ['Brand'];
            columns[columns.length] = 'Date';
            columns[columns.length] = 'ISO_Date';
            columns[columns.length] = 'Units';
            columns[columns.length] = 'Units Percentage';
            columns[columns.length] = 'Revenue';
            columns[columns.length] = 'Revenue Percentage';
            for (var i = 0, ii = product.length; i < ii; i++) {
                columns[columns.length] = product[i].spec_type;
                fieldDefinitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
            }
            return { fieldDefinitions: fieldDefinitions, columns: columns };
        };
        HomeLanding.prototype.salesgrowthPivot = function (data) {
            return data.map(function (obj, index, arr) {
                var result = [];
                result[result.length] = obj.brand;
                result[result.length] = obj.time_frame;
                result[result.length] = obj.last_sale_date;
                result[result.length] = index ? arr[index].units - arr[index - 1].units : 0;
                var unitGrowth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
                result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
                result[result.length] = index ? arr[index].revenue - arr[index - 1].revenue : 0;
                var revenueGrowth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0;
                result[result.length] = isFinite(revenueGrowth) ? revenueGrowth : isNaN(revenueGrowth) ? 0 : 100;
                ;
                for (var i = 0, ii = obj.product.length; i < ii; i++) {
                    result[result.length] = obj.product[i].spec_value;
                }
                return result;
            });
        };
        HomeLanding.prototype.updateDataTable = function (dataArray, fields, rowLabels, columnLabels, summaries) {
            this.tableData.json = JSON.stringify(dataArray);
            this.tableData.fields = fields;
            this.tableData.rowLabels = rowLabels;
            this.tableData.columnLabels = columnLabels;
            this.tableData.summaries = summaries;
        };
        HomeLanding.prototype.updateDataGraph = function () {
            if (this.page_state.graph_type === 'line') {
                this.graphData.type = 'line';
                this.graphData.options = this.model.line_graph_data.options;
                this.graphData.data = this.model.line_graph_data.data;
            }
            else if (this.page_state.graph_type === 'bar') {
                this.graphData.type = 'bar';
                this.graphData.options = this.model.bar_graph_data.options;
                this.graphData.data = this.model.bar_graph_data.data;
            }
            else if (this.page_state.graph_type === 'pie') {
                this.graphData.type = 'pie';
                this.graphData.options = this.model.pie_graph_data.options;
                this.graphData.data = this.model.pie_graph_data.data;
            }
        };
        HomeLanding.prototype.fetchModelData = function () {
            var _this = this;
            var _class = this;
            return this.httpClient.fetch(this.page_state.model + '/' + this.page_state.time_frame + '/' + this.page_state.data_type + '/' + this.page_state.data_format + '/' + this.page_state.company)
                .then(function (response) { return response.json(); })
                .then(function (data) { _class.model = data; })
                .then(function () {
                _this.createPivotData();
            });
        };
        HomeLanding.prototype.setObservers = function () {
            var _this = this;
            this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'model')
                .subscribe(function (newValue, oldValue) {
                if (_this.model) {
                    _this.createPivotData();
                }
                else {
                    _this.fetchModelData();
                }
            }));
            this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'time_frame')
                .subscribe(function (newValue, oldValue) { return _this.fetchModelData(); }));
            this.observers.push(this.bindingEngine.propertyObserver(this.page_state, 'company')
                .subscribe(function (newValue, oldValue) { return _this.fetchModelData(); }));
        };
        HomeLanding.prototype.setSubscribers = function () {
            this.subscriptionList.push(this.events.subscribe('$datatableChanged', function (table) {
                var graphData = [], graphLabels = [];
                table.body.forEach(function (row) {
                    var tempLabel = [], foundAllLabels = false;
                    while (!foundAllLabels && row.length) {
                        var entry = row.shift();
                        if (isNaN(entry)) {
                            tempLabel.push(entry);
                        }
                        else {
                            row.unshift(entry);
                            foundAllLabels = true;
                        }
                    }
                    graphLabels.push(tempLabel.join(':'));
                });
                graphData = table.body;
                console.log({ labels: graphLabels, data: graphData });
            }));
        };
        HomeLanding.prototype.attached = function () {
            var _this = this;
            this.fetchModelData()
                .then(function () {
                _this.setObservers();
            })
                .then(function () {
                _this.setSubscribers();
            });
        };
        HomeLanding.prototype.detached = function () {
            for (var i = 0, ii = this.observers.length; i < ii; i++) {
                this.observers[i].dispose();
            }
            for (var i = 0, ii = this.subscriptionList.length; i < ii; i++) {
                this.subscriptionList[i].dispose();
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "page_state", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "model", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "graphData", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "tableData", void 0);
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
define('resources/elements/market-view/data-graph-element',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-binding", "jquery", "chart.js"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_binding_1, $, Chart) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataGraphElement = (function () {
        function DataGraphElement(bindingEngine) {
            this.bindingEngine = bindingEngine;
            this.graphData = { type: '', data: { labels: [], datasets: [] }, options: {} };
            this.subscription = null;
        }
        DataGraphElement.prototype.updateDataGraph = function () {
            $('#chartjsGraph, .chartjs-hidden-iframe').remove();
            if (this.graphData.type === 'pie') {
                $('#graph-container').css('width', '600px');
            }
            else {
                $('#graph-container').css('width', '100%');
            }
            $('#graph-container').append('<canvas id="chartjsGraph"></canvas>');
            var context = $("#chartjsGraph")[0];
            var chart = new Chart(context, {
                type: this.graphData.type,
                data: this.graphData.data,
                options: this.graphData.options
            });
        };
        DataGraphElement.prototype.attached = function () {
            var _this = this;
            this.subscription = this.bindingEngine.propertyObserver(this.graphData, 'data')
                .subscribe(function (newValue, oldValue) { return _this.updateDataGraph(); });
        };
        DataGraphElement.prototype.detached = function () {
            this.subscription.dispose();
        };
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Object)
        ], DataGraphElement.prototype, "graphData", void 0);
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
        function DataTableElement(bindingEngine, events) {
            this.bindingEngine = bindingEngine;
            this.events = events;
            this.tableData = { json: '' };
            this.subscription = null;
            this.dataTable = null;
        }
        DataTableElement.prototype.updatePivottable = function () {
            this.setupPivot(this.tableData);
        };
        DataTableElement.prototype.setupPivot = function (input) {
            var _this = this;
            if (DataTable) {
                $('.pivot_header_fields').remove();
                input.callbacks = { afterUpdateResults: function () {
                        var table = $('#data-table-container table').DataTable({
                            scrollY: "500px",
                            scrollX: "1200px",
                            scrollCollapse: true,
                            paging: false,
                            select: 'single'
                        });
                        $('#data-table-container table').addClass('table-bordered');
                        table.column('0:visible').order('asc').draw();
                        _this.events.publish('$datatableChanged', table.buttons.exportData({
                            format: {
                                body: function (innerHtml, rowIndex, columnIndex, cellNode) {
                                    var value = Number(innerHtml.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
                                    return !isNaN(value) ? value : innerHtml;
                                }
                            }
                        }));
                    } };
                $('#data-menu-container').pivot_display('setup', input);
            }
            else {
                setTimeout(function () {
                    _this.setupPivot(input);
                }, 100);
            }
        };
        DataTableElement.prototype.attached = function () {
            var _this = this;
            this.subscription = this.bindingEngine.propertyObserver(this.tableData, 'json')
                .subscribe(function (newValue, oldValue) { return _this.updatePivottable(); });
        };
        DataTableElement.prototype.detached = function () {
            this.subscription.dispose();
        };
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Object)
        ], DataTableElement.prototype, "tableData", void 0);
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

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container body\">\n        <div class=\"main_container\">\n            <!-- main content -->\n            <router-view></router-view>\n            <!-- /main-content -->\n\n            <!-- tsite footer -->\n            <compose view-model=\"./pages/page-elements/site-footer\"></compose>\n            <!-- /site footer -->\n        </div>\n    </div>\n</template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template>\n\t<!-- Header -->\n    <header>\n        <div class=\"container sub-header\">\n            <div class=\"row\">\n                <div class=\"col-lg-12\">\n                    <div class=\"intro-text\">\n                        <span class=\"name\">Whoops, nothing here!</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </header>\n\n  \t<section class=\"container text-center\">\n    \t<h1>Something is broken…</h1>\n    \t<p>The page cannot be found.</p>\n  \t</section>\n</template>\n"; });
define('text!less/freelancer.css', ['module'], function(module) { module.exports = "body {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  overflow-x: hidden;\n}\np {\n  font-size: 20px;\n}\np.small {\n  font-size: 16px;\n}\na,\na:hover,\na:focus,\na:active,\na.active {\n  color: #18BC9C;\n  outline: none;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n}\n/************Handshake Dividers************/\nhr.hs-light,\nhr.hs-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.hs-light:after,\nhr.hs-primary:after {\n  content: \"\\f2b5\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.hs-light {\n  border-color: white;\n}\nhr.hs-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.hs-primary {\n  border-color: #2C3E50;\n}\nhr.hs-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Handshake Dividers************/\n/************Star Dividers************/\nhr.star-light,\nhr.star-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.star-light:after,\nhr.star-primary:after {\n  content: \"\\f005\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.star-light {\n  border-color: white;\n}\nhr.star-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.star-primary {\n  border-color: #2C3E50;\n}\nhr.star-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Star Dividers************/\n.img-centered {\n  margin: 0 auto;\n}\nheader {\n  text-align: center;\n  background: #18BC9C;\n  color: white;\n}\nheader .container {\n  padding-top: 100px;\n  padding-bottom: 50px;\n}\nheader .container.sub-header {\n  padding-top: 125px;\n  padding-bottom: 25px;\n}\nheader img {\n  display: block;\n  margin: 0 auto 20px;\n}\nheader .intro-text .name {\n  display: block;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  font-size: 2em;\n}\nheader .intro-text .skills {\n  font-size: 1.25em;\n  font-weight: 300;\n}\n@media (min-width: 768px) {\n  header .container {\n    padding-top: 200px;\n    padding-bottom: 100px;\n  }\n  header .intro-text .name {\n    font-size: 4.75em;\n  }\n  header .intro-text .skills {\n    font-size: 1.75em;\n  }\n}\n.navbar-custom {\n  background: #2C3E50;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  border: none;\n}\n.navbar-custom a:focus {\n  outline: none;\n}\n.navbar-custom .navbar-brand {\n  color: white;\n}\n.navbar-custom .navbar-brand:hover,\n.navbar-custom .navbar-brand:focus,\n.navbar-custom .navbar-brand:active,\n.navbar-custom .navbar-brand.active {\n  color: white;\n}\n.navbar-custom .navbar-nav {\n  letter-spacing: 1px;\n}\n.navbar-custom .navbar-nav li a {\n  color: white;\n}\n.navbar-custom .navbar-nav li a:hover {\n  color: #18BC9C;\n  outline: none;\n}\n.navbar-custom .navbar-nav li a:focus,\n.navbar-custom .navbar-nav li a:active {\n  color: white;\n}\n.navbar-custom .navbar-nav li.active a {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-nav li.active a:hover,\n.navbar-custom .navbar-nav li.active a:focus,\n.navbar-custom .navbar-nav li.active a:active {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-toggle {\n  color: white;\n  text-transform: uppercase;\n  font-size: 10px;\n  border-color: white;\n}\n.navbar-custom .navbar-toggle:hover,\n.navbar-custom .navbar-toggle:focus {\n  background-color: #18BC9C;\n  color: white;\n  border-color: #18BC9C;\n}\n@media (min-width: 768px) {\n  .navbar-custom {\n    padding: 25px 0;\n    -webkit-transition: padding 0.3s;\n    -moz-transition: padding 0.3s;\n    transition: padding 0.3s;\n  }\n  .navbar-custom .navbar-brand {\n    font-size: 2em;\n    -webkit-transition: all 0.3s;\n    -moz-transition: all 0.3s;\n    transition: all 0.3s;\n  }\n  .navbar-custom.affix {\n    padding: 10px 0;\n  }\n  .navbar-custom.affix .navbar-brand {\n    font-size: 1.5em;\n  }\n}\nsection {\n  padding: 100px 0;\n}\nsection h2 {\n  margin: 0;\n  font-size: 3em;\n}\nsection.success {\n  background: #18BC9C;\n  color: white;\n}\n@media (max-width: 767px) {\n  section {\n    padding: 75px 0;\n  }\n  section.first {\n    padding-top: 75px;\n  }\n}\n#portfolio .portfolio-item {\n  margin: 0 0 15px;\n  right: 0;\n  padding-bottom: 25px;\n}\n#portfolio .portfolio-item .portfolio-link {\n  display: block;\n  position: relative;\n  max-width: 400px;\n  margin: 0 auto;\n}\n#portfolio .portfolio-item .portfolio-link .caption {\n  background: rgba(24, 188, 156, 0.9);\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  transition: all ease 0.5s;\n  -webkit-transition: all ease 0.5s;\n  -moz-transition: all ease 0.5s;\n}\n#portfolio .portfolio-item .portfolio-link .caption:hover {\n  opacity: 1;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content {\n  position: absolute;\n  width: 100%;\n  height: 20px;\n  font-size: 20px;\n  text-align: center;\n  top: 50%;\n  margin-top: -12px;\n  color: white;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content i {\n  margin-top: -12px;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h3,\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h4 {\n  margin: 0;\n}\n#portfolio * {\n  z-index: 2;\n}\n@media (min-width: 767px) {\n  #portfolio .portfolio-item {\n    margin: 0 0 30px;\n  }\n}\n.floating-label-form-group {\n  position: relative;\n  margin-bottom: 0;\n  padding-bottom: 0.5em;\n  border-bottom: 1px solid #eeeeee;\n}\n.floating-label-form-group input,\n.floating-label-form-group textarea {\n  z-index: 1;\n  position: relative;\n  padding-right: 0;\n  padding-left: 0;\n  border: none;\n  border-radius: 0;\n  font-size: 1.5em;\n  background: none;\n  box-shadow: none !important;\n  resize: none;\n}\n.floating-label-form-group label {\n  display: block;\n  z-index: 0;\n  position: relative;\n  top: 2em;\n  margin: 0;\n  font-size: 0.85em;\n  line-height: 1.764705882em;\n  vertical-align: middle;\n  vertical-align: baseline;\n  opacity: 0;\n  -webkit-transition: top 0.3s ease,opacity 0.3s ease;\n  -moz-transition: top 0.3s ease,opacity 0.3s ease;\n  -ms-transition: top 0.3s ease,opacity 0.3s ease;\n  transition: top 0.3s ease,opacity 0.3s ease;\n}\n.floating-label-form-group:not(:first-child) {\n  padding-left: 14px;\n  border-left: 1px solid #eeeeee;\n}\n.floating-label-form-group-with-value label {\n  top: 0;\n  opacity: 1;\n}\n.floating-label-form-group-with-focus label {\n  color: #18BC9C;\n}\nlabel.label-lg {\n  font-size: 1.5em;\n  line-height: 1.764705882em;\n}\nform .row:first-child .floating-label-form-group {\n  border-top: 1px solid #eeeeee;\n}\nfooter {\n  color: white;\n}\nfooter h3 {\n  margin-bottom: 30px;\n}\nfooter .footer-above {\n  padding-top: 50px;\n  background-color: #2C3E50;\n}\nfooter .footer-col {\n  margin-bottom: 50px;\n}\nfooter .footer-below {\n  padding: 25px 0;\n  background-color: #233140;\n}\n.btn-outline {\n  color: white;\n  font-size: 20px;\n  border: solid 2px white;\n  background: transparent;\n  transition: all 0.3s ease-in-out;\n  margin-top: 15px;\n}\n.btn-outline:hover,\n.btn-outline:focus,\n.btn-outline:active,\n.btn-outline.active {\n  color: #18BC9C;\n  background: white;\n  border: solid 2px white;\n}\n.btn-primary {\n  color: white;\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n  font-weight: 700;\n}\n.btn-primary:hover,\n.btn-primary:focus,\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  color: white;\n  background-color: #1a242f;\n  border-color: #161f29;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled,\n.btn-primary[disabled],\nfieldset[disabled] .btn-primary,\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled:active,\n.btn-primary[disabled]:active,\nfieldset[disabled] .btn-primary:active,\n.btn-primary.disabled.active,\n.btn-primary[disabled].active,\nfieldset[disabled] .btn-primary.active {\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n}\n.btn-primary .badge {\n  color: #2C3E50;\n  background-color: white;\n}\n.btn-success {\n  color: white;\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n  font-weight: 700;\n}\n.btn-success:hover,\n.btn-success:focus,\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  color: white;\n  background-color: #128f76;\n  border-color: #11866f;\n}\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled,\n.btn-success[disabled],\nfieldset[disabled] .btn-success,\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled:active,\n.btn-success[disabled]:active,\nfieldset[disabled] .btn-success:active,\n.btn-success.disabled.active,\n.btn-success[disabled].active,\nfieldset[disabled] .btn-success.active {\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n}\n.btn-success .badge {\n  color: #18BC9C;\n  background-color: white;\n}\n.btn-social {\n  display: inline-block;\n  height: 50px;\n  width: 50px;\n  border: 2px solid white;\n  border-radius: 100%;\n  text-align: center;\n  font-size: 20px;\n  line-height: 45px;\n}\n.btn:focus,\n.btn:active,\n.btn.active {\n  outline: none;\n}\n.scroll-top {\n  position: fixed;\n  right: 2%;\n  bottom: 2%;\n  width: 50px;\n  height: 50px;\n  z-index: 1049;\n}\n.scroll-top .btn {\n  font-size: 20px;\n  width: 50px;\n  height: 50px;\n  border-radius: 100%;\n  line-height: 28px;\n}\n.scroll-top .btn:focus {\n  outline: none;\n}\n.portfolio-modal .modal-content {\n  border-radius: 0;\n  background-clip: border-box;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  border: none;\n  min-height: 100%;\n  padding: 100px 0;\n  text-align: center;\n}\n.portfolio-modal .modal-content h2 {\n  margin: 0;\n  font-size: 3em;\n}\n.portfolio-modal .modal-content img {\n  margin-bottom: 30px;\n}\n.portfolio-modal .modal-content .item-details {\n  margin: 30px 0;\n}\n.portfolio-modal .close-modal {\n  position: absolute;\n  width: 75px;\n  height: 75px;\n  background-color: transparent;\n  top: 25px;\n  right: 25px;\n  cursor: pointer;\n}\n.portfolio-modal .close-modal:hover {\n  opacity: 0.3;\n}\n.portfolio-modal .close-modal .lr {\n  height: 75px;\n  width: 1px;\n  margin-left: 35px;\n  background-color: #2C3E50;\n  transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  /* IE 9 */\n  -webkit-transform: rotate(45deg);\n  /* Safari and Chrome */\n  z-index: 1051;\n}\n.portfolio-modal .close-modal .lr .rl {\n  height: 75px;\n  width: 1px;\n  background-color: #2C3E50;\n  transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  /* IE 9 */\n  -webkit-transform: rotate(90deg);\n  /* Safari and Chrome */\n  z-index: 1052;\n}\n.portfolio-modal .modal-backdrop {\n  opacity: 0;\n  display: none;\n}\n"; });
define('text!less/mixins.css', ['module'], function(module) { module.exports = ""; });
define('text!less/variables.css', ['module'], function(module) { module.exports = ""; });
define('text!pages/page-elements/sidebar-menu.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\r\n          <div class=\"col-md-3 left_col\">\r\n          <div class=\"left_col scroll-view\">\r\n            <div class=\"navbar nav_title\" style=\"border: 0;\">\r\n              <a href=\"index.html\" class=\"site_title\"><i class=\"fa fa-paw\"></i> <span>Market View!</span></a>\r\n            </div>\r\n            <div class=\"clearfix\"></div>\r\n\r\n            <!-- menu profile quick info -->\r\n            <div class=\"profile\">\r\n              <div class=\"profile_pic\">\r\n                <img src=\"src/img/img.jpg\" alt=\"...\" class=\"img-circle profile_img\">\r\n              </div>\r\n              <div class=\"profile_info\">\r\n                <span>Welcome,</span>\r\n                <h2>John Doe</h2>\r\n              </div>\r\n            </div>\r\n            <!-- /menu profile quick info -->\r\n\r\n            <br />\r\n  \r\n            <!-- sidebar menu -->\r\n            <div id=\"sidebar-menu\" class=\"main_menu_side hidden-print main_menu\">\r\n              <div class=\"menu_section active\">\r\n                  <h3>General</h3>\r\n                  <ul class=\"nav side-menu\" style=\"\">\r\n                      <li><a id=\"dataModelli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-database\"></i> Data Model <span class=\"fa fa-chevron-down\"></span></a>\r\n                          <ul class=\"nav child_menu\" style=\"display: none;\">\r\n                              <li><a id=\"brandshareBtn\" href=\"javascript:void()\" click.trigger=\"updatePageModel('brandshare')\">Brand Share</a></li>\r\n                              <li><a id=\"salesGrowthBtn\" href=\"javascript:void()\" click.trigger=\"updatePageModel('salesgrowth')\">Sales Growth</a></li>\r\n                              <li><a id=\"industryBtn\" href=\"javascript:void()\" click.trigger=\"updatePageModel('industry')\">Industry</a></li>\r\n                              <li><a id=\"pricingBtn\" href=\"javascript:void()\" click.trigger=\"updatePageModel('pricing')\">Pricing</a></li>\r\n                              <li><a id=\"rankingBtn\" href=\"javascript:void()\" click.trigger=\"updatePageModel('ranking')\">Ranking</a></li>\r\n                          </ul>\r\n                      </li>\r\n                      <li><a id=\"graphli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-bar-chart-o\"></i> Graph Type <span class=\"fa fa-chevron-down\"></span></a>\r\n                          <ul class=\"nav child_menu\" style=\"display: none;\">\r\n                              <li><a id=\"lineGraphBtn\" href=\"javascript:void()\" click.trigger=\"updatePageGraphType('line')\">Line Graph</a></li>\r\n                              <li><a id=\"barGraphBtn\" href=\"javascript:void()\" click.trigger=\"updatePageGraphType('bar')\">Bar Graph</a></li>\r\n                              <li><a id=\"pieGraphBtn\" href=\"javascript:void()\" click.trigger=\"updatePageGraphType('pie')\">Pie Graph</a></li>\r\n                          </ul>\r\n                      </li>\r\n                      <li><a id=\"timeli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-clock-o\"></i> Time Frame <span class=\"fa fa-chevron-down\"></span></a>\r\n                          <ul class=\"nav child_menu\">\r\n                              <li><a id=\"weeksBtn\" href=\"javascript:void()\" click.trigger=\"updatePageTimeFrame('week')\">Weeks</a></li>\r\n                              <li><a id=\"monthsBtn\" href=\"javascript:void()\" click.trigger=\"updatePageTimeFrame('month')\">Months</a></li>\r\n                              <li><a id=\"yearsBtn\" href=\"javascript:void()\" click.trigger=\"updatePageTimeFrame('year')\">Years</a></li>\r\n                          </ul>\r\n                      </li>\r\n                      <li><a id=\"typeli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-cubes\"></i> Data Type <span class=\"fa fa-chevron-down\"></span></a>\r\n                          <ul class=\"nav child_menu\">\r\n                              <li class=\"unitsCtrl\"><a id=\"unitsBtn\" href=\"javascript:void()\" click.trigger=\"updatePageDataType('units')\">Units</a></li>\r\n                              <li class=\"revenueCtrl\"><a id=\"revenueBtn\" href=\"javascript:void()\" click.trigger=\"updatePageDataType('revenue')\">Revenue</a></li>\r\n                          </ul>\r\n                      </li>\r\n                      <li id=\"percentageDataTypes\">\r\n                          <a id=\"formatli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-percent\"></i> Data Format <span class=\"fa fa-chevron-down\"></span></a>\r\n                          <ul class=\"nav child_menu\">\r\n                              <li class=\"unitsCtrl\"><a id=\"unitsPercentBtn\" href=\"javascript:void()\" click.trigger=\"updatePageDataFormat('whole')\">Whole</a></li>\r\n                              <li class=\"revenueCtrl\"><a id=\"revenuePercentBtn\" href=\"javascript:void()\" click.trigger=\"updatePageDataFormat('percentage')\">Percentage</a></li>\r\n                          </ul>\r\n                      </li>\r\n                      <li><a id=\"experimentli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-percent\"></i> Experimentation <span class=\"fa fa-chevron-down\"></span></a>\r\n                          <ul class=\"nav child_menu\">\r\n                              <li class=\"unitsCtrl\"><a id=\"unitsPercentBtn\" href=\"javascript:void()\" click.trigger=\"updateExperiment(true)\">Dataset 1</a></li>\r\n                              <li class=\"revenueCtrl\"><a id=\"revenuePercentBtn\" href=\"javascript:void()\" click.trigger=\"updateExperiment(false)\">Dataset 2</a></li>\r\n                          </ul>\r\n                      </li>\r\n                  </ul>\r\n              </div>\r\n            </div>\r\n            <!-- /sidebar menu -->\r\n\r\n            <!-- /menu footer buttons -->\r\n            <div class=\"sidebar-footer hidden-small\">\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"Settings\">\r\n                <span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span>\r\n              </a>\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"FullScreen\">\r\n                <span class=\"glyphicon glyphicon-fullscreen\" aria-hidden=\"true\"></span>\r\n              </a>\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"Lock\">\r\n                <span class=\"glyphicon glyphicon-eye-close\" aria-hidden=\"true\"></span>\r\n              </a>\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"Logout\" href=\"login.html\">\r\n                <span class=\"glyphicon glyphicon-off\" aria-hidden=\"true\"></span>\r\n              </a>\r\n            </div>\r\n            <!-- /menu footer buttons -->\r\n              \r\n          </div>\r\n        </div>\r\n</template>"; });
define('text!pages/page-elements/site-footer.html', ['module'], function(module) { module.exports = "<template>  \r\n  <!-- footer content -->\r\n        <footer>\r\n          <div class=\"pull-right\">\r\n            Gentelella - Bootstrap Admin Template by <a href=\"https://colorlib.com\">Colorlib</a>\r\n          </div>\r\n          <div class=\"clearfix\"></div>\r\n        </footer>\r\n        <!-- /footer content -->\r\n</template>"; });
define('text!pages/page-elements/topbar-menu.html', ['module'], function(module) { module.exports = "<template>\r\n  <!-- top navigation -->\r\n        <div class=\"top_nav\">\r\n            <div class=\"nav_menu\">\r\n                <nav>\r\n                \r\n                <ul class=\"nav navbar-nav navbar-right\">\r\n                    <li class=\"\">\r\n                    <a href=\"javascript:;\" class=\"user-profile dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                        <img src=\"src/img/img.jpg\" alt=\"\">John Doe\r\n                        <span class=\" fa fa-angle-down\"></span>\r\n                    </a>\r\n                    <ul class=\"dropdown-menu dropdown-usermenu pull-right\">\r\n                        <li><a href=\"javascript:;\"> Profile</a></li>\r\n                        <li>\r\n                        <a href=\"javascript:;\">\r\n                            <span class=\"badge bg-red pull-right\">50%</span>\r\n                            <span>Settings</span>\r\n                        </a>\r\n                        </li>\r\n                        <li><a href=\"javascript:;\">Help</a></li>\r\n                        <li><a href=\"login.html\"><i class=\"fa fa-sign-out pull-right\"></i> Log Out</a></li>\r\n                    </ul>\r\n                    </li>\r\n\r\n                    <li role=\"presentation\" class=\"dropdown\">\r\n                    <a href=\"javascript:;\" class=\"dropdown-toggle info-number\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                        <i class=\"fa fa-envelope-o\"></i>\r\n                        <span class=\"badge bg-green\">6</span>\r\n                    </a>\r\n                    <ul id=\"menu1\" class=\"dropdown-menu list-unstyled msg_list\" role=\"menu\">\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <div class=\"text-center\">\r\n                            <a>\r\n                            <strong>See All Alerts</strong>\r\n                            <i class=\"fa fa-angle-right\"></i>\r\n                            </a>\r\n                        </div>\r\n                        </li>\r\n                    </ul>\r\n                    </li>\r\n                </ul>\r\n                </nav>\r\n            </div>\r\n            </div>\r\n            <!-- /top navigation -->        \r\n</template>"; });
define('text!resources/elements/market-view/data-graph-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"graph-container\" class=\"center-block\">\r\n\t\t<canvas id=\"chartjsGraph\"></canvas>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-table-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"data-menu-container\"></div>\r\n\t<div id=\"data-table-container\">\r\n\t\t<div id=\"results\" style=\"overflow-x: auto;\">\r\n\t\t\t<table id=\"datatable-responsive\" class=\"table table-striped table-bordered dt-responsive nowrap\" cellspacing=\"0\" width=\"100%\"></table>\r\n\t\t</div>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/pivot-table-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"pivottable/pivot.min.css\"></require>\r\n\t<div id=\"pivot-table-container\">\r\n\t</div>\r\n</template>"; });
define('text!pages/home/components/index.html', ['module'], function(module) { module.exports = "<template>\r\n    <!-- sidebar menu -->\r\n    <compose router.bind=\"router\" view-model=\"pages/page-elements/sidebar-menu\"></compose>\r\n    <!-- /sidebar menu -->\r\n\r\n    <!-- top navigation -->\r\n    <compose view-model=\"pages/page-elements/topbar-menu\"></compose>\r\n    <!-- /top navigation -->\r\n\r\n    <div class=\"right_col\" role=\"main\">\r\n        <!-- market view panel -->\r\n        <div id=\"market_view\" class=\"row\">\r\n            <div class=\"col-md-12 col-sm-12 col-xs-12\">\r\n                <div class=\"x_panel\">\r\n                    <div class=\"x_title\">\r\n                        <h2 id=\"view_title\">Market View</h2>\r\n                        <div class=\"clearfix\"></div>\r\n                    </div>\r\n                    <div class=\"x_content\">\r\n                        <!-- Interactive Chart -->\r\n                        <!--div id=\"market_view_chart\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-graph graph-data.bind=\"graphData\"></data-graph>\r\n                                </div>\r\n                            </div>\r\n                        </div-->\r\n\r\n                        <!-- Interactive Table -->\r\n                        <!--div id=\"market_view_table\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <pivot-table table-data.bind=\"tableData\"></pivot-table>\r\n                                </div>\r\n                            </div>\r\n                        </div-->\r\n                        <div id=\"market_view_table\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-table table-data.bind=\"tableData\"></data-table>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div> \r\n    </div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map