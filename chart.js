/*

    EKLENMESİ GEREKEN ŞEYLER;
    1- Database sorgu fonksiyonları async olmalı
    2- her tarih seçildiğinde json değişkenleri sıfırlanmalı (
        ör: 19.08-22.08 aralığı seçildikten sonra 19.08-20.08 aralığı seçildiğinde 21 ve 22sine ait veriler gitmiyor.)
    3- 


*/





const fs = require('fs');
const express = require('express')
const app = express()
const port = 8083;
const host = '10.0.3.57';


// const http = require('http');
// // const hostname = '10.0.3.57';
// // const port = 8080;
// var options = {
//     host: '10.0.3.57',
//     path: '/',
//     port: '8000',
//     headers: { 'tarik': 'Intern was here..' }
// };

var myJSON = {
    index_1: 0,
    // index_2: 0,

    maxTemp_1: 0,
    // maxTemp_2: 0,

    minTemp_1: 0,
    // minTemp_2: 0,

    maxHum_1: 0,
    // maxHum_2: 0,

    minHum_1: 0,
    // minHum_2: 0,

    measurements_1: [{}]
    // measurements_2: [{}]

};
var chart_data = {
    index_1: 0,
    // index_2: 0,

    maxTemp_1: 0,
    // maxTemp_2: 0,

    minTemp_1: 0,
    // minTemp_2: 0,

    maxHum_1: 0,
    // maxHum_2: 0,

    minHum_1: 0,
    // minHum_2: 0,

    measurements_1: [{}]
    // measurements_2: [{}]

};

var new_chart_data = {
    index_1: 0,
    // index_2: 0,

    maxTemp_1: 0,
    // maxTemp_2: 0,

    minTemp_1: 0,
    // minTemp_2: 0,

    maxHum_1: 0,
    // maxHum_2: 0,

    minHum_1: 0,
    // minHum_2: 0,

    measurements_1: [{}]
    // measurements_2: [{}]

};

var picked_data = {
    start: 0,
    end: 0,

    index_1: 0,
    // index_2: 0,

    maxTemp_1: 0,
    // maxTemp_2: 0,

    minTemp_1: 0,
    // minTemp_2: 0,

    maxHum_1: 0,
    // maxHum_2: 0,

    minHum_1: 0,
    // minHum_2: 0,

    measurements_1: [{}]
    // measurements_2: [{}]
};
var mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'tarik',
    password: 'emsal123',
    database: 'wheather'
});

var data_freq = 1000; // if data_freq increases, number of data decr




app.use('/scripts', express.static(__dirname + '/js'))
app.use('/styles', express.static(__dirname + '/css'))
app.get('/json', (req, res) => {
    res.json(chart_data); // here is an error
    res.end()
});
app.get('/json1', (req, res) => {
    if (req.query.data_freq) { // if get method calls with nth row
        freqQuery1(connection, req.query.data_freq).then(() => {
            res.json(new_chart_data)
        }).catch(err => {
            console.log(err)
        });
    }
});
app.get('/timepick', (req, res) => {
    let start = 0, end = 0;
    if (req.query.start && req.query.end) {
        start = req.query.start, end = req.query.end;
    }
    if (req.query.data_freq) { // if get method calls with nth row
        data_freq = req.query.data_freq;
    }
    if (start != 0 && end != 0) {
        timepickedQuery1(connection, start, end, data_freq).then(() => {
            res.json(picked_data);
            // timepickedQuery2(connection, start, end).then(() => {
            //     console.log("cp101")
            // }).catch(err2 => {
            //     console.log(err2)
            // });
        }).catch(err => {
            console.log(err)
        });
    }
});
app.get('/', (req, res) => { // main page
    if (req.query.data_freq) { // if get method calls with nth row
        data_freq = req.query.data_freq;
    }

    mainQuery1(connection, data_freq).then(() => {
        // mainQuery2(connection, data_freq).then(() => {
        // }).catch(err2 => {
        //     console.log(err2)
        // });
    }).catch(err => {
        console.log(err)
    });


    fs.readFile('./html/index.html', null, function (error, data) {

        console.log(new Date().toLocaleString('tr-TR'), " Starting to read the file.");
        if (error) {
            console.log(new Date().toLocaleString('tr-TR'), " file error");
            res.write('File not found!');
        } else {
            console.log(new Date().toLocaleString('tr-TR'), " file readed");

            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(data)
            res.end()
        }

    });

});

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});

