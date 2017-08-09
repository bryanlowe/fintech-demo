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
            './elements/market-view/data-graph-element',
            './elements/market-view/data-table-element',
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
define('pages/home/components/index',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-binding"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_binding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HomeLanding = (function () {
        function HomeLanding(httpClient, bindingEngine) {
            this.httpClient = httpClient;
            this.bindingEngine = bindingEngine;
            this.self = this;
            this.model = { table_data: {} };
            this.graphData = { type: '', data: { labels: [], datasets: [] }, options: {} };
            this.tableData = { header: [], rows: [] };
            this.subscribers = [];
            this.page_state = {
                model: 'brandshare',
                time_frame: 'week',
                data_type: 'revenue',
                data_format: 'whole',
                graph_type: 'line'
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
        HomeLanding.prototype.updateDataTable = function () {
            this.tableData.header = this.model.table_data.header;
            this.tableData.rows = this.model.table_data.rows;
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
        HomeLanding.prototype.fetchModelData = function (class_obj) {
            var _this = this;
            return this.httpClient.fetch(this.page_state.model + '/' + this.page_state.time_frame + '/' + this.page_state.data_type + '/' + this.page_state.data_format)
                .then(function (response) { return response.json(); })
                .then(function (data) { class_obj.model = data; })
                .then(function () {
                _this.updateDataGraph();
                _this.updateDataTable();
            });
        };
        HomeLanding.prototype.setSubscribers = function () {
            var _this = this;
            this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'model')
                .subscribe(function (newValue, oldValue) { return _this.fetchModelData(_this); }));
            this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'time_frame')
                .subscribe(function (newValue, oldValue) { return _this.fetchModelData(_this); }));
            this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'data_type')
                .subscribe(function (newValue, oldValue) { return _this.fetchModelData(_this); }));
            this.subscribers.push(this.bindingEngine.propertyObserver(this.page_state, 'data_format')
                .subscribe(function (newValue, oldValue) { return _this.fetchModelData(_this); }));
        };
        HomeLanding.prototype.attached = function () {
            var _this = this;
            this.fetchModelData(this)
                .then(function () {
                _this.setSubscribers();
            });
        };
        HomeLanding.prototype.detached = function () {
            for (var i = 0, ii = this.subscribers.length; i < ii; i++) {
                this.subscribers[i].dispose();
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
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient, aurelia_binding_1.BindingEngine),
            __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_binding_1.BindingEngine])
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
define('resources/elements/market-view/data-table-element',["require", "exports", "aurelia-framework", "aurelia-framework", "aurelia-binding", "jquery", "datatables.net-responsive-bs"], function (require, exports, aurelia_framework_1, aurelia_framework_2, aurelia_binding_1, $, DataTable) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataTableElement = (function () {
        function DataTableElement(bindingEngine) {
            this.bindingEngine = bindingEngine;
            this.tableData = { header: [], rows: [] };
            this.subscription = null;
            this.dataTable = null;
        }
        DataTableElement.prototype.updateDatatable = function () {
            this.constructDataRows();
        };
        DataTableElement.prototype.constructHeader = function () {
            var thead = '<thead><tr><th>Brand</th>';
            for (var i = 0, ii = this.tableData.header.length; i < ii; i++) {
                thead += '<th>' + this.tableData.header[i] + '</th>';
            }
            thead += '</tr></thead>';
            $('#datatable-responsive').prepend(thead);
        };
        DataTableElement.prototype.constructDataRows = function () {
            var _this = this;
            if (DataTable) {
                if (this.dataTable !== null) {
                    this.dataTable.destroy();
                    this.dataTable = null;
                    $('#datatable-responsive').empty();
                }
                this.constructHeader();
                this.dataTable = $('#datatable-responsive').DataTable({
                    "data": this.tableData.rows
                });
            }
            else {
                setTimeout(function () {
                    _this.constructDataRows();
                }, 100);
            }
        };
        DataTableElement.prototype.attached = function () {
            var _this = this;
            this.subscription = this.bindingEngine.propertyObserver(this.tableData, 'header')
                .subscribe(function (newValue, oldValue) { return _this.updateDatatable(); });
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
            aurelia_framework_2.inject(aurelia_binding_1.BindingEngine),
            __metadata("design:paramtypes", [aurelia_binding_1.BindingEngine])
        ], DataTableElement);
        return DataTableElement;
    }());
    exports.DataTableElement = DataTableElement;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"container body\">\n        <div class=\"main_container\">\n            <!-- top navigation -->\n            <compose view-model=\"./pages/page-elements/topbar-menu\"></compose>\n            <!-- /top navigation -->\n\n            <!-- main content -->\n            <router-view></router-view>\n            <!-- /main-content -->\n\n            <!-- tsite footer -->\n            <compose view-model=\"./pages/page-elements/site-footer\"></compose>\n            <!-- /site footer -->\n        </div>\n    </div>\n</template>"; });
