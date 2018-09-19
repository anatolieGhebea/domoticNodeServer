/**
 * Questo codice è ispirato alla guida https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp
 * quindi il mio contributo si riduce alla traduzione dei commenti e qualche piccolo adattamento qua e là.
 */

var http = require('http').createServer(handler); //import il modulo http server, e crea il server con la funzione handler()
var fs = require('fs'); //importa il modulo per la gestione del filesystem
var url  = require('url');
var io = require('socket.io')(http) //importa il modulo socket.io e passa l'oggetto http (server)
var Gpio = require('pigpio').Gpio; //include onoff to interact with the GPIO

// variabili per il led mono colore
var LED = new Gpio(4, { mode: Gpio.OUTPUT }); //usa il pin GPIO 4 (fisico 7), e specifica che deve essere usato in USCITA 
var pushButton = new Gpio(17, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_OFF,
  edge: Gpio.RISING_EDGE
}); //usa il pin GPIO 17 (11) come input, e reagisci quando il bottone viene rilasciato

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

  var page = url.parse(req.url).pathname; 
  if(page == '/'){
    fs.readFile(__dirname + '/public/plusrgb.html', function(err, data) { //leggi il file index.html nella cartella public
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
          res.write(data); //write data from socket.io
          return res.end();
      });
  }else if(page == '/js/socket.io.js.map'){
      fs.readFile(__dirname + '/js/socket.io.js.map', function(err, data) { //leggi il file socket.io.js nella cartella js
          if (err) {
              res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
              return res.end("404 Not Found");
          }
          
          res.writeHead(200, {'Content-Type': 'text/javascript'}); 
          res.write(data); //write data from socket.map
          return res.end();
      });
  }else if(page == '/js/w3color.js'){
    fs.readFile(__dirname + '/js/w3color.js', function(err, data) { //read file index.html in public folder
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/javascript'}); //write HTML
      res.write(data); //write data from w3color
      return res.end();
    }); 
  }else{
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
  }  

} 

io.sockets.on('connection', function (socket) {//Alla connessione  WebSocket
    var lightvalue = 0; //variabile che tiene memorizzata lo stato del led
    pushButton.on('interrupt', function(value) { //osserva il bottone, quando arriva l'interrupt esegue la funzione
        lightvalue = value;
        socket.emit('light', lightvalue); //invia al client lo stato del bottone
    });

    socket.on('light', function(data) { //riceve dal client lo stato del bottone(virtuale)
      lightvalue = data; 
      if (lightvalue != LED.digitalRead()) { //aggiorna lo stato del LED solo se è cambiato
          LED.digitalWrite(lightvalue); //accendi o spegni il led.
          console.log('new state ' + lightvalue);
          socket.broadcast.emit('light', lightvalue);
          
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

        socket.broadcast.emit('rgbLed', data);
      });

});
  
process.on('SIGINT', function () { //quando si preme ctrl+c
    LED.digitalWrite(0); // Spegni il led
    ledRed.digitalWrite(1); // Spegni il led Rosso
    ledGreen.digitalWrite(1); // Spegni il led Verde
    ledBlue.digitalWrite(1); // Spegni il led Blue

    process.exit(); //esci dal programma
});   