async function mainQuery1(connection, data_freq) {
    let measurements = {};
    await connection.query(`SELECT Temperature, Humidity, Time FROM ( SELECT @row := @row +1 AS rownum, Temperature, Humidity, Time FROM ( SELECT @row :=0) r, miTemp1 ) ranked WHERE rownum % ${data_freq} = 1;`,
        function (error, results1, fields) {
            if (error) throw error;
            let i = 0, j = 0, maxT = results1[0].Temperature, minT = results1[0].Temperature,
                maxH = results1[0].Humidity, minH = results1[0].Humidity;
            while (i < results1.length) {
                let myDate = new Date(results1[i].Time * 1000);
                measurements[j] = results1[i];
                //console.log(typeof(results1[i].Temperature))
                if (j > 0) {
                    if (measurements[j].Temperature > maxT) {
                        maxT = measurements[j].Temperature;
                    }
                    if (measurements[j].Temperature < minT) {
                        minT = measurements[j].Temperature;
                    }
                    if (measurements[j].Humidity > maxH) {
                        maxH = measurements[j].Humidity;
                    }
                    if (measurements[j].Humidity < minH) {
                        minH = measurements[j].Humidity;
                    }
                }
                i++;
                j++;
            }
            myJSON.measurements_1 = measurements;
            myJSON.index_1 = j;
            myJSON.maxTemp_1 = maxT;
            myJSON.minTemp_1 = minT;
            myJSON.maxHum_1 = maxH;
            myJSON.minHum_1 = minH;


            console.log(new Date().toLocaleString('tr-TR') + '  Number of 1st measurement: ' + j);
            chart_data = myJSON;

        });
}
// async function mainQuery2(connection, data_freq) {
//     let measurements = {};
//     await connection.query(`SELECT Temperature, Humidity, Time FROM ( SELECT @row := @row +1 AS rownum, Temperature, Humidity, Time FROM ( SELECT @row :=0) r, miTemp2 ) ranked WHERE rownum % ${data_freq} = 1;`,
//         function (error, results2, fields) {
//             if (error) throw error;
//             let i = 0, j = 0, maxT = results2[0].Temperature, minT = results2[0].Temperature,
//                 maxH = results2[0].Humidity, minH = results2[0].Humidity;

//             while (i < results2.length) {
//                 let myDate = new Date(results2[i].Time * 1000);
//                 measurements[j] = results2[i];
//                 if (j > 0) {
//                     if (measurements[j].Temperature > maxT) {
//                         maxT = measurements[j].Temperature;
//                     }
//                     if (measurements[j].Temperature < minT) {
//                         minT = measurements[j].Temperature;
//                     }
//                     if (measurements[j].Humidity > maxH) {
//                         maxH = measurements[j].Humidity;
//                     }
//                     if (measurements[j].Humidity < minH) {
//                         minH = measurements[j].Humidity;
//                     }
//                 }
//                 i++;
//                 j++;
//             }
//             myJSON.measurements_2 = measurements;
//             myJSON.index_2 = j;
//             myJSON.maxTemp_2 = maxT;
//             myJSON.minTemp_2 = minT;
//             myJSON.maxHum_2 = maxH;
//             myJSON.minHum_2 = minH;

//             console.log(new Date().toLocaleString('tr-TR') + '  Number of 2nd measurement: ' + j);
//             chart_data = myJSON;
//         });
// }




async function timepickedQuery1(connection, start, end, data_freq) {
    let measurements = {};
    await connection.query(`SELECT Temperature, Humidity, Time FROM ( SELECT @row := @row +1 AS rownum, Temperature, Humidity, Time FROM ( SELECT @row :=0) r, miTemp1 WHERE Time BETWEEN ${start} AND ${end}) ranked WHERE rownum % ${data_freq} = 1;`, function (error, results1, fields) {
        if (error) throw error;
        let i = 0, j = 0, maxT = results1[0].Temperature, minT = results1[0].Temperature,
            maxH = results1[0].Humidity, minH = results1[0].Humidity;

        while (i < results1.length) {
            let myDate = new Date(results1[i].Time * 1000);
            console.log("first", myDate.toLocaleString('tr-TR'));
            measurements[j] = results1[i];
            //console.log(typeof(results1[i].Temperature))
            if (j > 0) {
                if (measurements[j].Temperature > maxT) {
                    maxT = measurements[j].Temperature;
                }
                if (measurements[j].Temperature < minT) {
                    minT = measurements[j].Temperature;
                }
                if (measurements[j].Humidity > maxH) {
                    maxH = measurements[j].Humidity;
                }
                if (measurements[j].Humidity < minH) {
                    minH = measurements[j].Humidity;
                }
            }
            i++;
            j++;
        }
        myJSON.measurements_1 = measurements;
        myJSON.index_1 = j;
        myJSON.maxTemp_1 = maxT;
        myJSON.minTemp_1 = minT;
        myJSON.maxHum_1 = maxH;
        myJSON.minHum_1 = minH;

        picked_data = myJSON;


        console.log(new Date().toLocaleString('tr-TR') + '  Number of 1st measurement: ' + j);
    });
}

