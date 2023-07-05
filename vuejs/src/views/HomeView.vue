<template>
  <header id="headerHome">
    <span>LOGO</span>
    <div>
      <a href="/login" id="buttonLogin">Connexion</a>
      <a href="/register" id="buttonRegister">Inscription</a>
    </div>
  </header>

  <main>
    <section id="homePresentation">
      <h1>Bienvenue dans le monde du Défi de Mémoire !</h1>
      <p>Le jeu de mémoire ultime vous attend, prêt à mettre vos capacités de concentration et de rappel à l'épreuve</p>
      <a href="/login">Jouer</a>
    </section>
    <div class="des-container-home bg-img-container">
    </div>
    <div class="crayon-container-home bg-img-container">
    </div>
    <div class="dollars-container-home bg-img-container">
    </div>
  </main>
</template>

<script setup>

import './../styles/home.css';
</script>