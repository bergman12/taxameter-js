* Skal have følgende felter
* - turStartetTidspunkt: et dato objekt for hvornår turen er startet. 
*   Hvis turen ikke er startet, er den undefined
* - afstand: hvor langt taxaen har kørt i KM. Denne værdi sendes til scriptet
*   udefra (i dette tilfælde fra funktionen start(Taxameter), som ligger i 
*   library-mappen, og som er det script, der styrer applikationen).
* 
* Skal have følgende metoder/funktioner, som alle kaldes fra start.js
* - startTur(): sætter turStartetTidspunkt til nuværende tidspunkt
* - slutTur(): skal nulstille taxameteret 
*   ved at  sætte turStartetTidspunkt til undefined og afstand til 0
* - koer(delta_afst): skal tælle afstand op med det ekstra antal km, som
*   bilen har kørt siden sidste beregning. 
* - beregnPris(): skal returnere prisen beregnet udfra taxaselskabets prissætning
*/
class RealClock {
   now() {
       return new Date();
   }
}

class FakeClock {
   constructor() {
       this.time = new Date();
   }
   now() {
       return this.time;
   }
   forward(minutter) {
       this.time.setMinutes(this.time.detMinutes() + minutter)
   }
}
var clock = new RealClock();
/*Her laves klassen Taxameter, som skal opsætte funktionerne i ligninger, 
der skal udregne de forskellige parametre i taxameteret.
Disse funktioner kaldes i start.js, som opsætter hele programmet*/
class Taxameter {
   //Constructoren definere hvilke dele vi, på tværs af js-filerne, kan kalde.
   constructor(clock, priceStrategy) {
       this.clock = clock;
       this.afstand = 0;
       this.turStartetTidspunkt = undefined;
       this.priceStrategy = priceStrategy;
   }
   //StartTur starter klokken når turen startes.
   startTur() {
       this.turStartetTidspunkt = this.clock.now();
   }
   //Når turen sluttes, nulsilles alt.
   slutTur() {
       this.afstand = 0;
       this.turStartetTidspunkt = undefined;
   }
   //Laver km-beregneren, som er opsat inde i start.js.
   koer(delta_afst) {
       this.afstand += delta_afst * 5;
   }
   /*Her laves den overordnede beregning af priserne for de forskellige biler.
   Når turen er startet, begynder min pricestrategy. Her kalder jeg 2 variable, 
   som er defineret ved tidImin og afstandKm. De kaldes så i bilernes js-fil, 
   hvor varablerne sættes ind i en ligning*/
   beregnPris() {
       if (this.turStartetTidspunkt == undefined) {
           return 0;
       }
       var tidImin = (this.clock.now() - this.turStartetTidspunkt)/ 1000 /60;
       var afstandKm = this.afstand;
       return this.priceStrategy.beregnPris(tidImin, afstandKm);
   }
}