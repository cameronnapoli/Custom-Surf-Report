// Public API urls
var urlWaterTemp = "http://api.spitcast.com/api/county/water-temperature/orange-county/";
var urlWind = "http://api.spitcast.com/api/county/wind/orange-county/";
var urlWaveHeight = "http://api.spitcast.com/api/spot/forecast/608/"; //spot_id = 608

// Get CSS for each temperature color
function tempColorClass(temperature) {
    if (temperature < 58) {
        return "cold_temp";
    } else if (temperature >= 58 && temperature < 65) {
        return "med_temp";
    } else if (temperature >= 65 && temperature < 75) {
        return "warm_temp";
    } else {
        return "hot_temp";
    }
}

function waterTempCallback(response) {
    var temperature = parseInt(JSON.parse(response).fahrenheit);

    var tempHtml = "Water Temp: " +
        '<span class="temp ' + tempColorClass(temperature) + '">' + temperature + '&deg;F</span>';
    document.getElementById('waterTemp').innerHTML = tempHtml;
    return;
}

function windCallback(response) {
    var jsonResponse = JSON.parse(response);
    document.getElementById('date').innerHTML = jsonResponse[0].date;
    var windObj = { // JSON object to be used by Chart.js
        "xLabels": [],
        "yValues": []
    }
    for (var i = 0; i < jsonResponse.length - 1; i++) { // length-1 because the data includes 12AM for the following day
        windObj.xLabels.push(jsonResponse[i].hour);
        windObj.yValues.push(parseFloat(jsonResponse[i].speed_mph.toFixed(2)));
    }
    var ctxWind = document.getElementById("windChart");
    ctxWind.innerHTML = "a";
    var myChart = new Chart(ctxWind, {
        type: 'bar',
        responsive: true,
        data: {
            labels: windObj.xLabels,
            datasets: [{
                label: 'Wind Speed',
                data: windObj.yValues,
                backgroundColor: 'rgba(154, 158, 161, 0.89)',
                borderColor: 'rgba(216, 219, 222, 0.89)',
                borderWidth: 1
            }]
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
    // document.getElementById('wind').innerHTML = "Wind data:<br>"+ JSON.stringify(windObj);
}

function waveHeightCallback(response) {
    var jsonResponse = JSON.parse(response);
    var waveObj = {
        "date": jsonResponse[0].date,
        "xLabels": [],
        "yValues": []
    };
    for (var i = 0; i < jsonResponse.length - 1; i++) {
        waveObj.xLabels.push(jsonResponse[i].hour);
        waveObj.yValues.push(parseFloat(jsonResponse[i].size_ft.toFixed(2)));
    }
    var ctxWave = document.getElementById("waveHeightChart");
    var myChart2 = new Chart(ctxWave, {
        type: 'bar',
        data: {
            labels: waveObj.xLabels,
            datasets: [{
                label: 'Wave Height',
                data: waveObj.yValues,
                backgroundColor: 'rgba(21, 44, 66, 0.89)',
                borderColor: 'rgba(216, 219, 222, 0.89)',
                borderWidth: 1
            }]
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

}

function getAsync(url, callback) {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.onreadystatechange = function() {
        if (xmlHttpReq.status == 200 && xmlHttpReq.readyState == 4)
            callback(xmlHttpReq.responseText);
    }
    xmlHttpReq.open("GET", url, true); // true for asynchronous
    xmlHttpReq.send(null);
}

// Send requests for water temp, wind speed, and wave height
getAsync(urlWaterTemp, waterTempCallback);
getAsync(urlWind, windCallback);
getAsync(urlWaveHeight, waveHeightCallback);
