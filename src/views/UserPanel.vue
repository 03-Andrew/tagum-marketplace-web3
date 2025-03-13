<template>
    <main class="panel-container">
        <navbar class="navbar"/>
        <headers class="headers"/>
        <router-view class="router-view shadow-[inset_6px_6px_7px_0px_#00000024]"/>

    </main>
  </template>
  
  <style scoped>
  .navbar{
    grid-row: 1/ span 2;
    grid-column: 1;
    height:100%;
    padding:0 !important;
  }

  .headers{
    grid-column: 2;
    grid-row:1;
  }

  .router-view {
    
    border-top-left-radius: 10px;
    background: linear-gradient(to right, #3d2929, #311b1b); 

    overflow: auto;
    grid-row:2;
    grid-column: 2;
  }
  .panel-container {
    overflow: hidden;
    display: grid;
    grid-gap:0;
    background-color: #614242;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    height:100vh;
  }
  </style>