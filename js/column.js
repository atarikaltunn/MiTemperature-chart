var myChart;
var data, j = 0, i = 0, minT = 0, maxT = 0;
var temp1 = new Array(), hum1 = new Array(), time1 = new Array();
var temp2 = new Array(), hum2 = new Array(), time2 = new Array();
var temp3 = new Array(), hum3 = new Array(), time3 = new Array();
var temp4 = new Array(), hum4 = new Array(), time4 = new Array();

var freq;


$(document).ready(function () {
    if (document.getElementById("frequency").value) {
        freq = document.getElementById("frequency").value;
    }
    $.getJSON("/json", {
        data_freq: freq
    }, function (newdata) {
        data = newdata;
        for (i = 0; i < data.index_1; i++) {
            temp1[i] = data.measurements_1[i].Temperature;
            hum1[i] = data.measurements_1[i].Humidity;
            let myDate1 = new Date(data.measurements_1[i].Time * 1000);
            time1[i] = myDate1.toLocaleString('tr-TR');
        }
        // for (j = 0; j < data.index_2; j++) {
        //     temp2[j] = data.measurements_2[j].Temperature;
        //     hum2[j] = data.measurements_2[j].Humidity;
        // }

        // minT = (data.minTemp_1 < data.minTemp_2) ? data.minTemp_1 : data.minTemp_2;
        // maxT = (data.maxTemp_1 < data.maxTemp_2) ? data.maxTemp_1 : data.maxTemp_2;
        minT = data.minTemp_1;
        maxT = data.maxTemp_1;
        maxH = data.maxHum_1;
        minH = data.minHum_1;

        let elements = [data.index_1, maxT, minT, maxH, minH], output = "Values;";
        output = (`<li>Number of Measurement: ${data.index_1}</li>` + `<li>Max Temperature: ${maxT} °C</li>` + `<li>Min Temperature: ${minT} °C</li>` + `<li>Max Humidity: ${maxH}</li>` + `<li>Min Humidity: ${minH}</li>`)
        document.getElementById('values').innerHTML = output;

        




    // minHum_2: 0,

        var ctx = document.getElementById('canvas');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: time1,
                datasets: [
                    {
                        label: 'Temperature - 1',
                        data: temp1,
                        backgroundColor: 'transparent',
                        borderColor: 'red',
                        borderWidth: 3
                    },
                    // {
                    //     label: 'Temperature - 2',
                    //     data: temp2,
                    //     backgroundColor: 'transparent',
                    //     borderColor: 'purple',
                    //     borderWidth: 3
                    // },
                    {
                        label: 'Humidity - 1',
                        data: hum1,
                        backgroundColor: 'transparent',
                        borderColor: 'green',
                        borderWidth: 3
                    },
                    // {
                    //     label: 'Humidity - 2',
                    //     data: hum2,
                    //     backgroundColor: 'transparent',
                    //     borderColor: 'yellow',
                    //     borderWidth: 3
                    // }
                ]
            },
            options: {
                elements: {
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    y: {
                        title: "Temperature/Humidity",
                        beginAtZero: true,
                        min: 10,
                        max: 60
                    }
                }
            }
        });
    }).fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
    });
    //--------------------------------------------------------------------------------------------------------------------
    document.getElementById("button1").onclick = function () {
        start = Epoch(document.getElementById("starting-time").value); // * 1000;
        end = Epoch(document.getElementById("ending-time").value); // * 1000;

        if (document.getElementById("frequency").value) {
            freq = document.getElementById("frequency").value;
        }
        if (start && end) {
            console.log("date selected")
            $.getJSON("/timepick", {
                start: start,
                end: end,
                data_freq: freq
            }, function (newdata) {
                data = newdata;
                for (i = 0; i < data.index_1; i++) {
                    temp3[i] = data.measurements_1[i].Temperature;
                    hum3[i] = data.measurements_1[i].Humidity;
                    let myDate1 = new Date(data.measurements_1[i].Time * 1000);
                    time3[i] = myDate1.toLocaleString('tr-TR');
                }
                // for (j = 0; j < data.index_2; j++) {
                //     temp4[j] = data.measurements_2[j].Temperature;
                //     hum4[j] = data.measurements_2[j].Humidity;
                // }
                if (data.index_1 > 0) { // || data.index_2 > 0
                    updateConfigByMutating(myChart, temp3, hum3, time3); //temp4, hum4,
                }
            }).fail(function () {
                console.log("An error has occurred.");
            });
            //console.log(temp3, temp4, hum3, hum4, time3)
        }
    };
    document.getElementById("button2").onclick = function () {
        $.getJSON("/json1", {
            data_freq: document.getElementById("frequency").value,
        }, function (newdata) {
            data = newdata;
            for (i = 0; i < data.index_1; i++) {
                temp3[i] = data.measurements_1[i].Temperature;
                hum3[i] = data.measurements_1[i].Humidity;
                let myDate1 = new Date(data.measurements_1[i].Time * 1000);
                time3[i] = myDate1.toLocaleString('tr-TR');
            }
            // for (j = 0; j < data.index_2; j++) {
            //     temp4[j] = data.measurements_2[j].Temperature;
            //     hum4[j] = data.measurements_2[j].Humidity;
            // }
            if (data.index_1 > 0) { // || data.index_2 > 0
                updateConfigByMutating(myChart, temp3, hum3, time3); //temp4, hum4,
            }
        }).fail(function () {
            console.log("An error has occurred.");
        });
    }
});

function Epoch(date) {
    return Math.round(new Date(date).getTime() / 1000.0);
}

function updateConfigByMutating(chart, temp3, hum3, time3) {  //time4, temp4, hum4, 
    chart.data.labels = {};
    chart.data = {
        labels: time3,
        datasets: [
            {
                label: 'Temperature - 1',
                data: temp3,
                backgroundColor: 'transparent',
                borderColor: 'red',
                borderWidth: 3
            },
            // {
            //     label: 'Temperature - 2',
            //     data: temp4,
            //     backgroundColor: 'transparent',
            //     borderColor: 'purple',
            //     borderWidth: 3
            // },
            {
                label: 'Humidity - 1',
                data: hum3,
                backgroundColor: 'transparent',
                borderColor: 'green',
                borderWidth: 3
            },
            // {
            //     label: 'Humidity - 2',
            //     data: hum4,
            //     backgroundColor: 'transparent',
            //     borderColor: 'yellow',
            //     borderWidth: 3
            // }
        ]
    }
    chart.update();
}