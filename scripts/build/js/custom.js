// Initialize market view functionality
var datatable = '<table id="datatable-responsive" class="table table-striped table-bordered dt-responsive nowrap" cellspacing="0" width="100%"><thead id="datatable-thead"></thead><tbody id="datatable-tbody"></tbody></table>',
    current_view = null,
    current_graph = null,
    current_measure = null,
    current_time_frame = null;
$(function(){
    // View Buttons
    $('#brand_share_btn').click(function(){
        resetViewProperties();
        current_view = CONFIG.BRAND_SHARE_REQUEST;
        $('#percentageDataTypes, .unitsCtrl').show();
        updateView();
    });
    $('#sales_growth_btn').click(function(){
        resetViewProperties();
        current_view = CONFIG.SALES_GROWTH_REQUEST;
        $('#percentageDataTypes, .unitsCtrl').show();
        updateView();
    });
    $('#industry_btn').click(function(){
        resetViewProperties();
        current_view = CONFIG.INDUSTRY_REQUEST;
        $('#percentageDataTypes, .unitsCtrl').show();
        updateView();
    });
    $('#product_trends_btn').click(function(){
        resetViewProperties();
        current_view = CONFIG.PRODUCT_TRENDS_REQUEST;
        $('#percentageDataTypes, .unitsCtrl').show();
        updateView();
    });
    $('#pricing_btn').click(function(){
        resetViewProperties();
        current_view = CONFIG.PRICING_REQUEST;
        $('#percentageDataTypes').show();
        $('.unitsCtrl').hide();
        updateView();
    });
    // View Buttons

    // Graph Buttons
    $('#lineGraphBtn').click(function(){
        current_graph = CONFIG.LINE_GRAPH;
        updateView();
    });
    $('#barGraphBtn').click(function(){
        current_graph = CONFIG.BAR_GRAPH;
        updateView();
    });
    $('#pieGraphBtn').click(function(){
        current_graph = CONFIG.PIE_GRAPH;
        updateView();
    });
    // Graph Buttons

    // Time Buttons
    $('#weeksBtn').click(function(){
        current_time_frame = CONFIG.WEEKS;
        updateView();
    });
    $('#monthsBtn').click(function(){
        current_time_frame = CONFIG.MONTHS;
        updateView();
    });
    $('#yearsBtn').click(function(){
        current_time_frame = CONFIG.YEARS;
        updateView();
    });
    // Time Buttons

    // Data Type Buttons
    $('#unitsBtn').click(function(){
        current_measure = CONFIG.UNITS;
        updateView();
    });
    $('#revenueBtn').click(function(){
        current_measure = CONFIG.REVENUE;
        updateView();
    });
    $('#unitsPercentBtn').click(function(){
        current_measure = CONFIG.UNITS_PERCENT;
        updateView();
    });
    $('#revenuePercentBtn').click(function(){
        current_measure = CONFIG.REVENUE_PERCENT;
        updateView();
    });
    // Data Type Buttons
});

// resets all the view properties to defaults
function resetViewProperties() {
    current_view = null,
    current_graph = null,
    current_measure = null,
    current_time_frame = null;
}

function createDataTable(table){
    // refresh or create table
    $('#datatable-responsive').remove();
    $('#datatable-container').html(datatable);

    // create headers
    var thead = '<tr><th></th>';
    for(var i = 0, ii = table.thead.length; i < ii; i++){
        thead += '<th>' + table.thead[i] + '</th>';
    }
    thead += '</tr>';
    $('#datatable-thead').html(thead);

    $('#datatable-responsive').DataTable({
        "data": table.tbody,
    });
}

function createChart(graph){
    switch(current_graph){
        case CONFIG.LINE_GRAPH:
            createLineChart(graph);
            break;
        case CONFIG.BAR_GRAPH:
            createBarChart(graph);
            break;
        case CONFIG.PIE_GRAPH:
            createPieChart(graph);
            break;
        default:
            createLineChart(graph);
    }
}

