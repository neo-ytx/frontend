import { queryFakeList, searchDoument} from './service';

const Model = {
  namespace: 'listSearchArticles',
  state: {
    list: [],
  },
  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(searchDoument, payload);
      yield put({
        type: 'updateSearch',
        payload: Array.isArray(response.reaslt) ? response.result : [],
      })
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
    updateSearch(state, action){
      return {...state, list: action.payload}
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
