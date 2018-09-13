# Step 1 
## Facciamo lampeggiare un led

Nel primo step vediamo come controllare i pin GPIO del raspberry, partiamo da un esempio molto semplice che farà lampeggiare un led connesso al pin GPIO 4 (corrispondente al pin fisico 7).


![collegamenti fisici](/img/rasp_one_led_bb.png)

__vedere il file blink_led.js__


## Ora controliamo lo stato del led con un tasto fisico

Vediamo ora come controllare il led tramite un pulsante collegato al GPIO 17 (pin fisico 11),
nella prima versione il led resterà accesso per il tempo che il pulsante fisico sarà premotu, mentre la seconda versione ad ogni click del bottone il led cambierà stato, da spento ad acceso e riceversa.

![collegamenti fisici](/img/rasp_one_led_btn_bb.png)

__per la versione 1 vedere il file control_led.js__

__per la versione 2 vedere il file toggle_led.js__