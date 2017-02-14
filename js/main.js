// global variables for chart
var temp_chart;
var timeout = 5000;
var colortf = "#22aa22";
var colorts = ["#aa2222", "#2222aa", "#aa22aa", "#aaaa22"];
var namets = ["Sensor 1", "Sensor 2", "Sensor 3", "Sensor 4"];

// create legend to add
function getLegendItem(title, color, bold) {
    var item = document.createElement("div");
                    
    var marker = document.createElement("div");
    marker.className = "marker";
    marker.style.backgroundColor = color;
    item.appendChild(marker);
    
    // create label
    var label = document.createElement("div");
    if (bold) {
        label.className = "title-bold";
    } else {
        label.className = "title";
    }
    label.innerHTML = title;
    item.appendChild(label);

    return item;
}

// check value out of range
function isOutRange(high, low, value) {
    if (parseFloat(value) > parseFloat(high) || parseFloat(value) < parseFloat(low)) {
        return true;
    } else {
        return false;
    }
}

// display chart
function showChart(chartData) {
    if (temp_chart == undefined) {
        temp_chart = AmCharts.makeChart( "temp-chart", {
            "type": "serial",
            "theme": "light",
            "dataProvider": chartData,
            "rotate": true,
            "titles": [
                {
                    "text": "Temperature Chart",
                    "size": 15
                }
            ],
            "graphs": [ 
                {
                    "id": "fromGraph",
                    "lineAlpha": 0,
                    "showBalloon": false,
                    "valueField": "fromValue",
                    "fillAlphas": 0
                }, {
                    "fillAlphas": 0.2,
                    "fillToGraph": "fromGraph",
                    "fillColors": colortf,
                    "lineAlpha": 0,
                    "showBalloon": false,
                    "valueField": "toValue"
                }, {
                    "balloonText": "[[value]](1)",
                    "fillAlphas": 0,
                    "bullet": "round",
                    "bulletSize": 10,
                    "bulletAlpha": 0.3,
                    "lineThickness": 2,
                    "lineColor": colorts[0],
                    "type": "line",
                    "valueField": "value1"
                }, {
                    "balloonText": "[[value]](2)",
                    "fillAlphas": 0,
                    "bullet": "round",
                    "bulletSize": 10,
                    "bulletAlpha": 0.3,
                    "lineThickness": 2,
                    "lineColor": colorts[1],
                    "type": "line",
                    "valueField": "value2"
                }, {
                    "balloonText": "[[value]](3)",
                    "fillAlphas": 0,
                    "bullet": "round",
                    "bulletSize": 10,
                    "bulletAlpha": 0.3,
                    "lineThickness": 2,
                    "lineColor": colorts[2],
                    "type": "line",
                    "valueField": "value3"
                }, {
                    "balloonText": "[[value]](4)",
                    "fillAlphas": 0,
                    "bullet": "round",
                    "bulletSize": 10,
                    "bulletAlpha": 0.3,
                    "lineThickness": 2,
                    "lineColor": colorts[3],
                    "type": "line",
                    "valueField": "value4"
                }, {
                    "balloonText": "<b>[[value]]</b>(fluke)",
                    "fillAlphas": 0,
                    "bullet": "round",
                    "bulletSize": 10,
                    "bulletAlpha": 0.3,
                    "lineThickness": 2,
                    "lineColor": colortf,
                    "type": "line",
                    "valueField": "value"
                } ],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "fullWidth": true,
                "cursorAlpha": 0.05,
                "zoomable": false
            },
            "categoryField": "date",
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0.1,
                "tickPosition": "start",
                "tickLength": 20,
                "title": "Time Axe"
            },
            "valueAxes": [{
                // "id": "distanceAxis",
                "axisAlpha": 0.1,
                "gridAlpha": 0.1,
                "position": "left",
                "title": "Temperature Axe(℃)"
            }],
            "listeners": [{
                "event": "dataUpdated",
                "method": function(event) {
                    // chart rendered callback
                    var chart = event.chart;
                    
                    // get legend object
                    var legend = $("#temp-legend");
                    legend.empty();
                    
                    // add fluke legend
                    legend.append(getLegendItem("Fluke", colortf, false));

                    var dp = chart.dataProvider[chart.dataProvider.length - 1];
                    
                    // add sensor legends
                    legend.append(getLegendItem(namets[0], colorts[0], isOutRange(dp.toValue, dp.fromValue, dp.value1)));
                    legend.append(getLegendItem(namets[1], colorts[1], isOutRange(dp.toValue, dp.fromValue, dp.value2)));
                    legend.append(getLegendItem(namets[2], colorts[2], isOutRange(dp.toValue, dp.fromValue, dp.value3)));
                    legend.append(getLegendItem(namets[3], colorts[3], isOutRange(dp.toValue, dp.fromValue, dp.value4)));
                    
                }
            }]
        });
    } else {
        temp_chart.dataProvider = chartData; 
        temp_chart.validateData();
    }
    
}

// get json data(temparature, humidty) from php server
function getJsonData() {
    $.ajax({url: "server.php", success: function(result){
        var chartData = makeChartData(result);
        showChart(chartData);
    }});
}

// conversion of date format - ('MM/DD/YYYY hh:mm:ss')
function getFormatDate(date) {
    return  ("0" + (date.getMonth() + 1)).slice(-2) + '/' + 
            ("0" + date.getDate()).slice(-2) + '/' + 
            (date.getFullYear()) + ' ' + 
            ("0" + date.getHours()).slice(-2) + ':' + 
            ("0" + date.getMinutes()).slice(-2) + ':' + 
            ("0" + date.getSeconds()).slice(-2);
}

// make data for chart - (json => javascript object)
function makeChartData(jsonData) {
    // console.log(jsonData);
    var data = JSON.parse(jsonData);
    var chartData = [];
    for (var i = 0; i < data.length; i++) {
        var unitData = [];
        var date = new Date(0);
        date.setUTCSeconds(data[i][0]);
        unitData['date'] = getFormatDate(date);
        unitData['value'] = parseFloat(data[i][3]).toFixed(2);
        unitData['fromValue'] = (parseFloat(data[i][3]) - 0.5).toFixed(2);
        unitData['toValue'] = (parseFloat(data[i][3]) + 0.5).toFixed(2);
        unitData['value1'] = parseFloat(data[i][6]).toFixed(2);
        unitData['value2'] = parseFloat(data[i][11]).toFixed(2);
        unitData['value3'] = parseFloat(data[i][16]).toFixed(2);
        unitData['value4'] = parseFloat(data[i][21]).toFixed(2);
        chartData.push(unitData);
    }
    return chartData;
}

// page loaded?
$(document).ready(function() {
    getJsonData();
    var timer = setInterval(getJsonData, timeout);
});