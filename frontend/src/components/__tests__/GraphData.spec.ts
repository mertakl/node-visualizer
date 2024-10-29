import {afterEach, beforeEach, describe, expect, it, type Mock, vi} from 'vitest';
import App from '@/App.vue';
import * as d3 from 'd3';
import {mount} from "@vue/test-utils";
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('App', () => {
  const mockData = [
    {name: 'Root', description: 'Root node', children: ['Child1', 'Child2']},
    {name: 'Child1', description: 'First child', children: []},
    {name: 'Child2', description: 'Second child', children: []},
  ];

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the API response
    (axios.get as Mock).mockResolvedValue({data: mockData});
  });

  afterEach(() => {
    d3.select('#app').html(''); // Clear the SVG element after each test
  });

  it('renders the svg element', async () => {
    const wrapper = mount(App);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('fetches data on mount', async () => {
    mount(App);
    await vi.waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/api/graph`);
  });


  it('renders nodes based on fetched data', async () => {
    const wrapper = mount(App);
    await wrapper.vm.$nextTick();

    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 100));
    const nodes = wrapper.findAll('.node');
    expect(nodes).toHaveLength(mockData.length);
  });

  it('renders links between nodes', async () => {
    const wrapper = mount(App);
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    const links = wrapper.findAll('.link');
    // Number of links should be one less than number of nodes
    expect(links).toHaveLength(mockData.length - 1);
  });

  it('selects a node when clicked', async () => {
    const wrapper = mount(App);
    await wrapper.vm.$nextTick();

    // Wait for the node circle element to appear
    await wrapper.vm.$nextTick();

    // Get the first node
    const firstNode = wrapper.findAll('.node circle')[0];
    await firstNode.trigger('click');

    expect(wrapper.find('.sidebar').exists()).toBe(true);
    expect(wrapper.find('.sidebar h2').text()).toBe(mockData[0].name);
    expect(wrapper.find('.sidebar p').text()).toBe(mockData[0].description);
  });

  it('handles API error gracefully', async () => {
    console.error = vi.fn(); // Mock console.error
    (axios.get as Mock).mockRejectedValue(new Error('API Error'));

    const wrapper = mount(App);
    await wrapper.vm.$nextTick();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(console.error).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    // SVG should be rendered
    expect(wrapper.find('svg').exists()).toBe(true);
    // No nodes should be rendered
    expect(wrapper.findAll('.node')).toHaveLength(0);
  });
});
