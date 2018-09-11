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
var pushButton = new Gpio(17, 'in', 'both'); //usa il pin GPIO 17 (11) come input, e reagisci sia quando si preme il bottone sia quando lo si rilascia

pushButton.watch(function (err, value) { // osserva il bottone, e quando c'è un interrupt esegui la funzione
  if (err) { //se c'è stato un errore
    console.error('There was an error', err); // scrivi l'errore sulla console
  return;
  }
  LED.writeSync(value); //accendi o spegni il LED in base allo stato del bottone
  // quando si preme il pulsante, arriva un interrupt che annuncia il cambiamento di stato (premoto)
  // quindi il suo valore è 1
  // quando il tasto viene rilasciato arriva un interrupt che annuncia il cambiamento di stato (rilasciato)
  // quindi il valore è 0
});

function unexportOnClose() { //la funzione da eseguire quando si termina il programma
  LED.writeSync(0); // Spegni il LED
  LED.unexport(); // libera le risorse
  pushButton.unexport(); // libera le risorse allocate per il bottone
};

process.on('SIGINT', unexportOnClose); //la funzione da eseguire quando si preme ctrl+c  per uscire dal programma