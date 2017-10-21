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
define('pages/home/components/index',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-binding", "aurelia-event-aggregator", "moment", "palette"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_binding_1, aurelia_event_aggregator_1, moment, palette) {
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
            this.tableInput = { json: '', fields: [], rowLabels: [], columnLabels: [], summaries: [] };
            this.compareOptions = [];
            this.compareList = [];
            this.dataTypes = [];
            this.filterList = [];
            this.numActiveFilters = 1;
            this.excludeIndustry = false;
            this.displayAllRows = false;
            this.observers = [];
            this.subscriptionList = [];
            this.dateFormat = { week: 'MMMM DD YYYY', month: 'MMMM YYYY', year: 'YYYY' };
            this.pageState = {
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
        HomeLanding.prototype.updateDataTableAndChart = function () {
            if (this.model) {
                this.createPivotData();
            }
            else {
                this.fetchModelData();
            }
        };
        HomeLanding.prototype.spinnerOpen = function () {
            this.events.publish('$openSpinner');
        };
        HomeLanding.prototype.spinnerClose = function () {
            this.events.publish('$closeSpinner');
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
        HomeLanding.prototype.filterByCompareList = function (entry, replacement) {
            replacement = replacement || 'Industry';
            if (this.compareList.length)
                return this.compareList.indexOf(entry) >= 0 ? entry : replacement;
            return entry;
        };
        HomeLanding.prototype.createPivotData = function () {
            var _this = this;
            this.dataTypes = [];
            this.filterList = [];
            var totals = this.getTotals();
            var tempArray = this.model.map(function (obj) {
                var result = obj.dataset;
                if (!_this.compareOptions.length) {
                    for (var i = 0, ii = result.length; i < ii; i++) {
                        if (_this.compareOptions.indexOf(result[i].brand) === -1)
                            _this.compareOptions.push(result[i].brand);
                    }
                }
                return result;
            });
            tempArray = [].concat.apply([], tempArray);
            var product = tempArray[0].product;
            var dataArray, dataLabels;
            var defaultRowLabels = ['Brand'];
            var defaultColumnLabels = ['Date'];
            var defaultSummaries = ['Revenue'];
            if (this.pageState.model === 'brandshare') {
                dataLabels = this.brandshareFieldDefs(product);
                dataArray = this.brandsharePivot(tempArray, totals);
            }
            else if (this.pageState.model === 'salesgrowth') {
                dataLabels = this.salesgrowthFieldDefs(product);
                dataArray = this.salesgrowthPivot(tempArray);
            }
            else if (this.pageState.model === 'pricing') {
                dataLabels = this.pricingFieldDefs(product);
                dataArray = this.pricingPivot(tempArray);
            }
            else if (this.pageState.model === 'ranking') {
                dataLabels = this.rankingFieldDefs(product);
                dataArray = this.rankingPivot(tempArray);
                defaultRowLabels = ['Revenue Rank', 'Unit Rank', 'Brand'];
                defaultSummaries = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
                defaultColumnLabels = [];
            }
            if (this.pageState.model !== 'ranking') {
                dataArray.sort(this.sortDataArray);
            }
            if (this.excludeIndustry) {
                var brandIndex_1 = this.pageState.model !== 'ranking' ? 0 : 2;
                dataArray = dataArray.filter(function (item) { return item[brandIndex_1] !== 'Industry'; });
            }
            dataArray = [dataLabels.columns].concat(dataArray);
            this.updateDataTable(dataArray, dataLabels.fieldDefinitions, defaultRowLabels, defaultColumnLabels, defaultSummaries);
        };
        HomeLanding.prototype.brandshareFieldDefs = function (product) {
            this.dataTypes = ['Revenue', 'Revenue Percentage', 'Units', 'Units Percentage'];
            var fieldDefinitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Unit_Total', type: 'float', filterable: false, rowLabelable: false },
                { name: 'Units Percentage', type: 'float', rowLabelable: false, pseudo: true, pseudoFunction: function (row) { return (row.Units / row.Unit_Total) * 100; }, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
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
                fieldDefinitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
                this.filterList.push(product[i].spec_type);
            }
            return { fieldDefinitions: fieldDefinitions, columns: columns };
        };
        HomeLanding.prototype.brandsharePivot = function (data, totals) {
            var _this = this;
            return data.map(function (obj) {
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand, 'Industry');
                result[result.length] = moment(obj.last_sale_date).format(_this.dateFormat[_this.pageState.time_frame]);
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
            this.dataTypes = ['Revenue', 'Revenue Percentage', 'Units', 'Units Percentage'];
            var fieldDefinitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Units Percentage', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
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
                fieldDefinitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
                this.filterList.push(product[i].spec_type);
            }
            return { fieldDefinitions: fieldDefinitions, columns: columns };
        };
        HomeLanding.prototype.salesgrowthPivot = function (data) {
            var _this = this;
            return data.map(function (obj, index, arr) {
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand, 'Industry');
                result[result.length] = moment(obj.last_sale_date).format(_this.dateFormat[_this.pageState.time_frame]);
                result[result.length] = index ? arr[index].units - arr[index - 1].units : 0;
                var unitGrowth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
                result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
                result[result.length] = index ? arr[index].revenue - arr[index - 1].revenue : 0;
                var revenueGrowth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0;
                result[result.length] = isFinite(revenueGrowth) ? revenueGrowth : isNaN(revenueGrowth) ? 0 : 100;
                for (var i = 0, ii = obj.product.length; i < ii; i++) {
                    result[result.length] = obj.product[i].spec_value;
                }
                return result;
            });
        };
        HomeLanding.prototype.pricingFieldDefs = function (product) {
            this.dataTypes = ['Revenue', 'Units'];
            var fieldDefinitions = [
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Date', type: 'string', filterable: true, rowLabelable: false, columnLabelable: true, sortFunction: function (a, b) { return (new Date(a)).getTime() - (new Date(b)).getTime(); } },
                { name: 'Units', type: 'float', filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: function (value) { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Revenue', type: 'float', filterable: false, rowLabelable: false, summarizable: 'avg', displayFunction: function (value) { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
            ];
            var columns = ['Brand'];
            columns[columns.length] = 'Date';
            columns[columns.length] = 'Units';
            columns[columns.length] = 'Revenue';
            for (var i = 0, ii = product.length; i < ii; i++) {
                columns[columns.length] = product[i].spec_type;
                fieldDefinitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
                this.filterList.push(product[i].spec_type);
            }
            return { fieldDefinitions: fieldDefinitions, columns: columns };
        };
        HomeLanding.prototype.pricingPivot = function (data) {
            var _this = this;
            return data.map(function (obj) {
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand, 'Industry');
                result[result.length] = moment(obj.last_sale_date).format(_this.dateFormat[_this.pageState.time_frame]);
                result[result.length] = obj.units;
                result[result.length] = obj.revenue;
                for (var i = 0, ii = obj.product.length; i < ii; i++) {
                    result[result.length] = obj.product[i].spec_value;
                }
                return result;
            });
        };
        HomeLanding.prototype.rankingFieldDefs = function (product) {
            this.dataTypes = ['Revenue Sales', 'Revenue Change', 'Unit Sales', 'Unit Change'];
            var fieldDefinitions = [
                { name: 'Revenue Rank', type: 'float', filterable: true },
                { name: 'Unit Rank', type: 'float', filterable: true },
                { name: 'Brand', type: 'string', filterable: true },
                { name: 'Unit Sales', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Unit Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
                { name: 'Revenue Sales', type: 'float', filterable: false, rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return '$' + value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); } },
                { name: 'Revenue Change', type: 'float', rowLabelable: false, summarizable: 'sum', displayFunction: function (value) { return value.toFixed(2) + '%'; } },
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
                fieldDefinitions.push({ name: product[i].spec_type, type: 'string', filterable: true });
                this.filterList.push(product[i].spec_type);
            }
            return { fieldDefinitions: fieldDefinitions, columns: columns };
        };
        HomeLanding.prototype.rankingPivot = function (data) {
            var _this = this;
            data = data.map(function (obj, index, arr) {
                var result = [];
                result[result.length] = _this.filterByCompareList(obj.brand, 'Industry');
                result[result.length] = obj.units;
                var unitGrowth = index ? ((arr[index].units - arr[index - 1].units) / arr[index - 1].units) * 100 : 0;
                result[result.length] = isFinite(unitGrowth) ? unitGrowth : isNaN(unitGrowth) ? 0 : 100;
                result[result.length] = obj.revenue;
                var revenueGrowth = index ? ((arr[index].revenue - arr[index - 1].revenue) / arr[index - 1].revenue) * 100 : 0;
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
        HomeLanding.prototype.updateDataTable = function (dataArray, fields, rowLabels, columnLabels, summaries) {
            this.tableInput.json = JSON.stringify(dataArray);
            this.tableInput.fields = fields;
            this.tableInput.rowLabels = rowLabels;
            this.tableInput.columnLabels = columnLabels;
            this.tableInput.summaries = summaries;
        };
        HomeLanding.prototype.updateDataGraph = function () {
            var chart = this.createChartInput();
            var data = {};
            data['labels'] = chart.headers;
            data['datasets'] = [];
            if (this.pageState.graph_type === 'line') {
                this.graphData.type = 'line';
                this.graphData.options = { responsive: true };
                for (var i_1 = 0, ii_1 = chart.data.length; i_1 < ii_1; i_1++) {
                    var dataset = {};
                    dataset['fill'] = false;
                    dataset['label'] = chart.labels[i_1];
                    dataset['data'] = chart.data[i_1];
                    dataset['backgroundColor'] = chart.colors[i_1];
                    dataset['borderColor'] = chart.colors[i_1];
                    data['datasets'].push(dataset);
                }
                this.graphData.data = data;
                if (data['datasets'].length > 20) {
                    var legendOptions = { display: false };
                    this.graphData.options['legend'] = legendOptions;
                }
            }
            else if (this.pageState.graph_type === 'bar') {
                this.graphData.type = 'bar';
                this.graphData.options = { responsive: true, scales: { yAxes: [{ ticks: { beginAtZero: true } }] } };
                for (var i_2 = 0, ii_2 = chart.data.length; i_2 < ii_2; i_2++) {
                    var dataset = {};
                    dataset['label'] = chart.labels[i_2];
                    dataset['data'] = chart.data[i_2];
                    dataset['backgroundColor'] = chart.colors[i_2];
                    data['datasets'].push(dataset);
                }
                this.graphData.data = data;
                if (data['datasets'].length > 20) {
                    var legendOptions = { display: false };
                    this.graphData.options['legend'] = legendOptions;
                }
            }
            else if (this.pageState.graph_type === 'pie') {
                this.graphData.type = 'pie';
                this.graphData.options = { responsive: true, legend: false };
                data['labels'] = [];
                var dataset = { data: [], backgroundColor: [] };
                dataset.backgroundColor = chart.colors;
                var totals = [];
                for (var i = 0, ii = chart.data.length; i < ii; i++) {
                    data['labels'].push(chart.labels[i]);
                    totals.push(chart.data[i].reduce(function (a, b) { return a + b; }, 0));
                }
                dataset.data = totals;
                data['datasets'].push(dataset);
                this.graphData.data = data;
            }
        };
        HomeLanding.prototype.fetchModelData = function () {
            var _this = this;
            var _class = this;
            this.spinnerOpen();
            return this.httpClient.fetch('marketview/data')
                .then(function (response) { return response.json(); })
                .then(function (data) { _class.model = data; })
                .then(function () {
                _this.spinnerClose();
                _this.createPivotData();
            });
        };
        HomeLanding.prototype.setObservers = function () {
            var _this = this;
            this.observers.push(this.bindingEngine.propertyObserver(this, 'tableOutput')
                .subscribe(function (newValue, oldValue) { return _this.updateDataGraph(); }));
            this.observers.push(this.bindingEngine.propertyObserver(this.pageState, 'graph_type')
                .subscribe(function (newValue, oldValue) { return _this.updateDataGraph(); }));
            this.observers.push(this.bindingEngine.propertyObserver(this.pageState, 'model')
                .subscribe(function (newValue, oldValue) { return _this.updateDataTableAndChart(); }));
            this.observers.push(this.bindingEngine.propertyObserver(this.pageState, 'time_frame')
                .subscribe(function (newValue, oldValue) { return _this.updateDataTableAndChart(); }));
            this.observers.push(this.bindingEngine.propertyObserver(this, 'compareList')
                .subscribe(function (newValue, oldValue) { return _this.updateDataTableAndChart(); }));
            this.observers.push(this.bindingEngine.propertyObserver(this, 'excludeIndustry')
                .subscribe(function (newValue, oldValue) { return _this.updateDataTableAndChart(); }));
        };
        HomeLanding.prototype.createChartInput = function () {
            var _this = this;
            this.spinnerOpen();
            var graphData = [], graphHeaders = [], graphLabels = [], colors = [], rows = this.tableOutput.data.body;
            rows.forEach(function (row) {
                graphLabels.push(row.slice(0, _this.numActiveFilters).join(':'));
                graphData.push(row.slice(_this.numActiveFilters, row.length));
            });
            graphHeaders = this.tableOutput.data.header.slice(this.numActiveFilters, this.tableOutput.data.header.length);
            colors = palette('tol-rainbow', graphLabels.length).map(function (hex) {
                return '#' + hex;
            });
            this.spinnerClose();
            return { labels: graphLabels, data: graphData, headers: graphHeaders, colors: colors };
        };
        HomeLanding.prototype.attached = function () {
            this.setObservers();
            this.fetchModelData();
        };
        HomeLanding.prototype.detached = function () {
            for (var i = 0, ii = this.observers.length; i < ii; i++) {
                this.observers[i].dispose();
            }
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "pageState", void 0);
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
        ], HomeLanding.prototype, "tableInput", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], HomeLanding.prototype, "tableOutput", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Array)
        ], HomeLanding.prototype, "compareOptions", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], HomeLanding.prototype, "compareList", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], HomeLanding.prototype, "dataTypes", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], HomeLanding.prototype, "filterList", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], HomeLanding.prototype, "numActiveFilters", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], HomeLanding.prototype, "excludeIndustry", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], HomeLanding.prototype, "displayAllRows", void 0);
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
        function DataControlElement(bindingEngine, events, taskQueue) {
            this.bindingEngine = bindingEngine;
            this.events = events;
            this.taskQueue = taskQueue;
            this.numActiveFilters = 0;
            this.excludeIndustry = false;
            this.displayAllRows = false;
            this.observers = [];
            this.mutationObservers = [];
        }
        DataControlElement.prototype.initialize = function () {
            var _this = this;
            $('input[type="radio"][name="graph_type"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked'))
                    _this.pageState.graph_type = $(_jqThis).val();
            });
            $('input[type="radio"][name="time_frame"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked'))
                    _this.pageState.time_frame = $(_jqThis).val();
            });
            $('input[type="radio"][name="display_option"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked'))
                    _this.displayAllRows = $(_jqThis).val() === 'all';
            });
            $('input[type="radio"][name="data_model"]').change(function (event) {
                var _jqThis = event.currentTarget;
                if ($(_jqThis).is(':checked'))
                    _this.pageState.model = $(_jqThis).val();
            });
            $('input[type="checkbox"][name="industry"]').change(function (event) {
                var _jqThis = event.currentTarget;
                _this.excludeIndustry = $(_jqThis).is(':checked') ? false : true;
            });
            this.initDataTypes();
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
            this.compareList = include;
        };
        DataControlElement.prototype.initDataTypes = function () {
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
            var _this = this;
            $('input[type="checkbox"][name="filter_item"]').change(function (event) {
                var _jqThis = event.currentTarget;
                console.log({ before: _this.numActiveFilters });
                _this.numActiveFilters = $(_jqThis).is(':checked') ? _this.numActiveFilters + 1 : _this.numActiveFilters - 1;
                console.log({ after: _this.numActiveFilters, ischecked: $(_jqThis).is(':checked') });
                if (_this.numActiveFilters > _this.filterList.length)
                    _this.numActiveFilters = _this.filterList.length;
                if (_this.numActiveFilters < 1)
                    _this.numActiveFilters = 1;
                $('input[type="checkbox"][data-field="' + $(_jqThis).val() + '"].row-labelable').click();
            });
            if (this.pageState.model === 'ranking')
                $('input[type="checkbox"][name="filter_item"]:first').click();
        };
        DataControlElement.prototype.attached = function () {
            var _this = this;
            this.initialize();
            var compareListObserver = aurelia_pal_1.DOM.createMutationObserver(function () {
                _this.initCompareOptions();
            });
            this.mutationObservers.push(compareListObserver.observe($('#compareEntries')[0], { childList: true, subtree: true, attributes: true, characterData: true }));
            var dataTypeObserver = aurelia_pal_1.DOM.createMutationObserver(function () {
                _this.initDataTypes();
            });
            this.mutationObservers.push(dataTypeObserver.observe($('#dataTypeList')[0], { childList: true, subtree: true, characterData: true }));
            var filterlistObserver = aurelia_pal_1.DOM.createMutationObserver(function () {
                _this.initFilterOptions();
            });
            this.mutationObservers.push(filterlistObserver.observe($('#filterList')[0], { childList: true, subtree: true, characterData: true }));
            this.observers.push(this.bindingEngine.propertyObserver(this, 'dataTypes')
                .subscribe(function (newValue, oldValue) { return _this.initDataTypes(); }));
            this.observers.push(this.bindingEngine.propertyObserver(this, 'filterList')
                .subscribe(function (newValue, oldValue) { return _this.initFilterOptions(); }));
        };
        DataControlElement.prototype.detached = function () {
            for (var i = 0, ii = this.mutationObservers.length; i < ii; i++) {
                this.mutationObservers[i].disconnect();
            }
            for (var i = 0, ii = this.observers.length; i < ii; i++) {
                this.observers[i].dispose();
            }
        };
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], DataControlElement.prototype, "pageState", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], DataControlElement.prototype, "compareList", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], DataControlElement.prototype, "compareOptions", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], DataControlElement.prototype, "dataTypes", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Array)
        ], DataControlElement.prototype, "filterList", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Number)
        ], DataControlElement.prototype, "numActiveFilters", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], DataControlElement.prototype, "excludeIndustry", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Boolean)
        ], DataControlElement.prototype, "displayAllRows", void 0);
        DataControlElement = __decorate([
            aurelia_framework_1.customElement('data-control'),
            aurelia_framework_2.useView('./data-control-element.html'),
            aurelia_framework_2.inject(aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator, aurelia_framework_2.TaskQueue),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine, aurelia_event_aggregator_1.EventAggregator, aurelia_framework_2.TaskQueue])
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
                $('#graph-container').css('width', '1072px');
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
            this.tableInput = { json: '' };
            this.displayAllRows = false;
            this.subscription = null;
            this.dataTable = null;
            this.skipCols = 1;
        }
        DataTableElement.prototype.spinnerOpen = function () {
            this.events.publish('$openSpinner');
        };
        DataTableElement.prototype.spinnerClose = function () {
            this.events.publish('$closeSpinner');
        };
        DataTableElement.prototype.updatePivottable = function () {
            this.setupPivot(this.tableInput);
        };
        DataTableElement.prototype.outputData = function () {
            var data = this.dataTable.buttons.exportData({
                modifier: {
                    order: this.displayAllRows ? 'current' : 'index',
                    page: this.displayAllRows ? 'all' : 'current',
                },
                format: {
                    body: function (innerHtml, rowIndex, columnIndex, cellNode) {
                        var value = Number(innerHtml.replace('$', '').replace('%', '').replace('--', '0').replace(/,/g, ''));
                        return !isNaN(value) ? value : innerHtml;
                    }
                }
            });
            this.tableOutput = { data: data, skipCols: this.skipCols };
        };
        DataTableElement.prototype.setupPivot = function (input) {
            var _this = this;
            this.spinnerOpen();
            if (DataTable) {
                $('.pivot_header_fields').remove();
                input.callbacks = { afterUpdateResults: function () {
                        _this.dataTable = $('#data-table-container table').DataTable({
                            scrollY: "500px",
                            scrollX: "1200px",
                            scrollCollapse: true,
                            select: 'single'
                        });
                        $('#data-table-container table').addClass('table-bordered');
                        $('#data-table-container table th, #data-table-container table td').css('white-space', 'nowrap');
                        _this.dataTable.on('draw', function () {
                            _this.outputData();
                        });
                        _this.dataTable.column('0:visible').order('asc').draw();
                        _this.hideExtraColumns();
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
        DataTableElement.prototype.hideExtraColumns = function () {
            var columnLimit = 12;
            var numOfColumns = this.dataTable.columns().header().length;
            var filterNum = $('input.row-labelable:checked').length;
            var extraColumns = numOfColumns > columnLimit ? numOfColumns - columnLimit : 0;
            console.log({ extraColumns: extraColumns, numOfColums: numOfColumns });
            if (extraColumns) {
                var hideColumns = Array.from(Array(extraColumns).keys()).filter(function (value) { return value >= filterNum; });
                console.log(hideColumns);
                this.dataTable.columns(hideColumns).visible(false, false);
                this.dataTable.columns.adjust().draw(false);
            }
        };
        DataTableElement.prototype.attached = function () {
            var _this = this;
            this.subscription = this.bindingEngine.propertyObserver(this.tableInput, 'json')
                .subscribe(function (newValue, oldValue) { return _this.updatePivottable(); });
            this.subscription = this.bindingEngine.propertyObserver(this, 'displayAllRows')
                .subscribe(function (newValue, oldValue) { return _this.outputData(); });
        };
        DataTableElement.prototype.detached = function () {
            this.subscription.dispose();
        };
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Object)
        ], DataTableElement.prototype, "tableInput", void 0);
        __decorate([
            aurelia_framework_2.bindable,
            __metadata("design:type", Boolean)
        ], DataTableElement.prototype, "displayAllRows", void 0);
        __decorate([
            aurelia_framework_2.bindable({ defaultBindingMode: aurelia_framework_2.bindingMode.twoWay }),
            __metadata("design:type", Object)
        ], DataTableElement.prototype, "tableOutput", void 0);
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

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container body\">\n        <div class=\"main_container\">\n            <!-- main content -->\n            <router-view></router-view>\n            <!-- /main-content -->\n\n            <!-- tsite footer -->\n            <compose view-model=\"./pages/page-elements/site-footer\"></compose>\n            <!-- /site footer -->\n        </div>\n    </div>\n    <load-spinner></load-spinner>\n</template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template>\n\t<!-- Header -->\n    <header>\n        <div class=\"container sub-header\">\n            <div class=\"row\">\n                <div class=\"col-lg-12\">\n                    <div class=\"intro-text\">\n                        <span class=\"name\">Whoops, nothing here!</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </header>\n\n  \t<section class=\"container text-center\">\n    \t<h1>Something is broken…</h1>\n    \t<p>The page cannot be found.</p>\n  \t</section>\n</template>\n"; });
define('text!pages/page-elements/sidebar-menu.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\r\n          <div class=\"col-md-3 left_col\">\r\n          <div class=\"left_col scroll-view\">\r\n            <div class=\"navbar nav_title\" style=\"border: 0;\">\r\n              <a href=\"/\" class=\"site_title\"><span>Market View!</span></a>\r\n            </div>\r\n            <div class=\"clearfix\"></div>\r\n\r\n            <br />\r\n  \r\n            <!-- sidebar menu -->\r\n            <div id=\"sidebar-menu\" class=\"main_menu_side hidden-print main_menu\">\r\n              <div class=\"menu_section active\">\r\n                  <ul class=\"nav side-menu\" style=\"\">\r\n                      <li><a id=\"dataModelli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-database\"></i> Market View <span class=\"fa fa-chevron-down\"></span></a>\r\n                      </li>\r\n                  </ul>\r\n              </div>\r\n            </div>\r\n            <!-- /sidebar menu -->\r\n              \r\n          </div>\r\n        </div>\r\n</template>"; });
define('text!pages/page-elements/site-footer.html', ['module'], function(module) { module.exports = "<template>  \r\n  <!-- footer content -->\r\n        <footer>\r\n          <div class=\"pull-right\">\r\n            Gentelella - Bootstrap Admin Template by <a href=\"https://colorlib.com\">Colorlib</a>\r\n          </div>\r\n          <div class=\"clearfix\"></div>\r\n        </footer>\r\n        <!-- /footer content -->\r\n</template>"; });
define('text!less/freelancer.css', ['module'], function(module) { module.exports = "body {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  overflow-x: hidden;\n}\np {\n  font-size: 20px;\n}\np.small {\n  font-size: 16px;\n}\na,\na:hover,\na:focus,\na:active,\na.active {\n  color: #18BC9C;\n  outline: none;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n}\n/************Handshake Dividers************/\nhr.hs-light,\nhr.hs-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.hs-light:after,\nhr.hs-primary:after {\n  content: \"\\f2b5\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.hs-light {\n  border-color: white;\n}\nhr.hs-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.hs-primary {\n  border-color: #2C3E50;\n}\nhr.hs-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Handshake Dividers************/\n/************Star Dividers************/\nhr.star-light,\nhr.star-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.star-light:after,\nhr.star-primary:after {\n  content: \"\\f005\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.star-light {\n  border-color: white;\n}\nhr.star-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.star-primary {\n  border-color: #2C3E50;\n}\nhr.star-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Star Dividers************/\n.img-centered {\n  margin: 0 auto;\n}\nheader {\n  text-align: center;\n  background: #18BC9C;\n  color: white;\n}\nheader .container {\n  padding-top: 100px;\n  padding-bottom: 50px;\n}\nheader .container.sub-header {\n  padding-top: 125px;\n  padding-bottom: 25px;\n}\nheader img {\n  display: block;\n  margin: 0 auto 20px;\n}\nheader .intro-text .name {\n  display: block;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  font-size: 2em;\n}\nheader .intro-text .skills {\n  font-size: 1.25em;\n  font-weight: 300;\n}\n@media (min-width: 768px) {\n  header .container {\n    padding-top: 200px;\n    padding-bottom: 100px;\n  }\n  header .intro-text .name {\n    font-size: 4.75em;\n  }\n  header .intro-text .skills {\n    font-size: 1.75em;\n  }\n}\n.navbar-custom {\n  background: #2C3E50;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  border: none;\n}\n.navbar-custom a:focus {\n  outline: none;\n}\n.navbar-custom .navbar-brand {\n  color: white;\n}\n.navbar-custom .navbar-brand:hover,\n.navbar-custom .navbar-brand:focus,\n.navbar-custom .navbar-brand:active,\n.navbar-custom .navbar-brand.active {\n  color: white;\n}\n.navbar-custom .navbar-nav {\n  letter-spacing: 1px;\n}\n.navbar-custom .navbar-nav li a {\n  color: white;\n}\n.navbar-custom .navbar-nav li a:hover {\n  color: #18BC9C;\n  outline: none;\n}\n.navbar-custom .navbar-nav li a:focus,\n.navbar-custom .navbar-nav li a:active {\n  color: white;\n}\n.navbar-custom .navbar-nav li.active a {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-nav li.active a:hover,\n.navbar-custom .navbar-nav li.active a:focus,\n.navbar-custom .navbar-nav li.active a:active {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-toggle {\n  color: white;\n  text-transform: uppercase;\n  font-size: 10px;\n  border-color: white;\n}\n.navbar-custom .navbar-toggle:hover,\n.navbar-custom .navbar-toggle:focus {\n  background-color: #18BC9C;\n  color: white;\n  border-color: #18BC9C;\n}\n@media (min-width: 768px) {\n  .navbar-custom {\n    padding: 25px 0;\n    -webkit-transition: padding 0.3s;\n    -moz-transition: padding 0.3s;\n    transition: padding 0.3s;\n  }\n  .navbar-custom .navbar-brand {\n    font-size: 2em;\n    -webkit-transition: all 0.3s;\n    -moz-transition: all 0.3s;\n    transition: all 0.3s;\n  }\n  .navbar-custom.affix {\n    padding: 10px 0;\n  }\n  .navbar-custom.affix .navbar-brand {\n    font-size: 1.5em;\n  }\n}\nsection {\n  padding: 100px 0;\n}\nsection h2 {\n  margin: 0;\n  font-size: 3em;\n}\nsection.success {\n  background: #18BC9C;\n  color: white;\n}\n@media (max-width: 767px) {\n  section {\n    padding: 75px 0;\n  }\n  section.first {\n    padding-top: 75px;\n  }\n}\n#portfolio .portfolio-item {\n  margin: 0 0 15px;\n  right: 0;\n  padding-bottom: 25px;\n}\n#portfolio .portfolio-item .portfolio-link {\n  display: block;\n  position: relative;\n  max-width: 400px;\n  margin: 0 auto;\n}\n#portfolio .portfolio-item .portfolio-link .caption {\n  background: rgba(24, 188, 156, 0.9);\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  transition: all ease 0.5s;\n  -webkit-transition: all ease 0.5s;\n  -moz-transition: all ease 0.5s;\n}\n#portfolio .portfolio-item .portfolio-link .caption:hover {\n  opacity: 1;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content {\n  position: absolute;\n  width: 100%;\n  height: 20px;\n  font-size: 20px;\n  text-align: center;\n  top: 50%;\n  margin-top: -12px;\n  color: white;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content i {\n  margin-top: -12px;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h3,\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h4 {\n  margin: 0;\n}\n#portfolio * {\n  z-index: 2;\n}\n@media (min-width: 767px) {\n  #portfolio .portfolio-item {\n    margin: 0 0 30px;\n  }\n}\n.floating-label-form-group {\n  position: relative;\n  margin-bottom: 0;\n  padding-bottom: 0.5em;\n  border-bottom: 1px solid #eeeeee;\n}\n.floating-label-form-group input,\n.floating-label-form-group textarea {\n  z-index: 1;\n  position: relative;\n  padding-right: 0;\n  padding-left: 0;\n  border: none;\n  border-radius: 0;\n  font-size: 1.5em;\n  background: none;\n  box-shadow: none !important;\n  resize: none;\n}\n.floating-label-form-group label {\n  display: block;\n  z-index: 0;\n  position: relative;\n  top: 2em;\n  margin: 0;\n  font-size: 0.85em;\n  line-height: 1.764705882em;\n  vertical-align: middle;\n  vertical-align: baseline;\n  opacity: 0;\n  -webkit-transition: top 0.3s ease,opacity 0.3s ease;\n  -moz-transition: top 0.3s ease,opacity 0.3s ease;\n  -ms-transition: top 0.3s ease,opacity 0.3s ease;\n  transition: top 0.3s ease,opacity 0.3s ease;\n}\n.floating-label-form-group:not(:first-child) {\n  padding-left: 14px;\n  border-left: 1px solid #eeeeee;\n}\n.floating-label-form-group-with-value label {\n  top: 0;\n  opacity: 1;\n}\n.floating-label-form-group-with-focus label {\n  color: #18BC9C;\n}\nlabel.label-lg {\n  font-size: 1.5em;\n  line-height: 1.764705882em;\n}\nform .row:first-child .floating-label-form-group {\n  border-top: 1px solid #eeeeee;\n}\nfooter {\n  color: white;\n}\nfooter h3 {\n  margin-bottom: 30px;\n}\nfooter .footer-above {\n  padding-top: 50px;\n  background-color: #2C3E50;\n}\nfooter .footer-col {\n  margin-bottom: 50px;\n}\nfooter .footer-below {\n  padding: 25px 0;\n  background-color: #233140;\n}\n.btn-outline {\n  color: white;\n  font-size: 20px;\n  border: solid 2px white;\n  background: transparent;\n  transition: all 0.3s ease-in-out;\n  margin-top: 15px;\n}\n.btn-outline:hover,\n.btn-outline:focus,\n.btn-outline:active,\n.btn-outline.active {\n  color: #18BC9C;\n  background: white;\n  border: solid 2px white;\n}\n.btn-primary {\n  color: white;\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n  font-weight: 700;\n}\n.btn-primary:hover,\n.btn-primary:focus,\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  color: white;\n  background-color: #1a242f;\n  border-color: #161f29;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled,\n.btn-primary[disabled],\nfieldset[disabled] .btn-primary,\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled:active,\n.btn-primary[disabled]:active,\nfieldset[disabled] .btn-primary:active,\n.btn-primary.disabled.active,\n.btn-primary[disabled].active,\nfieldset[disabled] .btn-primary.active {\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n}\n.btn-primary .badge {\n  color: #2C3E50;\n  background-color: white;\n}\n.btn-success {\n  color: white;\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n  font-weight: 700;\n}\n.btn-success:hover,\n.btn-success:focus,\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  color: white;\n  background-color: #128f76;\n  border-color: #11866f;\n}\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled,\n.btn-success[disabled],\nfieldset[disabled] .btn-success,\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled:active,\n.btn-success[disabled]:active,\nfieldset[disabled] .btn-success:active,\n.btn-success.disabled.active,\n.btn-success[disabled].active,\nfieldset[disabled] .btn-success.active {\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n}\n.btn-success .badge {\n  color: #18BC9C;\n  background-color: white;\n}\n.btn-social {\n  display: inline-block;\n  height: 50px;\n  width: 50px;\n  border: 2px solid white;\n  border-radius: 100%;\n  text-align: center;\n  font-size: 20px;\n  line-height: 45px;\n}\n.btn:focus,\n.btn:active,\n.btn.active {\n  outline: none;\n}\n.scroll-top {\n  position: fixed;\n  right: 2%;\n  bottom: 2%;\n  width: 50px;\n  height: 50px;\n  z-index: 1049;\n}\n.scroll-top .btn {\n  font-size: 20px;\n  width: 50px;\n  height: 50px;\n  border-radius: 100%;\n  line-height: 28px;\n}\n.scroll-top .btn:focus {\n  outline: none;\n}\n.portfolio-modal .modal-content {\n  border-radius: 0;\n  background-clip: border-box;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  border: none;\n  min-height: 100%;\n  padding: 100px 0;\n  text-align: center;\n}\n.portfolio-modal .modal-content h2 {\n  margin: 0;\n  font-size: 3em;\n}\n.portfolio-modal .modal-content img {\n  margin-bottom: 30px;\n}\n.portfolio-modal .modal-content .item-details {\n  margin: 30px 0;\n}\n.portfolio-modal .close-modal {\n  position: absolute;\n  width: 75px;\n  height: 75px;\n  background-color: transparent;\n  top: 25px;\n  right: 25px;\n  cursor: pointer;\n}\n.portfolio-modal .close-modal:hover {\n  opacity: 0.3;\n}\n.portfolio-modal .close-modal .lr {\n  height: 75px;\n  width: 1px;\n  margin-left: 35px;\n  background-color: #2C3E50;\n  transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  /* IE 9 */\n  -webkit-transform: rotate(45deg);\n  /* Safari and Chrome */\n  z-index: 1051;\n}\n.portfolio-modal .close-modal .lr .rl {\n  height: 75px;\n  width: 1px;\n  background-color: #2C3E50;\n  transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  /* IE 9 */\n  -webkit-transform: rotate(90deg);\n  /* Safari and Chrome */\n  z-index: 1052;\n}\n.portfolio-modal .modal-backdrop {\n  opacity: 0;\n  display: none;\n}\n"; });
define('text!less/mixins.css', ['module'], function(module) { module.exports = ""; });
define('text!less/variables.css', ['module'], function(module) { module.exports = ""; });
define('text!pages/page-elements/topbar-menu.html', ['module'], function(module) { module.exports = "<template>\r\n  <!-- top navigation -->\r\n        <div class=\"top_nav\">\r\n            <div class=\"nav_menu\">\r\n                <nav style=\"height: 23px;\">\r\n                </nav>\r\n            </div>\r\n            </div>\r\n            <!-- /top navigation -->        \r\n</template>"; });
define('text!pages/home/components/index.html', ['module'], function(module) { module.exports = "<template>\r\n    <!-- sidebar menu -->\r\n    <compose router.bind=\"router\" view-model=\"pages/page-elements/sidebar-menu\"></compose>\r\n    <!-- /sidebar menu -->\r\n\r\n    <!-- top navigation -->\r\n    <compose view-model=\"pages/page-elements/topbar-menu\"></compose>\r\n    <!-- /top navigation -->\r\n\r\n    <div class=\"right_col\" role=\"main\">\r\n        <!-- market view panel -->\r\n        <div id=\"market_view\" class=\"row\">\r\n            <div class=\"col-md-12 col-sm-12 col-xs-12\">\r\n                <div class=\"x_panel\">\r\n                    <div class=\"x_title\">\r\n                        <h2 id=\"view_title\">Market View</h2>\r\n                        <div class=\"clearfix\"></div>\r\n                    </div>\r\n                    <div class=\"x_content\">\r\n                        <div id=\"market_view_controls\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-control page-state.bind=\"pageState\" compare-list.bind=\"compareList\" compare-options.bind=\"compareOptions\" exclude-industry.bind=\"excludeIndustry\" data-types.bind=\"dataTypes\" filter-list.bind=\"filterList\" display-all-rows.bind=\"displayAllRows\" num-active-filters.bind=\"numActiveFilters\"></data-control>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                        \r\n                        <div id=\"market_view_chart\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-graph graph-data.bind=\"graphData\"></data-graph>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div id=\"market_view_table\">\r\n                            <div class=\"x_panel\">\r\n                                <div class=\"x_content\">\r\n                                    <data-table table-input.bind=\"tableInput\" table-output.bind=\"tableOutput\" display-all-rows.bind=\"displayAllRows\"></data-table>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div> \r\n    </div>\r\n</template>"; });
define('text!resources/elements/common/load-spinner-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"pure-css-loader/css-loader.css\"></require>\r\n\t<div id=\"load-spinner\" style=\"display: none;\">\r\n\t\t<div class=\"loader loader-default is-active\"></div>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-control-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"control-container\" class=\"row center-block\">\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\">\r\n              \t<button type=\"button\" class=\"btn btn-dark\">Data Model</button>\r\n              \t<button type=\"button\" class=\"btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n\t                <label class=\"btn btn-dark active\">\r\n\t\t\t         \t<input type=\"radio\" name=\"data_model\" value=\"brandshare\" id=\"brandshareModel\"> Brand Share\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_model\" value=\"salesgrowth\" id=\"salesgrowthModel\"> Sales Growth\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_model\" value=\"pricing\" id=\"pricingModel\"> Pricing\r\n\t\t\t        </label>\r\n\t\t\t        <label class=\"btn btn-dark\">\r\n\t\t\t          \t<input type=\"radio\" name=\"data_model\" value=\"ranking\" id=\"rankingModel\"> Ranking\r\n\t\t\t        </label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div> \r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"dataTypeList\" class=\"dropdown btn-group\">\r\n              \t<button type=\"button\" class=\"btn btn-dark\">Data Type</button>\r\n              \t<button type=\"button\" class=\"btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n              \t\t<label if.bind=\"pageState.model === 'ranking'\" class=\"btn btn-dark active\" repeat.for=\"type of dataTypes\">\r\n              \t\t\t<input type=\"checkbox\" name=\"data_type\" value=\"${type}\" checked> ${type}\r\n              \t\t</label>\r\n              \t\t<label if.bind=\"pageState.model !== 'ranking'\" class=\"btn btn-dark\" class.bind=\"$first ? 'active' : ''\" repeat.for=\"type of dataTypes\">\r\n              \t\t\t<input type=\"radio\" name=\"data_type\" value=\"${type}\"> ${type}\r\n              \t\t</label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"filterList\" class=\"dropdown keep-open btn-group\">\r\n              \t<button type=\"button\" class=\"dLabel btn btn-dark\">Filter</button>\r\n              \t<button type=\"button\" class=\"dToggle btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n              \t\t<label class=\"btn btn-dark\" repeat.for=\"item of filterList\">\r\n              \t\t\t<input type=\"checkbox\" name=\"filter_item\" value=\"${item}\"> ${item}\r\n              \t\t</label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div id=\"compareEntries\" class=\"dropdown keep-open btn-group\">\r\n              \t<button type=\"button\" class=\"dLabel btn btn-dark\">Compare</button>\r\n              \t<button type=\"button\" class=\"dToggle btn btn-dark dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                \t<span class=\"caret\"></span>\r\n                \t<span class=\"sr-only\">Toggle Dropdown</span>\r\n              \t</button>\r\n              \t<div class=\"btn-group-vertical dropdown-menu\" data-toggle=\"buttons\" role=\"menu\">\r\n              \t\t<label class=\"btn btn-dark active\">\r\n\t\t\t          \t<input type=\"checkbox\" name=\"industry\" checked> Industry\r\n\t\t\t        </label>\r\n              \t\t<label class=\"btn btn-dark\" repeat.for=\"item of compareOptions\">\r\n              \t\t\t<input type=\"checkbox\" name=\"compare_option\" value=\"${item}\"> ${item}\r\n              \t\t</label>\r\n\t            </div>\t\r\n            </div>\r\n\t\t</div> \r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\" data-toggle=\"buttons\">\r\n\t\t        <label class=\"btn btn-dark active\">\r\n\t\t          \t<input type=\"radio\" name=\"graph_type\" value=\"line\" id=\"lineGraphType\"> Line\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"graph_type\" value=\"bar\" id=\"barGraphType\"> Bar\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"graph_type\" value=\"pie\" id=\"pieGraphType\"> Pie\r\n\t\t        </label>\r\n\t\t    </div>\r\n\t\t</div>\r\n\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\" data-toggle=\"buttons\">\r\n\t\t        <label class=\"btn btn-dark active\">\r\n\t\t         \t<input type=\"radio\" name=\"time_frame\" value=\"week\" id=\"weekTimeFrame\"> Week\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"time_frame\" value=\"month\" id=\"monthTimeFrame\"> Month\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"time_frame\" value=\"year\" id=\"yearTimeFrame\"> Year\r\n\t\t        </label>\r\n\t\t    </div>\r\n\t\t</div>\r\n\t\t<div class=\"pull-left\" style=\"margin-right: 15px;\">\r\n\t\t\t<div class=\"btn-group\" data-toggle=\"buttons\">\r\n\t\t        <label class=\"btn btn-dark active\">\r\n\t\t         \t<input type=\"radio\" name=\"display_option\" value=\"current\" id=\"weekTimeFrame\"> Current Page\r\n\t\t        </label>\r\n\t\t        <label class=\"btn btn-dark\">\r\n\t\t          \t<input type=\"radio\" name=\"display_option\" value=\"all\" id=\"monthTimeFrame\"> All Pages\r\n\t\t        </label>\r\n\t\t    </div>\r\n\t\t</div>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-graph-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"graph-container\" class=\"center-block\">\r\n\t\t<canvas id=\"chartjsGraph\"></canvas>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-table-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"datatables.net-bs/css/dataTables.bootstrap.css\"></require>\r\n\t<div id=\"data-menu-container\" class=\"hidden\"></div>\r\n\t<div id=\"data-table-container\">\r\n\t\t<div id=\"results\" style=\"overflow-x: auto;\">\r\n\t\t\t<table id=\"datatable-responsive\" class=\"table table-striped table-bordered dt-responsive nowrap\" cellspacing=\"0\" width=\"100%\"></table>\r\n\t\t</div>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/pivot-table-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<require from=\"pivottable/pivot.min.css\"></require>\r\n\t<div id=\"pivot-table-container\">\r\n\t</div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map