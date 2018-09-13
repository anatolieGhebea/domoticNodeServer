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
var pushButton = new Gpio(17, 'in', 'rising'); //usa il pin GPIO 17 (11) come input, e reagisci quando il bottone viene rilasciato

pushButton.watch(function (err, value) { // osserva il bottone, e quando c'è un interrupt esegui la funzione
  if (err) { //se c'è stato un errore
    console.error('There was an error', err); // scrivi l'errore sulla console
  return;
  }
  // quando il bottone viene premuto e rilasciato, viene ricevuto 
  // il comando di cambiare il led di stato
  var state = LED.readSync(); // leggiamo lo stato attuale del LED e lo salviamo nella variabile
  var newState = 1 - (state ^ 1); // state può essere solo 1 o 0.
  // se il led è spento state sarà 0 => newState = 1 - 0 => 1 quindi dobbiamo accendere
  // se il led è acceso state sarà 1 => newState = 1 - 1 => 0 quindi dobbiamo spegniere
  LED.writeSync(newState); // applichiamo il nuovo stato al led 
});

function unexportOnClose() { //la funzione da eseguire quando si termina il programma
  LED.writeSync(0); // Spegni il LED
  LED.unexport(); // libera le risorse
  pushButton.unexport(); // libera le risorse allocate per il bottone
};

process.on('SIGINT', unexportOnClose); //la funzione da eseguire quando si preme ctrl+c  per uscire dal programma



// following leds fritzing foto
//https://www.w3schools.com/nodejs/img_raspberrypi3_led_flowing.png