function createLineChart(graph){
    // create dataset for line chart
    datasets = [];
    for(var i = 0, ii = graph.datasets.length; i < ii; i++){
        dataObj = {};
        dataObj.data = [];
        dataObj.label = graph.datasets[i]['brand'];
        for(var j = 0, jj = graph.datasets[i]['data'].length; j < jj; j++){
            dataObj.data.push(graph.datasets[i]['data'][j]);
        }
        dataObj.fill = false;
        dataObj.pointBorderWidth = 1;
        dataObj.backgroundColor = CHART_COLORS[i].backgroundColor;
        dataObj.borderColor = CHART_COLORS[i].borderColor;
        dataObj.pointBorderColor = CHART_COLORS[i].pointBorderColor;
        dataObj.pointBackgroundColor = CHART_COLORS[i].pointBackgroundColor;
        dataObj.pointHoverBackgroundColor = CHART_COLORS[i].pointHoverBackgroundColor;
        dataObj.pointHoverBorderColor = CHART_COLORS[i].pointHoverBorderColor;
        datasets.push(dataObj);
    }

    $('#lineChart, .chartjs-hidden-iframe').remove();
    $('#graph-container').append('<canvas id="lineChart" style="display: none"></canvas>');
    var ctx = $("#lineChart")[0];
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: graph.time_frame,
            datasets: datasets
        },
    });
    $('#lineChart').show();
    $('#barChart, #pieChart').hide();
}

function createBarChart(graph){
    // create dataset for bar chart
    datasets = [];
    for(var i = 0, ii = graph.datasets.length; i < ii; i++){
        dataObj = {};
        dataObj.data = [];
        dataObj.label = graph.datasets[i]['brand'];
        for(var j = 0, jj = graph.datasets[i]['data'].length; j < jj; j++){
            dataObj.data.push(graph.datasets[i]['data'][j]);
        }
        dataObj.backgroundColor = CHART_COLORS[i].backgroundColor;
        datasets.push(dataObj);
    }

    $('#barChart, .chartjs-hidden-iframe').remove();
    $('#graph-container').append('<canvas id="barChart" style="display: none"></canvas>');
     var ctx = $("#barChart")[0];
     var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: graph.time_frame,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    $('#barChart').show();
    $('#lineChart, #pieChart').hide();
}

function createPieChart(graph){
    // create dataset for pie chart
    labels = [];
    backgroundColor = [];
    dataset = []
    for(var i = 0, ii = graph.datasets.length; i < ii; i++){
        labels.push(graph.datasets[i]['brand']);
        total = 0;
        for(var j = 0, jj = graph.datasets[i]['data'].length; j < jj; j++){
            total += graph.datasets[i]['data'][j];
        }
        dataset.push(total);
        backgroundColor.push(CHART_COLORS[i].backgroundColor);
    }

    $('#pieChart, .chartjs-hidden-iframe').remove();
    $('#graph-container').append('<canvas id="pieChart" style="display: none"></canvas>');
    var ctx = $("#pieChart")[0];
    var data = {
        datasets: [{
            data: dataset,
            backgroundColor: backgroundColor,
            label: 'My dataset' // for legend
        }],
        labels: labels
    };

    var pieChart = new Chart(ctx, {
        data: data,
        type: 'pie',
        options: {
            legend: false
        }
    });
    $('#pieChart').show();
    $('#barChart, #lineChart').hide();
}

// updates the graph and table information
function updateView(){
    request = {
        'request_type': (current_view || CONFIG.DEFAULT_REQUEST),
        'graph_type': (current_graph || CONFIG.LINE_GRAPH),
        'data_type': (current_measure || CONFIG.REVENUE),
        'time_frame': (current_time_frame || CONFIG.WEEKS)
    };
    //console.log(request);
    data = JSON.parse(ctrl.routing_request(JSON.stringify(request)));
    createDataTable(data.table);
    createChart(data.graph)
    $('#getting_started').hide();
    $('#market_view').show();
}

// Sidebar
(function() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function() {
        // reset height
        $('.right_col').css('min-height', $(window).height());

        var bodyHeight = $('body').outerHeight(),
            footerHeight = $('body').hasClass('footer_fixed') ? -10 : $('footer').height(),
            leftColHeight = $('.left_col').eq(1).height() + $('.sidebar-footer').height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $('.nav_menu').height() + footerHeight;

        $('.right_col').css('min-height', contentHeight);
    };

    $('#sidebar-menu').find('a').on('click', function(ev) {
        console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $('#sidebar-menu').find('li').removeClass('active active-sm');
                $('#sidebar-menu').find('li ul').slideUp();
            } else {
                if ($('body').is(".nav-sm")) {
                    $('#sidebar-menu').find("li").removeClass("active active-sm");
                    $('#sidebar-menu').find("li ul").slideUp();
                }
            }
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

    // recompute content when resizing
    $(window).smartresize(function() {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }
})();
// /Sidebar
