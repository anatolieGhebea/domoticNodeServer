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
cambia solo il comando per individuare la microSd (diskutil list) e il path per la microSd che diventa del tipo (/dev/disk{numero}), per il resto la procedura è uguale.
![comando dd ](/img/cmd_dd.png)


## Primo Avvio
Inserire la scheda nel raspberry e avviarlo e collegare l'alientazione, Seguire la procedura di configurazione standard, cioè impostare paese, lingua, timezone, password per l'utente root e la connessione wifi. 
__ In questa fase sarà molto comodo avere un schermo da collegare alla porta hdmi una tastiera e un mouse esterno. __

Abilitiamo il modulo ssh, per poter controllare il raspberry da un altro pc.
Apriamo il terminale e lanciamo il comando:
```
sudo raspi-config
```
* selezioniamo Interfacing Options
* SH
* Yes/Si
* OK
* Finish

da ora in poi potremmo controllare il raspberry da un'altro pc, per farlo recuperiamo il suo indirizzo IP con il commando 
```
ifconfig
```
e cerchiamo la proprietà inet che sarà del tipo 192.168.1.x
![comand ifconfig](/img/cmd_ifconfig.png)

trovato l’indirizzo ip ci colleghiamo al raspberry:
![comand ssh](/img/cmd_ssh.png)

Per evitare di cercare l’indirizzo ip ogni volta, andiamo a settare l’ip fisso nel raspberry, andiamo quindi a modificare il file /etc/dhcpcd.conf tramite il seguente comando:
```
sudo nano /etc/dhcpcd.conf
```
Andiamo in fondo al file a aggiungiamo la nostra configurazione,
![static ip configuration](/img/static_ip.png)
una volta fatto cliccare ctr+o per salvare le modifiche ctr+x per uscire e sudo reboot per riavviare il raspberry.
Ora dovremmo essere in grado di raggiungere il raspberry tramite l’ip 192.168.1.130 (se collegato in wifi) e 192.168.1.30 (se collecato via cavo ethernet).

## Installazione nodejs
Andiamo a installare Nodejs, che ci servirà per creare il nostro server domotico.
Da terminale lanciamo il comando:
```
sudo apt-get install nodejs
```

Successivamente installiamo npm, che è il gestore dei pacchetti di nodejs, e ci servirà per installare vari moduli quando andremo a lavorare con nodejs.
```
sudo apt-get install npm
```
aggiornare npm all’ultima versione con 
```	
sudo npm install -g npm
```



## extra info

Potete consultare questo [link](https://www.w3schools.com/nodejs/nodejs_raspberrypi_gpio_intro.asp), del w3schools, per avere lo schema dei pin GPIO e fisici del raspberry pi. Oppure cercate semplicemente su google 'raspberry pi gpio'
