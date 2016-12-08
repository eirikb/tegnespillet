<template>
  <div>
    Creating words...
  </div>
</template>

<script>
  import { db } from '../fb';

  export default {
    created() {
      db.ref('words/english').set(['Car', 'Seldgehammer', 'Thief', 'Snake', 'Brain', 'Book', 'Pipe', 'Sun', 'Moon', 'Africa', 'Donald Trump', 'Road', 'USA', 'Cheese slicer']);
      db.ref('words/norsk').set(['Båt', 'Hus', 'Blomst', 'Kake', 'Sverige', 'Norge', 'Kamel', 'Dromedar', 'Bie', 'Katt', 'Hund', 'Pølse', 'Donald Trump', 'Johaug', 'Avento', 'Ubåt', 'Hval', 'Rundkjøring', 'Ålesund', 'Joggesko', 'Saks', 'Melk']);
      db.ref('words/voksne').set(['Tisselur', 'Fisk', 'Banan', 'Meloner', 'Apekatt', 'Tungekyss', 'Fødsel', 'Sikle', 'Hender', 'Rumpe', 'Rygg', 'Navle', 'Statskupp', 'Tuba']);
    }
  };
</script>
