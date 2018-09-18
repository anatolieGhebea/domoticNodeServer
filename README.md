# domoticNodeServer
Questa repository contiene frammenti di codice per un "server domotico" che gira su un raspberry pi. 

# Preparazione raspberry pi 
## Installare raspian sulla microSd
dopo aver scaricato l'immagine dal sito di [raspian](https://www.raspberrypi.org/downloads/raspbian/)
installarla sulla microsd. 
### Da Linux seguire i seguenti passi:
* nella cartella dove si trova il file appena scaricato lanciare il comando 
    ```
     tar -xzf 2018-06-27-raspbian-stretch.zip
    ```
* a questo punto dovremmo trovarci 2018-06-02-raspbian-stretch.img
* inseriamo la microsd e formattiamola in MS-DOS
* con il commando ``` df -h ``` andiamo ad individuare la nostra microSd solitamente è del tipo /dev/sd{lettera b,c,...} 
* una volta trovata la partizione, lanciamo il comando di copia dell'immagine
    ```
    sudo dd if=/{path}/raspian.img of=/dev/sd{lettera}
    ```
* il processo può impiegarci anhce un'ora di tempo, quindi siate pazienti

### Da Mac 
cambia solo il comando per individuare la microSd e il path per la microSd, per il resto la procedura è uguale.
![comando dd ][/img/cmd_dd.jpg]

## extra info

Potete consultare questo [link](https://www.w3schools.com/nodejs/nodejs_raspberrypi_gpio_intro.asp), del w3schools, per avere lo schema dei pin GPIO e fisici del raspberry pi. Oppure cercate semplicemente su google 'raspberry pi gpio'
