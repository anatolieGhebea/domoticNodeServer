/**
 * Questo codice è ispirato alla guida https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp
 * quindi il mio contributo si riduce alla traduzione dei commenti e qualche piccolo adattamento qua e là.
 */

var http = require('http').createServer(handler); //import il modulo http server, e crea il server con la funzione handler()
var fs = require('fs'); //importa il modulo per la gestione del filesystem

var io = require('socket.io')(http) //importa il modulo socket.io e passa l'oggetto http (server)
var Gpio = require('pigpio').Gpio; //include onoff to interact with the GPIO

// variabili per il led mono colore
var LED = new Gpio(4, { mode: Gpio.OUTPUT }); //usa il pin GPIO 4 (fisico 7), e specifica che deve essere usato in USCITA 
var pushButton = new Gpio(17, 'in', 'rising'); //usa il pin GPIO 17 (11) come input, e reagisci quando il bottone viene rilasciato
//variabili led rgb
ledRed = new Gpio(16, {mode: Gpio.OUTPUT}), //usa il pin GPIO 16 (fisico 36), in uscita, ROSSO
ledGreen = new Gpio(20, {mode: Gpio.OUTPUT}), //usa il pin GPIO 20 (fisico 38), in uscita, VERDE
ledBlue = new Gpio(21, {mode: Gpio.OUTPUT}), //usa il pin GPIO 21 (fisico 40), in uscita, BLU

redRGB = 255, //imposta il valore iniziale a spento (255 per anodo comune/[+])
greenRGB = 255, //imposta il valore iniziale a spento (255 per anodo comune/[+])
blueRGB = 255; //imposta il valore iniziale a spento (255 per anodo comune/[+])
//RESETTA I LED RGB 
ledRed.digitalWrite(1); //Spegni il Led Rosso
ledGreen.digitalWrite(1); //Spegni il Led Verde
ledBlue.digitalWrite(1); //Spegni il Led Blu


http.listen(8080); //ascolta sulla porta 8080
// quindi nel browser scriveremo "192.168.1.130:8080"
// sostituire 192.168.1.130 con l'indirizzo ip effettivo del 
// raspberry  

function handler (req, res) { //la funzione che crea il server
  fs.readFile(__dirname + '/public/plusrgb.html', function(err, data) { //leggi il file index.html nella cartella public
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //componi la testa per la risposta
    res.write(data); //scrivi il contenuto dal file index.html
    return res.end(); //termina la risposta al client
  });
} 

io.sockets.on('connection', function (socket) {//Alla connessione  WebSocket
    var lightvalue = 0; //variabile che tiene memorizzata lo stato del led
    pushButton.watch(function (err, value) { //osserva il bottone, quando arriva l'interrupt esegue la funzione
        if (err) { //se ci sono errori
            console.error('There was an error', err); //stampa sulla console l'errore
            return;
        }
        lightvalue = value;
        socket.emit('light', lightvalue); //invia al client lo stato del bottone
    });

    socket.on('light', function(data) { //riceve dal client lo stato del bottone(virtuale)
        lightvalue = data; 
        if (lightvalue != LED.readSync()) { //aggiorna lo stato del LED solo se è cambiato
            LED.writeSync(lightvalue); //accendi o spegni il led.
        }
    });

    socket.on('rgbLed', function(data) { //leggi lo stato dei cursori dal client
        console.log(data); //stampa i dati provenienti dalla websocket in cnsole
    
        // per i Led RGB con anodo comune  255 è totalmente spento, e 0 è totalmente acceso,
        // quindi dobbiamoimpostare i valori dal client
        redRGB=255-parseInt(data.red);
        greenRGB=255-parseInt(data.green);
        blueRGB=255-parseInt(data.blue);
    
        console.log("rbg: " + redRGB + ", " + greenRGB + ", " + blueRGB); //stampa i valori convertiti sulla console
    
        ledRed.pwmWrite(redRGB); //imposta il colore Rosso al valore ricevuto
        ledGreen.pwmWrite(greenRGB); //imposta il colore Verde al valore ricevuto
        ledBlue.pwmWrite(blueRGB); //imposta il colore Blu al valore ricevuto
      });

});
  
process.on('SIGINT', function () { //quando si preme ctrl+c
    LED.writeSync(0); // Spegni il led
    LED.unexport(); // libera le risorse
    pushButton.unexport(); // libera le risorse allocate per il bottone
    
    ledRed.digitalWrite(1); // Spegni il led Rosso
    ledGreen.digitalWrite(1); // Spegni il led Verde
    ledBlue.digitalWrite(1); // Spegni il led Blue

    process.exit(); //esci dal programma
});   