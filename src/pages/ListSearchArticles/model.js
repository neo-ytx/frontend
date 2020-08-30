import { queryFakeList, searchDoument } from './service';

const Model = {
  namespace: 'listSearchArticles',
  state: {
    list: [],
  },
  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(searchDoument, payload);
      console.log(response);
      yield put({
        type: 'updateSearch',
        payload: response.result,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },

    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },
  reducers: {
    updateSearch(state, action) {
      console.log(action.payload);
      return { ...state, list: action.payload };
    },
    queryList(state, action) {
      return { ...state, list: action.payload };
    },

    appendList(state, action) {
      return { ...state, list: state.list.concat(action.payload) };
    },
  },
};
export default Model;
