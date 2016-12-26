<template>
  <div>
    Creating words...
  </div>
</template>

<script>
  import {
    db
  }
  from '../fb';

  export default {
    created() {
      db.ref('words/english').set(['Car', 'Seldgehammer', 'Thief', 'Snake', 'Brain', 'Book', 'Pipe', 'Sun', 'Moon', 'Africa', 'Donald Trump', 'Road', 'USA', 'Cheese slicer']);
      db.ref('words/norsk').set(['Båt', 'Hus', 'Blomst', 'Kake', 'Sverige', 'Norge', 'Kamel', 'Dromedar', 'Bie', 'Katt', 'Hund', 'Pølse', 'Donald Trump', 'Ubåt', 'Hval', 'Rundkjøring', 'Ålesund', 'Skolisse', 'Saks', 'Melk', 'Blomsterpotte', 'Sommerfugl', 'Hoppeslott',
        'Appelsin',
        'Arm',
        'Ark',
        'Apekatt',
        'Askebeger',
        'Akebrett',
        'Arfika',
        'Amerika',
        'Australia',
        'Bart',
        'Bæsj',
        'Boksehanske',
        'Dass',
        'Dilbert',
        'Domino',
        'Fugl',
        'Fakkel',
        'Flaggstang',
        'Fiskestang',
        'Fiskepinner',
        'Foss',
        'Fiskekort',
        'Garasje',
        'Gris',
        'Gangamstyle',
        'Gulrot',
        'Gress',
        'Gjerde',
        'Hest',
        'Hellig',
        'Hulder',
        'Hatt',
        'Jakke',
        'Kalkulator',
        'Kamera',
        'Klokke',
        'Kakkerlakk',
        'Lampe',
        'Lege',
        'Lommerusk',
        'Lus',
        'Limpinne',
        'Lysestake',
        'Mammut',
        'Mars',
        'Meksikaner',
        'Murvegg',
        'Mus',
        'Murstein',
        'Nisse',
        'Nilen',
        'Pakke',
        'Petrine',
        'Potet',
        'Palle',
        'Pepperkakemann',
        'Pizza',
        'Pinnsvin',
        'Pute',
        'Rev',
        'Rakett',
        'Romvesen',
        'Rompeakebrett',
        'Sag',
        'Sangbok',
        'Traktor',
        'Ulv',
        'Ugle',
        'Vekt',
        'Verden',
        'Vaktbod',
        'Vindussprosse',
        'Ylvisbrørdrene',
        'Kanin',
        'Katapult',
        'Kraftverk',
        'Prest',
        'Telefon',
        'Troll'
      ]);
      db.ref('words/voksne').set(['Tisselur', 'Fisk', 'Banan', 'Meloner', 'Apekatt', 'Tungekyss', 'Fødsel', 'Sikle', 'Hender', 'Rumpe', 'Rygg', 'Navle', 'Statskupp', 'Tuba']);
    }
  };
</script>
