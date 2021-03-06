let a;
// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:

var map, heatmap;


let aktualisieren;
let zoom;
let cnv;

let xOffset = 0.4 * window.innerWidth;
let heatMapOrMarker;
let anzahlWerte;
let data;



function setup() {
  cnv = createCanvas(window.innerWidth / 3, 583);
  cnv.position(xOffset, 320);

  aktualisieren = createButton('Aktualisieren');
  aktualisieren.position(xOffset + 320, 600);
  aktualisieren.size(150, 50);
  aktualisieren.style('font-size', '20px')
  aktualisieren.mousePressed(function() {
    getPoints();
    initMap();
  });

  data = createSelect('Daten');
  data.option('Temperatur');
  data.option('Luftfeuchte');
  data.option('Luftdruck');
  data.option('CO');
  data.option('CO2');
  data.position(xOffset + 320, 130);

  anzahlWerte = createSelect('Anzahl Werte');
  anzahlWerte.option(1000);
  anzahlWerte.option(500);
  anzahlWerte.option(100);
  anzahlWerte.option(10);
  anzahlWerte.option(1);

  anzahlWerte.position(xOffset + 320, 190);



  heatMapOrMarker = createSelect('Heatmap oder Marker');
  heatMapOrMarker.option('Heatmap');
  heatMapOrMarker.option('Marker');

  heatMapOrMarker.position(xOffset + 320, 160);
  background(255, 10);
  fill(0);
  graph();
}


function graph(array) {
  let max = -Infinity;
  let min = Infinity;
  try {
    for (let i = 0; i < anzahlWerte.value(); i++) {
      if (parseFloat(array[i]) > max) {
        max = parseFloat(array[i]);
      }
      if (parseFloat(array[i]) < min) {
        min = parseFloat(array[i]);
      }
    }

    if (data.value() == "Luftfeuchte") {
      max = 100;
      min = 0;
    }
    let x = [];
    let y = [];
    let current;
    let time = [];
    for (let i = 0; i < anzahlWerte.value() - 1; i++) {
      time[i] = absoluteTime[i] - absoluteTime[0];
    }
    //  console.log(deltaTime)
    for (let i = 0; i < anzahlWerte.value(); i++) {

      y[i] = 400 - 200 * (parseFloat(array[i]) - min) / (max - min);
      x[i] = 10 + 400 * time[i] / time[anzahlWerte.value() - 2];
    }
    current = parseFloat(array[anzahlWerte.value() - 1]);
    fill(255);
    stroke(0);
    rect(10, 200, 400, 200);
    stroke(220);
    for (let i = 0; i < 9; i++) {
      line(40 + 40 * i, 200, 40 + 40 * i, 400);
      line(10, 220 + 20 * i, 410, 220 + 20 * i);
    }
    noStroke();
    fill(0);
    if (max != -Infinity) {
      text(nf(max, 0, 2), 40, 195);
      text(nf(min, 0, 2), 40, 419);
      text(day[anzahlWerte.value() - 1] + "." + month[anzahlWerte.value() - 1] + "." + year[anzahlWerte.value() - 1] + "\n" + hour[anzahlWerte.value() - 1] + ":" + minute[anzahlWerte.value() - 1] + " Uhr", 410, 450);
      text(day[0] + "." + month[0] + "." + year[0] + "\n" + hour[0] + ":" + minute[0] + " Uhr", 50, 450);
    }
    fill(0, 0, 255, 100);
    textSize(50);
    textAlign(CENTER);
    text(nf(current, 0, 2), 200, 310);

    textSize(20);
    stroke(255, 0, 0);
    strokeWeight(1.5);
    fill(255, 0, 0);
    for (let i = 0; i < anzahlWerte.value() - 1; i++) {
      line(x[i], y[i], x[i + 1], y[i + 1]);
      ellipse(x[i + 1], y[i + 1], 5, 5)
    }
    ellipse(x[0], y[0], 5, 5)
    fill(0);
  } catch (e) {}
  strokeWeight(1);
  noStroke();
}


function draw() {
  if (xOffset != 0.4 * window.innerWidth) {
    xOffset = 0.4 * window.innerWidth;
    aktualisieren.position(xOffset + 320, 600);
    data.position(xOffset + 320, 130);
    anzahlWerte.position(xOffset + 320, 190);
    heatMapOrMarker.position(xOffset + 320, 160);
  }
  background(255);
  textSize(20);
  text("Zeige an:", 60, 30);
  text("Als", 60, 60);
  text("Werte:", 60, 90);
  cnv.position(window.innerWidth / 2, 115);
  let auswahl = data.value();
  if (auswahl == "Temperatur") {
    graph(temperature);
    text("Temperatur [°C]", 200, 170);
  } else if (auswahl == "Luftfeuchte") {
    graph(humidity);
    text("Luftfeuchtigkeit [%]", 200, 170);
  } else if (auswahl == "Luftdruck") {
    graph(pressure);
    text("Luftdruck [hPa]", 200, 170);
  } else if (auswahl == "CO") {
    graph(co);
    text("CO [ppm]", 200, 170);
  } else if (auswahl == "CO2") {
    graph(co2);
    text("CO2 [ppm]", 200, 170);
  }
}

