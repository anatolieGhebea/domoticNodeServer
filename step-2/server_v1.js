/**
 * Questo codice è ispirato alla guida https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp
 * quindi il mio contributo si riduce alla traduzione dei commenti e qualche piccolo adattamento qua e là.
 */


var http = require('http').createServer(handler); //import il modulo http server, e crea il server con la funzione handler()
var fs = require('fs'); //importa il modulo per la gestione del filesystem

http.listen(8080); //ascolta sulla porta 8080
// quindi nel browser scriveremo "192.168.1.130:8080"
// sostituire 192.168.1.130 con l'indirizzo ip effettivo del 
// raspberry  

function handler (req, res) { //la funzione che crea il server
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //leggi il file index.html nella cartella public
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); //componi la testa per la risposta
    res.write(data); //scrivi il contenuto dal file index.html
    return res.end(); //termina la risposta al client
  });
} 