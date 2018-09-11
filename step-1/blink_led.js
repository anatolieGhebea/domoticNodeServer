/**
 * Questo codice è ispirato alla guida https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp
 * quindi il mio contributo si riduce alla traduzione dei commenti e qualche piccolo adattamento qua e là.
 */


// var Gpio = require('onoff').Gpio; 
// invece che includere la la libreria "onoff" andiamo a includere 
// direttamente la libreria "pigpio" perchè ci permette una maggior flessibilità
// potrebbe essere necessario lanciare un "sudo apt-get update" e "sudo apt-get install pigpio"
// per installare la libreria C del GPIO
// per installare libreria node basta fare "npm install pigpio"
var Gpio = require('pigpio');   

var LED = new Gpio(4, { mode: Gpio.OUTPUT }); //usa il pin GPIO 4 (fisico 7), e specifica che deve essere usato in USCITA 
var blinkInterval = setInterval(blinkLED, 500); //impostiamo un interlavllo di 500ms (mezzo secondo)

function blinkLED() { //la funzione che farà lampeggiare il led
  if (LED.readSync() === 0) { //controlla lo stato del pin, se lo stato è zero 0 (o spento)
    LED.writeSync(1); //imposta lo sato del pin a 1 (accendi il LED )
  } else {
    LED.writeSync(0); //imposta lo stato del pin a 0 (spegni il LED )
  }
}

function endBlink() { //la funzione per fermare il lampeggio
  clearInterval(blinkInterval); // cancella l'intervallo di esecuzione
  LED.writeSync(0); // Spegni il LED
  LED.unexport(); // libera le risorse
}

setTimeout(endBlink, 10000); //ferma il lampeggio dopo 10 secondi