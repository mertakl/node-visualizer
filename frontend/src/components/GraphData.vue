<template>
  <div id="app">
    <div class="graph-container">
      <svg ref="svg"></svg>
    </div>
    <div v-if="selectedNode" class="sidebar">
      <h2>{{ selectedNode.name }}</h2>
      <p>{{ selectedNode.description }}</p>
      <button @click="deselectNode">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import axios from 'axios';
import * as d3 from 'd3';

interface Node {
  name: string;
  description: string;
  children: string[];
}

export default defineComponent({
  name: 'App',
  setup() {
    const svg = ref<SVGElement | null>(null);
    const selectedNode = ref<Node | null>(null);

    const fetchData = async () => {
      try {
        const response = await axios.get<Node[]>(import.meta.env.VITE_API_URL);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    };

    const renderGraph = (data: Node[]) => {
      if (!svg.value) return;

      const width = 800;
      const height = 600;

      const tree = d3.tree<Node>().size([height, width - 200]);
      const root = d3.stratify<Node>()
        .id(d => d.name)
        .parentId(d => data.find(node => node.children.includes(d.name))?.name)
        (data);

      const treeData = tree(root);

      const g = d3.select(svg.value)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(100,0)');

      g.selectAll('.link')
        .data(treeData.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal<any, any>()
          .x(d => d.y)
          .y(d => d.x));

      const node = g.selectAll('.node')
        .data(treeData.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

      node.append('circle')
        .attr('r', 10)
        .on('click', (event, d) => {
          selectedNode.value = d.data;
        });

      node.append('text')
        .attr('dy', '.35em')
        .attr('x', d => d.children ? -13 : 13)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);
    };

    const deselectNode = () => {
      selectedNode.value = null;
    };

    onMounted(async () => {
      const data = await fetchData();
      renderGraph(data);
    });

    return {
      svg,
      selectedNode,
      deselectNode,
    };
  },
});
</script>