define('text!not-found.html', ['module'], function(module) { module.exports = "<template>\n\t<!-- Header -->\n    <header>\n        <div class=\"container sub-header\">\n            <div class=\"row\">\n                <div class=\"col-lg-12\">\n                    <div class=\"intro-text\">\n                        <span class=\"name\">Whoops, nothing here!</span>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </header>\n\n  \t<section class=\"container text-center\">\n    \t<h1>Something is broken…</h1>\n    \t<p>The page cannot be found.</p>\n  \t</section>\n</template>\n"; });
define('text!pages/page-elements/sidebar-menu.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\r\n          <div class=\"col-md-3 left_col\">\r\n          <div class=\"left_col scroll-view\">\r\n            <div class=\"navbar nav_title\" style=\"border: 0;\">\r\n              <a href=\"index.html\" class=\"site_title\"><i class=\"fa fa-paw\"></i> <span>Market View!</span></a>\r\n            </div>\r\n            <div class=\"clearfix\"></div>\r\n\r\n            <!-- menu profile quick info -->\r\n            <div class=\"profile\">\r\n              <div class=\"profile_pic\">\r\n                <img src=\"src/img/img.jpg\" alt=\"...\" class=\"img-circle profile_img\">\r\n              </div>\r\n              <div class=\"profile_info\">\r\n                <span>Welcome,</span>\r\n                <h2>John Doe</h2>\r\n              </div>\r\n            </div>\r\n            <!-- /menu profile quick info -->\r\n\r\n            <br />\r\n  \r\n            <!-- sidebar menu -->\r\n            <div id=\"sidebar-menu\" class=\"main_menu_side hidden-print main_menu\">\r\n              <div class=\"menu_section active\">\r\n                  <h3>General</h3>\r\n                  <ul class=\"nav side-menu\" style=\"\">\r\n                      <li><a id=\"graphli\" click.delegate=\"anchorClicked($event)\"><i class=\"fa fa-bar-chart-o\"></i> Graph Type <span class=\"fa fa-chevron-down\"></span></a>\r\n                          <ul class=\"nav child_menu\" style=\"display: none;\">\r\n                              <li><a id=\"lineGraphBtn\" href=\"javascript:void()\">Line Graph</a></li>\r\n                              <li><a id=\"barGraphBtn\" href=\"javascript:void()\">Bar Graph</a></li>\r\n                              <li><a id=\"pieGraphBtn\" href=\"javascript:void()\">Pie Graph</a></li>\r\n                          </ul>\r\n                      </li>\r\n                  </ul>\r\n              </div>\r\n            </div>\r\n            <!-- /sidebar menu -->\r\n\r\n            <!-- /menu footer buttons -->\r\n            <div class=\"sidebar-footer hidden-small\">\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"Settings\">\r\n                <span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span>\r\n              </a>\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"FullScreen\">\r\n                <span class=\"glyphicon glyphicon-fullscreen\" aria-hidden=\"true\"></span>\r\n              </a>\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"Lock\">\r\n                <span class=\"glyphicon glyphicon-eye-close\" aria-hidden=\"true\"></span>\r\n              </a>\r\n              <a data-toggle=\"tooltip\" data-placement=\"top\" title=\"Logout\" href=\"login.html\">\r\n                <span class=\"glyphicon glyphicon-off\" aria-hidden=\"true\"></span>\r\n              </a>\r\n            </div>\r\n            <!-- /menu footer buttons -->\r\n              \r\n          </div>\r\n        </div>\r\n</template>"; });
define('text!less/freelancer.css', ['module'], function(module) { module.exports = "body {\n  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  overflow-x: hidden;\n}\np {\n  font-size: 20px;\n}\np.small {\n  font-size: 16px;\n}\na,\na:hover,\na:focus,\na:active,\na.active {\n  color: #18BC9C;\n  outline: none;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n}\n/************Handshake Dividers************/\nhr.hs-light,\nhr.hs-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.hs-light:after,\nhr.hs-primary:after {\n  content: \"\\f2b5\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.hs-light {\n  border-color: white;\n}\nhr.hs-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.hs-primary {\n  border-color: #2C3E50;\n}\nhr.hs-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Handshake Dividers************/\n/************Star Dividers************/\nhr.star-light,\nhr.star-primary {\n  padding: 0;\n  border: none;\n  border-top: solid 5px;\n  text-align: center;\n  max-width: 250px;\n  margin: 25px auto 30px;\n}\nhr.star-light:after,\nhr.star-primary:after {\n  content: \"\\f005\";\n  font-family: FontAwesome;\n  display: inline-block;\n  position: relative;\n  top: -0.8em;\n  font-size: 2em;\n  padding: 0 0.25em;\n}\nhr.star-light {\n  border-color: white;\n}\nhr.star-light:after {\n  background-color: #18BC9C;\n  color: white;\n}\nhr.star-primary {\n  border-color: #2C3E50;\n}\nhr.star-primary:after {\n  background-color: white;\n  color: #2C3E50;\n}\n/************Star Dividers************/\n.img-centered {\n  margin: 0 auto;\n}\nheader {\n  text-align: center;\n  background: #18BC9C;\n  color: white;\n}\nheader .container {\n  padding-top: 100px;\n  padding-bottom: 50px;\n}\nheader .container.sub-header {\n  padding-top: 125px;\n  padding-bottom: 25px;\n}\nheader img {\n  display: block;\n  margin: 0 auto 20px;\n}\nheader .intro-text .name {\n  display: block;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  font-size: 2em;\n}\nheader .intro-text .skills {\n  font-size: 1.25em;\n  font-weight: 300;\n}\n@media (min-width: 768px) {\n  header .container {\n    padding-top: 200px;\n    padding-bottom: 100px;\n  }\n  header .intro-text .name {\n    font-size: 4.75em;\n  }\n  header .intro-text .skills {\n    font-size: 1.75em;\n  }\n}\n.navbar-custom {\n  background: #2C3E50;\n  font-family: \"Montserrat\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n  border: none;\n}\n.navbar-custom a:focus {\n  outline: none;\n}\n.navbar-custom .navbar-brand {\n  color: white;\n}\n.navbar-custom .navbar-brand:hover,\n.navbar-custom .navbar-brand:focus,\n.navbar-custom .navbar-brand:active,\n.navbar-custom .navbar-brand.active {\n  color: white;\n}\n.navbar-custom .navbar-nav {\n  letter-spacing: 1px;\n}\n.navbar-custom .navbar-nav li a {\n  color: white;\n}\n.navbar-custom .navbar-nav li a:hover {\n  color: #18BC9C;\n  outline: none;\n}\n.navbar-custom .navbar-nav li a:focus,\n.navbar-custom .navbar-nav li a:active {\n  color: white;\n}\n.navbar-custom .navbar-nav li.active a {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-nav li.active a:hover,\n.navbar-custom .navbar-nav li.active a:focus,\n.navbar-custom .navbar-nav li.active a:active {\n  color: white;\n  background: #18BC9C;\n}\n.navbar-custom .navbar-toggle {\n  color: white;\n  text-transform: uppercase;\n  font-size: 10px;\n  border-color: white;\n}\n.navbar-custom .navbar-toggle:hover,\n.navbar-custom .navbar-toggle:focus {\n  background-color: #18BC9C;\n  color: white;\n  border-color: #18BC9C;\n}\n@media (min-width: 768px) {\n  .navbar-custom {\n    padding: 25px 0;\n    -webkit-transition: padding 0.3s;\n    -moz-transition: padding 0.3s;\n    transition: padding 0.3s;\n  }\n  .navbar-custom .navbar-brand {\n    font-size: 2em;\n    -webkit-transition: all 0.3s;\n    -moz-transition: all 0.3s;\n    transition: all 0.3s;\n  }\n  .navbar-custom.affix {\n    padding: 10px 0;\n  }\n  .navbar-custom.affix .navbar-brand {\n    font-size: 1.5em;\n  }\n}\nsection {\n  padding: 100px 0;\n}\nsection h2 {\n  margin: 0;\n  font-size: 3em;\n}\nsection.success {\n  background: #18BC9C;\n  color: white;\n}\n@media (max-width: 767px) {\n  section {\n    padding: 75px 0;\n  }\n  section.first {\n    padding-top: 75px;\n  }\n}\n#portfolio .portfolio-item {\n  margin: 0 0 15px;\n  right: 0;\n  padding-bottom: 25px;\n}\n#portfolio .portfolio-item .portfolio-link {\n  display: block;\n  position: relative;\n  max-width: 400px;\n  margin: 0 auto;\n}\n#portfolio .portfolio-item .portfolio-link .caption {\n  background: rgba(24, 188, 156, 0.9);\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  transition: all ease 0.5s;\n  -webkit-transition: all ease 0.5s;\n  -moz-transition: all ease 0.5s;\n}\n#portfolio .portfolio-item .portfolio-link .caption:hover {\n  opacity: 1;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content {\n  position: absolute;\n  width: 100%;\n  height: 20px;\n  font-size: 20px;\n  text-align: center;\n  top: 50%;\n  margin-top: -12px;\n  color: white;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content i {\n  margin-top: -12px;\n}\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h3,\n#portfolio .portfolio-item .portfolio-link .caption .caption-content h4 {\n  margin: 0;\n}\n#portfolio * {\n  z-index: 2;\n}\n@media (min-width: 767px) {\n  #portfolio .portfolio-item {\n    margin: 0 0 30px;\n  }\n}\n.floating-label-form-group {\n  position: relative;\n  margin-bottom: 0;\n  padding-bottom: 0.5em;\n  border-bottom: 1px solid #eeeeee;\n}\n.floating-label-form-group input,\n.floating-label-form-group textarea {\n  z-index: 1;\n  position: relative;\n  padding-right: 0;\n  padding-left: 0;\n  border: none;\n  border-radius: 0;\n  font-size: 1.5em;\n  background: none;\n  box-shadow: none !important;\n  resize: none;\n}\n.floating-label-form-group label {\n  display: block;\n  z-index: 0;\n  position: relative;\n  top: 2em;\n  margin: 0;\n  font-size: 0.85em;\n  line-height: 1.764705882em;\n  vertical-align: middle;\n  vertical-align: baseline;\n  opacity: 0;\n  -webkit-transition: top 0.3s ease,opacity 0.3s ease;\n  -moz-transition: top 0.3s ease,opacity 0.3s ease;\n  -ms-transition: top 0.3s ease,opacity 0.3s ease;\n  transition: top 0.3s ease,opacity 0.3s ease;\n}\n.floating-label-form-group:not(:first-child) {\n  padding-left: 14px;\n  border-left: 1px solid #eeeeee;\n}\n.floating-label-form-group-with-value label {\n  top: 0;\n  opacity: 1;\n}\n.floating-label-form-group-with-focus label {\n  color: #18BC9C;\n}\nlabel.label-lg {\n  font-size: 1.5em;\n  line-height: 1.764705882em;\n}\nform .row:first-child .floating-label-form-group {\n  border-top: 1px solid #eeeeee;\n}\nfooter {\n  color: white;\n}\nfooter h3 {\n  margin-bottom: 30px;\n}\nfooter .footer-above {\n  padding-top: 50px;\n  background-color: #2C3E50;\n}\nfooter .footer-col {\n  margin-bottom: 50px;\n}\nfooter .footer-below {\n  padding: 25px 0;\n  background-color: #233140;\n}\n.btn-outline {\n  color: white;\n  font-size: 20px;\n  border: solid 2px white;\n  background: transparent;\n  transition: all 0.3s ease-in-out;\n  margin-top: 15px;\n}\n.btn-outline:hover,\n.btn-outline:focus,\n.btn-outline:active,\n.btn-outline.active {\n  color: #18BC9C;\n  background: white;\n  border: solid 2px white;\n}\n.btn-primary {\n  color: white;\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n  font-weight: 700;\n}\n.btn-primary:hover,\n.btn-primary:focus,\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  color: white;\n  background-color: #1a242f;\n  border-color: #161f29;\n}\n.btn-primary:active,\n.btn-primary.active,\n.open .dropdown-toggle.btn-primary {\n  background-image: none;\n}\n.btn-primary.disabled,\n.btn-primary[disabled],\nfieldset[disabled] .btn-primary,\n.btn-primary.disabled:hover,\n.btn-primary[disabled]:hover,\nfieldset[disabled] .btn-primary:hover,\n.btn-primary.disabled:focus,\n.btn-primary[disabled]:focus,\nfieldset[disabled] .btn-primary:focus,\n.btn-primary.disabled:active,\n.btn-primary[disabled]:active,\nfieldset[disabled] .btn-primary:active,\n.btn-primary.disabled.active,\n.btn-primary[disabled].active,\nfieldset[disabled] .btn-primary.active {\n  background-color: #2C3E50;\n  border-color: #2C3E50;\n}\n.btn-primary .badge {\n  color: #2C3E50;\n  background-color: white;\n}\n.btn-success {\n  color: white;\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n  font-weight: 700;\n}\n.btn-success:hover,\n.btn-success:focus,\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  color: white;\n  background-color: #128f76;\n  border-color: #11866f;\n}\n.btn-success:active,\n.btn-success.active,\n.open .dropdown-toggle.btn-success {\n  background-image: none;\n}\n.btn-success.disabled,\n.btn-success[disabled],\nfieldset[disabled] .btn-success,\n.btn-success.disabled:hover,\n.btn-success[disabled]:hover,\nfieldset[disabled] .btn-success:hover,\n.btn-success.disabled:focus,\n.btn-success[disabled]:focus,\nfieldset[disabled] .btn-success:focus,\n.btn-success.disabled:active,\n.btn-success[disabled]:active,\nfieldset[disabled] .btn-success:active,\n.btn-success.disabled.active,\n.btn-success[disabled].active,\nfieldset[disabled] .btn-success.active {\n  background-color: #18BC9C;\n  border-color: #18BC9C;\n}\n.btn-success .badge {\n  color: #18BC9C;\n  background-color: white;\n}\n.btn-social {\n  display: inline-block;\n  height: 50px;\n  width: 50px;\n  border: 2px solid white;\n  border-radius: 100%;\n  text-align: center;\n  font-size: 20px;\n  line-height: 45px;\n}\n.btn:focus,\n.btn:active,\n.btn.active {\n  outline: none;\n}\n.scroll-top {\n  position: fixed;\n  right: 2%;\n  bottom: 2%;\n  width: 50px;\n  height: 50px;\n  z-index: 1049;\n}\n.scroll-top .btn {\n  font-size: 20px;\n  width: 50px;\n  height: 50px;\n  border-radius: 100%;\n  line-height: 28px;\n}\n.scroll-top .btn:focus {\n  outline: none;\n}\n.portfolio-modal .modal-content {\n  border-radius: 0;\n  background-clip: border-box;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  border: none;\n  min-height: 100%;\n  padding: 100px 0;\n  text-align: center;\n}\n.portfolio-modal .modal-content h2 {\n  margin: 0;\n  font-size: 3em;\n}\n.portfolio-modal .modal-content img {\n  margin-bottom: 30px;\n}\n.portfolio-modal .modal-content .item-details {\n  margin: 30px 0;\n}\n.portfolio-modal .close-modal {\n  position: absolute;\n  width: 75px;\n  height: 75px;\n  background-color: transparent;\n  top: 25px;\n  right: 25px;\n  cursor: pointer;\n}\n.portfolio-modal .close-modal:hover {\n  opacity: 0.3;\n}\n.portfolio-modal .close-modal .lr {\n  height: 75px;\n  width: 1px;\n  margin-left: 35px;\n  background-color: #2C3E50;\n  transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  /* IE 9 */\n  -webkit-transform: rotate(45deg);\n  /* Safari and Chrome */\n  z-index: 1051;\n}\n.portfolio-modal .close-modal .lr .rl {\n  height: 75px;\n  width: 1px;\n  background-color: #2C3E50;\n  transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  /* IE 9 */\n  -webkit-transform: rotate(90deg);\n  /* Safari and Chrome */\n  z-index: 1052;\n}\n.portfolio-modal .modal-backdrop {\n  opacity: 0;\n  display: none;\n}\n"; });
define('text!less/mixins.css', ['module'], function(module) { module.exports = ""; });
define('text!less/variables.css', ['module'], function(module) { module.exports = ""; });
define('text!pages/page-elements/site-footer.html', ['module'], function(module) { module.exports = "<template>  \r\n  <!-- footer content -->\r\n        <footer>\r\n          <div class=\"pull-right\">\r\n            Gentelella - Bootstrap Admin Template by <a href=\"https://colorlib.com\">Colorlib</a>\r\n          </div>\r\n          <div class=\"clearfix\"></div>\r\n        </footer>\r\n        <!-- /footer content -->\r\n</template>"; });
define('text!pages/page-elements/topbar-menu.html', ['module'], function(module) { module.exports = "<template>\r\n  <!-- top navigation -->\r\n        <div class=\"top_nav\">\r\n            <div class=\"nav_menu\">\r\n                <nav>\r\n                \r\n                <ul class=\"nav navbar-nav navbar-right\">\r\n                    <li class=\"\">\r\n                    <a href=\"javascript:;\" class=\"user-profile dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                        <img src=\"src/img/img.jpg\" alt=\"\">John Doe\r\n                        <span class=\" fa fa-angle-down\"></span>\r\n                    </a>\r\n                    <ul class=\"dropdown-menu dropdown-usermenu pull-right\">\r\n                        <li><a href=\"javascript:;\"> Profile</a></li>\r\n                        <li>\r\n                        <a href=\"javascript:;\">\r\n                            <span class=\"badge bg-red pull-right\">50%</span>\r\n                            <span>Settings</span>\r\n                        </a>\r\n                        </li>\r\n                        <li><a href=\"javascript:;\">Help</a></li>\r\n                        <li><a href=\"login.html\"><i class=\"fa fa-sign-out pull-right\"></i> Log Out</a></li>\r\n                    </ul>\r\n                    </li>\r\n\r\n                    <li role=\"presentation\" class=\"dropdown\">\r\n                    <a href=\"javascript:;\" class=\"dropdown-toggle info-number\" data-toggle=\"dropdown\" aria-expanded=\"false\">\r\n                        <i class=\"fa fa-envelope-o\"></i>\r\n                        <span class=\"badge bg-green\">6</span>\r\n                    </a>\r\n                    <ul id=\"menu1\" class=\"dropdown-menu list-unstyled msg_list\" role=\"menu\">\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <a>\r\n                            <span class=\"image\"><img src=\"src/img/img.jpg\" alt=\"Profile Image\" /></span>\r\n                            <span>\r\n                            <span>John Smith</span>\r\n                            <span class=\"time\">3 mins ago</span>\r\n                            </span>\r\n                            <span class=\"message\">\r\n                            Film festivals used to be do-or-die moments for movie makers. They were where...\r\n                            </span>\r\n                        </a>\r\n                        </li>\r\n                        <li>\r\n                        <div class=\"text-center\">\r\n                            <a>\r\n                            <strong>See All Alerts</strong>\r\n                            <i class=\"fa fa-angle-right\"></i>\r\n                            </a>\r\n                        </div>\r\n                        </li>\r\n                    </ul>\r\n                    </li>\r\n                </ul>\r\n                </nav>\r\n            </div>\r\n            </div>\r\n            <!-- /top navigation -->        \r\n</template>"; });
define('text!pages/home/components/index.html', ['module'], function(module) { module.exports = "<template>\r\n    <div class=\"right_col\" role=\"main\">\r\n        <div class=\"col-md-12\">\r\n        \t<!-- button panel -->\r\n            <div class=\"text-center mtop20\">\r\n                <h2>Data Model</h2>\r\n                <button click.trigger=\"updatePageModel('brandshare')\" id=\"brand_share_btn\" class=\"btn btn-lg btn-primary\">Brand Share</button>\r\n                <button click.trigger=\"updatePageModel('salesgrowth')\" href=\"#\" id=\"sales_growth_btn\" class=\"btn btn-lg btn-primary\">Sales Growth</button>\r\n                <button click.trigger=\"updatePageModel('industry')\" href=\"#\" id=\"industry_btn\" class=\"btn btn-lg btn-primary\">Industry</button>\r\n                <button click.trigger=\"updatePageModel('producttrends')\" href=\"#\" id=\"product_trends_btn\" class=\"btn btn-lg btn-primary\">Product Trends</button>\r\n                <button click.trigger=\"updatePageModel('pricing')\" href=\"#\" id=\"pricing_btn\" class=\"btn btn-lg btn-primary\">Pricing</button>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-md-12 row\">\r\n            <div class=\"text-center col-md-2\">\r\n                <!-- button panel -->\r\n                <h2>Graph Type</h2>\r\n                <div class=\"btn-group-vertical\">\r\n                    <button click.trigger=\"updatePageGraphType('line')\" class=\"btn btn-lg btn-primary\">Line Graph</button>\r\n                    <button click.trigger=\"updatePageGraphType('bar')\" class=\"btn btn-lg btn-primary\">Bar Graph</button>\r\n                    <button click.trigger=\"updatePageGraphType('pie')\" class=\"btn btn-lg btn-primary\">Pie Graph</button>\r\n                </div>\r\n                <div class=\"clear\"></div><br /><br />\r\n                <h2>Time Frame</h2>\r\n                <div class=\"btn-group-vertical\">\r\n                    <button click.trigger=\"updatePageTimeFrame('week')\" class=\"btn btn-lg btn-primary\">Weeks</button>\r\n                    <button click.trigger=\"updatePageTimeFrame('month')\" class=\"btn btn-lg btn-primary\">Months</button>\r\n                    <button click.trigger=\"updatePageTimeFrame('year')\" class=\"btn btn-lg btn-primary\">Years</button>\r\n                </div>\r\n                <div class=\"clear\"></div><br /><br />\r\n                <h2>Data Type</h2>\r\n                <div class=\"btn-group-vertical\">\r\n                    <button click.trigger=\"updatePageDataType('units')\" class=\"btn btn-lg btn-primary\">Units</button>\r\n                    <button click.trigger=\"updatePageDataType('revenue')\" class=\"btn btn-lg btn-primary\">Revenue</button>\r\n                </div>\r\n                <div class=\"clear\"></div><br /><br />\r\n                <h2>Data Format</h2>\r\n                <div class=\"btn-group-vertical\">\r\n                    <button click.trigger=\"updatePageDataFormat('whole')\" class=\"btn btn-lg btn-primary\">Whole Numbers</button>\r\n                    <button click.trigger=\"updatePageDataFormat('percentage')\" class=\"btn btn-lg btn-primary\">Percentages</button>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-md-10\">\r\n                <!-- market view panel -->\r\n                <div id=\"market_view\" class=\"row\">\r\n                    <div class=\"col-md-12 col-sm-12 col-xs-12\">\r\n                        <div class=\"x_panel\">\r\n                            <div class=\"x_title\">\r\n                                <h2 id=\"view_title\">Market View</h2>\r\n                                <div class=\"clearfix\"></div>\r\n                            </div>\r\n                            <div class=\"x_content\">\r\n                                <!-- Interactive Chart -->\r\n                                <div id=\"market_view_chart\">\r\n                                    <div class=\"x_panel\">\r\n                                        <div class=\"x_content\">\r\n                                            <data-graph graph-data.bind=\"graphData\"></data-graph>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <!-- Interactive Table -->\r\n                                <div id=\"market_view_table\">\r\n                                    <div class=\"x_panel\">\r\n                                        <div class=\"x_content\">\r\n                                            <data-table table-data.bind=\"tableData\"></data-table>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>  \r\n    </div>\r\n</template>"; });
define('text!resources/elements/market-view/data-graph-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"graph-container\" class=\"center-block\">\r\n\t\t<canvas id=\"chartjsGraph\"></canvas>\r\n\t</div>\r\n</template>"; });
define('text!resources/elements/market-view/data-table-element.html', ['module'], function(module) { module.exports = "<template>\r\n\t<div id=\"datatable-container\">\r\n\t\t<table id=\"datatable-responsive\" class=\"table table-striped table-bordered dt-responsive nowrap\" cellspacing=\"0\" width=\"100%\"></table>\r\n\t</div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map