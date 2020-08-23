import { getGraph } from './service';

const option = {
  title: {
    text: '知识图谱',
    subtext: 'Default layout',
    top: 'bottom',
    left: 'right'
  },
  tooltip: {},
  legend: [],
  animation: false,
  animationDuration: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      name: '知识图谱',
      type: 'graph',
      layout: 'force',
      focusNodeAdjacency: true,
      data: [],
      links: [],
      categories: [],
      roam: true,
      label: {
        position: 'right',
        formatter: '{b}',
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      },
      force: {
        repulsion: 1500
      },
      emphasis: {
          lineStyle: {
              width: 10
          }
      }
    }
  ]
};

const Model = {
  namespace: 'graph',
  state: {
    node: [],
    relationship: [],
    option: {}
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getGraph, payload);
      yield put({
        type: 'updateGraph',
        payload: response,
      });
    },
    *init({ payload }, { put }) {
      yield put({
        type: 'initGraph',
        payload,
      })
    }
  },
  reducers: {
    initGraph(state, { payload: { nodes, links } }) {
      const categories = [];
      for (let i = 0; i < 9; i += 1) {
        categories[i] = {
          name: `类目${i}`
        };
      }
      const legend = categories.map((a) => {
        return a.name;
      })

      option.legend = [{ data: legend }];
      option.series[0].data = nodes.map((node) => {
        return {
          ...node,
          itemStyle: null,
          symbolSize: 30,
          value: node.symbolSize,
          category: node.attributes.modularity_class,
          x: null,
          y: null,
          draggable: true,
        }
      });
      option.series[0].links = links;
      option.series[0].categories = categories;
      return {
        ...state,
        option
      }
    },
    updateGraph(state, action) {
      return {
        ...state,
        node: action.payload.node,
        relationship: action.payload.rel,
      }
    }
  },
}

export default Model;