<template>
  <div>
    Creating words...
  </div>
</template>

<script>
  import {db} from '../fb';

  export default{
    created() {
      db.ref('words/norsk').set(['Båt', 'Hus', 'Blomst', 'Kake', 'Sverige', 'Norge', 'Kamel', 'Dromedar', 'Bie', 'Katt', 'Hund', 'Pølse', 'Donald Trump', 'Johaug', 'Avento', 'Ubåt', 'Hval', 'Rundkjøring', 'Ålesund', 'Joggesko', 'Saks', 'Melk']);
    }
  }

</script>
