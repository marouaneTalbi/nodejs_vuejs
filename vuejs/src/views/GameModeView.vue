<template>
  <section id="sectionGameMode">
    <section class="card-game-mode">
      <div class="bg-img-container sword-img"></div>
      <h1>RANKED</h1>
      <span>
        La ranked est un mode de jeu compétitif où les joueurs s'affrontent pour grimper dans un classement basé sur leurs performances.
      </span>
    </section>
    <section class="card-game-mode">
      <div class="bg-img-container shield-img"></div>
      <h1>UNRANKED</h1>
      <span>L'unranked est un mode de jeu décontracté où les joueurs peuvent jouer sans se soucier d'un classement ou d'un niveau de compétition spécifique.</span>
    </section>
    <section class="card-game-mode">
      <div class="bg-img-container battle-helmet-img"></div>
      <h1>PRIVATE</h1>
      <span>Le mode de jeu "private" permet aux joueurs de créer des parties privées et restreintes, où seuls les joueurs invités peuvent participer.</span>
    </section>
  </section>
</template>

<script setup>
  import './../styles/home.css';
  import './../styles/gameMode.css';
</script>