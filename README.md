# Schadstoffkarte

![alt text](https://github.com/bassi23/Schadstoffkarte/blob/master/Vorschau.png)

# Wie funktioniert das?

Für das Projekt nutzen wir die Plattform "ThingSpeak" und den channel https://thingspeak.com/channels/697239 . Alle 30 Sekunden wird ein Messwert augenommen und an Thingspeak gesendet.
Das andere Programm ruft die Daten ab und stellt sie sowohl auf der Map, als auch in dem Graphen dar.
 


# To Do

## Software
[ ]   Heatmap-Farbe nicht abhängig von Anzahl der Messpunkte an einem Ort, sondern von ihrer Gewichtung (Konzentration)<br />
[ ]   Punktradius auf einem konstanten Wert beim zoomen halten<br />
[x]   Richtiger Zeitstempel in Graph (Punkte sind momentan äquidistant, obwohl nicht im gleichen Zeitabstand aufgenommen)<br />
[x]   Messwerte anzeigen, wenn man auf den jeweiligen Marker klickt<br />
[ ]   to do Liste erweitern<br />


## Hardware
[ ]   GPS - Genauigkeit verbessern<br />
[ ]   Datenübertragung sicherstellen (schmiert manchmal ab)<br />
[ ]   to do Liste erweitern<br />


# Verwendete Sensoren (aktiv)

## aktiv

 - BME680 (Bosch) für Temperatur, Luftfeuchte, Luftdruck, CO<br />
 - SCD30 (Sensirion) für CO2
 
 
## inaktiv, aber vorhanden

- Feinstaubsensor (Dust Sensor(PPD42NS) )

## inaktiv, in Planung

- NO2
- TVOC