function initMap() {
  var sanFrancisco = new google.maps.LatLng(49.24686, 7.36977);
  map = new google.maps.Map(document.getElementById('map'), {
    center: sanFrancisco,
    zoom: 13,
    mapTypeId: 'satellite'
  });

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    dissipating: true
  });
  heatmap.setMap(map);
}


function toggleHeatmap() {
  heatmap.set('data', heatMapData);
  heatmap.setMap(map);
  //heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}


function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}


let position = [];
for (let i = 0; i < 1000; i++) {
  position[i] = [];
}

let heatMapData = [];
let temperature = [];
let humidity = [];
let pressure = [];
let co = [];
let co2 = [];
let createdAt = [];
let year = [];
let month = [];
let day = [];
let hour = [];
let minute = [];
let second = [];


let absoluteTime = [];

// Heatmap data: 500 Points
function getPoints() {
  let api_key = "OPDQ0ZDNC24Q70BG";
  let channel_id = "697239";
  let counts = String(anzahlWerte.value());
  $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/fields/6.json?results=' + counts, function(data) {
    for (let i = 0; i < data.feeds.length; i++) {
      position[i][0] = data.feeds[i].field6;
      year[i] = data.feeds[i].created_at.substring(0, 4);
      month[i] = data.feeds[i].created_at.substring(5, 7);
      day[i] = data.feeds[i].created_at.substring(8, 10);
      hour[i] = data.feeds[i].created_at.substring(11, 13);
      minute[i] = data.feeds[i].created_at.substring(14, 16);
      second[i] = data.feeds[i].created_at.substring(17, 19);
      createdAt[i] = data.feeds[i].created_at;
      let mon = 0;
      if (month[i] == "01" || month[i] == "03" || month[i] == "05" || month[i] == "07" || month[i] == "08" || month[i] == "10" || month[i] == "12") {
        mon = 31;
      } else if (month[i] == "04" || month[i] == "06" || month[i] == "09" || month[i] == "11") {
        mon = 30;
      } else {
        mon = 28;
      }
      absoluteTime[i] = parseInt(second[i]) + 60 * parseInt(minute[i]) + 3600 * parseInt(hour[i]) + 86400 * parseInt(day[i]) + mon * 86400 + (parseInt(year[i]) - 2019) * 365 * 24 * 60 * 60;
    }
  })
  $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/fields/7.json?results=' + counts, function(data) {
    for (let i = 0; i < data.feeds.length; i++) {
      position[i][1] = data.feeds[i].field7;
    }
  })
  $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/fields/1.json?results=' + counts, function(data) {
    for (let i = 0; i < data.feeds.length; i++) {
      temperature[i] = data.feeds[i].field1;
    }
  })
  $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/fields/2.json?results=' + counts, function(data) {
    for (let i = 0; i < data.feeds.length; i++) {
      humidity[i] = data.feeds[i].field2;
    }
  })
  $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/fields/3.json?results=' + counts, function(data) {
    for (let i = 0; i < data.feeds.length; i++) {
      pressure[i] = data.feeds[i].field3;
    }
  })
  $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/fields/4.json?results=' + counts, function(data) {
    for (let i = 0; i < data.feeds.length; i++) {
      co[i] = data.feeds[i].field4;
    }
  })
  $.getJSON('https://api.thingspeak.com/channels/' + channel_id + '/fields/5.json?results=' + counts, function(data) {
    for (let i = 0; i < data.feeds.length; i++) {
      co2[i] = data.feeds[i].field5;
    }
  })


  try {
    if (heatMapOrMarker.value() == "Heatmap") {
      for (let i = 0; i < parseInt(anzahlWerte.value()); i++) {
        heatMapData[i] = {
          location: new google.maps.LatLng(parseFloat(position[i][0]), parseFloat(position[i][1])),
          map: map,
          title: temperature[i],
          weight: parseFloat(temperature[i])
        }
      }
    } else {
      for (let i = 0; i < parseInt(anzahlWerte.value()); i++) {
        let infowindow = [];
        infowindow[i] = new google.maps.InfoWindow({
          content: "Temperatur = " + (nf(temperature[i], 0, 1)).toString() + " °C </br>" +
            "Luftfeuchtigkeit = " + (nf(humidity[i], 0, 1)).toString() + " %</br>" +
            "Luftdruck = " + (nf(pressure[i], 0, 1)).toString() + " hPa</br>" +
            "CO2 = " + (nf(co2[i], 0, 1)).toString() + " ppm </br>" +
            "CO = " + (nf(co[i], 0, 1)).toString() + " ppm </br>" +
            "aufgenommen am " + day[i].toString() + "." + month[i].toString() + "." + year[i].toString() + " um " + hour[i].toString() + ":" + minute[i].toString() + ":" + second[i].toString() + " Uhr"
        });

        heatMapData[i] = new google.maps.Marker({
          position: {
            lat: parseFloat(position[i][0]),
            lng: parseFloat(position[i][1])
          },
          map: map,
          title: temperature[i],
          weight: (temperature[i])
          //weight: parseFloat(temperature[i])
        });
        heatMapData[i].addListener('click', function() {
          infowindow[i].open(map, heatMapData[i]);
        });

      }
    }
  } catch (e) {
    console.log(e);
  }
  return heatMapData;
}