// async function timepickedQuery2(connection, start, end) {
//     let measurements = {};
//     console.log("cp102")
//     await connection.query(`SELECT Temperature, Humidity, Time FROM ( SELECT @row := @row +1 AS rownum, Temperature, Humidity, Time FROM ( SELECT @row :=0) r, miTemp2 WHERE Time BETWEEN ${start} AND ${end}) ranked WHERE rownum % 1000 = 1;`, function (error, results2, fields) {
//         if (error) throw error;
//         console.log("cp103")

//         let i = 0, j = 0, maxT = results2[0].Temperature, minT = results2[0].Temperature,
//             maxH = results2[0].Humidity, minH = results2[0].Humidity;

//         while (i < results2.length) {
//             let myDate = new Date(results2[i].Time * 1000);
//             console.log("second: ", myDate.toLocaleString('tr-TR'));
//             measurements[j] = results2[i];
//             if (j > 0) {
//                 if (measurements[j].Temperature > maxT) {
//                     maxT = measurements[j].Temperature;
//                 }
//                 if (measurements[j].Temperature < minT) {
//                     minT = measurements[j].Temperature;
//                 }
//                 if (measurements[j].Humidity > maxH) {
//                     maxH = measurements[j].Humidity;
//                 }
//                 if (measurements[j].Humidity < minH) {
//                     minH = measurements[j].Humidity;
//                 }
//             }
//             i++;
//             j++;
//         }
//         myJSON.measurements_2 = measurements;
//         myJSON.index_2 = j;
//         myJSON.maxTemp_2 = maxT;
//         myJSON.minTemp_2 = minT;
//         myJSON.maxHum_2 = maxH;
//         myJSON.minHum_2 = minH;

//         console.log(new Date().toLocaleString('tr-TR') + '  Number of 2nd measurement: ' + j);

//         picked_data = myJSON;
//         return 
//     });
// }

async function freqQuery1(connection, data_freq) {
    let measurements = {};
    await connection.query(`SELECT Temperature, Humidity, Time FROM ( SELECT @row := @row +1 AS rownum, Temperature, Humidity, Time FROM ( SELECT @row :=0) r, miTemp1 ) ranked WHERE rownum % ${data_freq} = 1;`,
        function (error, results1, fields) {
            if (error) throw error;
            let i = 0, j = 0, maxT = results1[0].Temperature, minT = results1[0].Temperature,
                maxH = results1[0].Humidity, minH = results1[0].Humidity;
            while (i < results1.length) {
                let myDate = new Date(results1[i].Time * 1000);
                measurements[j] = results1[i];
                //console.log(typeof(results1[i].Temperature))
                if (j > 0) {
                    if (measurements[j].Temperature > maxT) {
                        maxT = measurements[j].Temperature;
                    }
                    if (measurements[j].Temperature < minT) {
                        minT = measurements[j].Temperature;
                    }
                    if (measurements[j].Humidity > maxH) {
                        maxH = measurements[j].Humidity;
                    }
                    if (measurements[j].Humidity < minH) {
                        minH = measurements[j].Humidity;
                    }
                }
                i++;
                j++;
            }
            myJSON.measurements_1 = measurements;
            myJSON.index_1 = j;
            myJSON.maxTemp_1 = maxT;
            myJSON.minTemp_1 = minT;
            myJSON.maxHum_1 = maxH;
            myJSON.minHum_1 = minH;


            console.log(new Date().toLocaleString('tr-TR') + '  Number of 1st measurement: ' + j);
            new_chart_data = myJSON;

        });
}