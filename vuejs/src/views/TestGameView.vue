<template>
  <section id="gameCardSection">
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
    <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
    <section class="card-section">
      <div class="bg-img-container div-card"></div>
    </section>
  </section>
</template>

<script setup> import './../styles/global.css'; </script>

<script>

let arrayCard = [
    'card-game-bomb',
    'card-game-box',
    'card-game-crayon',
    'card-game-hand',
    'card-game-flag',
    'card-game-envelop',
    'card-game-maps',
    'card-game-horseshoe',
    'card-game-des',
    'card-game-dollard',
    'card-game-bomb',
    'card-game-box',
    'card-game-crayon',
    'card-game-hand',
    'card-game-flag',
    'card-game-envelop',
    'card-game-maps',
    'card-game-horseshoe',
    'card-game-des',
    'card-game-dollard'
  ];

  let cardsArray = shuffleArray(arrayCard);
  function shuffleArray(array) {
    // Créer une copie du tableau d'origine
    var shuffledArray = array.slice();

    // Appliquer l'algorithme de Fisher-Yates pour mélanger le tableau
    for (var i = shuffledArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[j];
      shuffledArray[j] = temp;
    }

    return shuffledArray;
  }

  let divCard = document.getElementsByClassName('div-card');
  let sectionCard = document.getElementsByClassName('card-section');

  window.addEventListener('load', function() {
    for (let i = 0; i < divCard.length; i++){
      let classElement = divCard[i].getAttribute("class");
      divCard[i].setAttribute("class", classElement + ' ' + cardsArray[i]);
    }
  });

  console.log(divCard);

  const cards = document.getElementsByClassName('div-card');
console.log(cards);

window.addEventListener('DOMContentLoaded', () => {
  const cartes = document.querySelectorAll('.div-card');

  cartes.forEach((carte, index) => {
    const delay = (index + 1) * 1000;

    //setTimeout(() => {
      carte.style.animationPlayState = 'running';
      carte.addEventListener('animationend', () => {
        carte.style.animationPlayState = 'paused';
        carte.classList.remove('carte-animation');
      }, { once: true });
    //}, delay);
  });
});

</script>

<style>
  #gameCardSection{
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .card-section{
    width: 200px;
    height: 130px;
    border: solid 1px;
    flex-basis: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-game-horseshoe{
    background-image: url("@/styles/images/horseshoe.png");
  }

  .card-game-dollard{
    background-image: url("@/styles/images/dollard_card2.png");
  }

  .card-game-des{
    background-image: url("@/styles/images/des_card2.png");
  }

  .card-game-maps{
    background-image: url("@/styles/images/maps_card.png");
  }

  .card-game-flag{
    background-image: url("@/styles/images/flag_card.png");
  }

  .card-game-crayon{
    background-image: url("@/styles/images/crayon_card2.png");
  }

  .card-game-box{
    background-image: url("@/styles/images/box.png");
  }

  .card-game-bomb{
    background-image: url("@/styles/images/bomb.png");
  }

  .card-game-envelop{
    background-image: url("@/styles/images/envelop.png");
  }

  .card-game-hand{
    background-image: url("@/styles/images/hand.png");
  }

  .card-section > div {
    width: 100px;
    height: 100px;
  }

  @keyframes rotation {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(-180deg);
    }
  }

  .div-card{
    animation: rotation 1s linear forwards;
    animation-play-state: paused;
  }

  .card.flipped {
    background-image: url('@/styles/images/card_back.png');
    background-size: cover;
  }

</style>