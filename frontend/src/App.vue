<script setup lang="ts">
import GraphData from '@/components/GraphData.vue'
</script>

<template>
  <header>
  </header>
  <main>
    <GraphData/>
  </main>
</template>

<style lang="scss">
#app {
  display: flex;
  font-family: Arial, sans-serif;

  .graph-container {
    flex: 1;
    overflow: auto;
  }

  .sidebar {
    width: 300px;
    padding: 20px;
    background-color: #f0f0f0;
    border-left: 1px solid #ccc;

    h2 {
      margin-top: 0;
    }

    button {
      margin-top: 10px;
    }
  }

  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 2px;
  }

  .node {
    circle {
      fill: #fff;
      stroke: steelblue;
      stroke-width: 3px;
      cursor: pointer;
    }

    text {
      font: 12px sans-serif;
    }
  }
}
</style>
