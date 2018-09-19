/**
 * Questo codice è ispirato alla guida https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp
 * quindi il mio contributo si riduce alla traduzione dei commenti e qualche piccolo adattamento qua e là.
 */

var http = require('http').createServer(handler); //import il modulo http server, e crea il server con la funzione handler()
var fs = require('fs'); //importa il modulo per la gestione del filesystem
var url = require('url');

var io = require('socket.io')(http) //importa il modulo socket.io e passa l'oggetto http (server)
var Gpio = require('pigpio').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, { mode: Gpio.OUTPUT }); //usa il pin GPIO 4 (fisico 7), e specifica che deve essere usato in USCITA 
var pushButton = new Gpio(17, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE
  }); //usa il pin GPIO 17 (11) come input, e reagisci quando il bottone viene rilasciato


http.listen(8080); //ascolta sulla porta 8080
// quindi nel browser scriveremo "192.168.1.130:8080"
// sostituire 192.168.1.130 con l'indirizzo ip effettivo del 
// raspberry  

function handler (req, res) { //la funzione che crea il server
    var page = url.parse(req.url).pathname;

    if(page == '/'){
      fs.readFile(__dirname + '/public/index.html', function(err, data) { //leggi il file index.html nella cartella public
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
          return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
        res.write(data); //write data from index.html
        return res.end();
      });
    }else if(page == '/js/socket.io.js'){
        fs.readFile(__dirname + '/js/socket.io.js', function(err, data) { //leggi il file socket.io.js nella cartella js
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
                return res.end("404 Not Found");
            }
            
            res.writeHead(200, {'Content-Type': 'text/javascript'}); 
            res.write(data); //write data from index.html
            return res.end();
        });
    }else if(page == '/js/socket.io.js.map'){
        fs.readFile(__dirname + '/js/socket.io.js.map', function(err, data) { //leggi il file socket.io.js nella cartella js
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
                return res.end("404 Not Found");
            }
            
            res.writeHead(200, {'Content-Type': 'text/javascript'}); 
            res.write(data); //write data from index.html
            return res.end();
        });
    }else{
        res.writeHead(200, {'Content-Type': 'text/html'}); //componi la testa per la risposta
        res.write(data); //scrivi il contenuto dal file index.html
        return res.end(); //termina la risposta al client
    }  
} 


io.sockets.on('connection', function (socket) {//Alla connessione  WebSocket
    var lightvalue = 0; //variabile che tiene memorizzata lo stato del led
    pushButton.on('interrupt', function(err, value) { //osserva il bottone, quando arriva l'interrupt esegue la funzione
        if (err) { //se ci sono errori
            console.error('There was an error', err); //stampa sulla console l'errore
            return;
        }
        lightvalue = value;
        socket.emit('light', lightvalue); //invia al client lo stato del bottone
    });

    socket.on('light', function(data) { //riceve dal client lo stato del bottone(virtuale)
        lightvalue = data; 
        if (lightvalue != LED.digitalRead()) { //aggiorna lo stato del LED solo se è cambiato
            LED.digitalWrite(lightvalue); //accendi o spegni il led.
            console.log('new state ' + lightvalue);
            
        }
    });

});
  
process.on('SIGINT', function () { //quando si preme ctrl+c
    process.exit(); //esci dal programma
});   
