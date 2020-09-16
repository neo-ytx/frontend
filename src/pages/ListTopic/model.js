import { queryFakeList, createTopic } from './service';

const Model = {
  namespace: 'listTopic',
  state: {
    list: [],
    detail: [],
  },
  effects: {
    *create({ payload }, { call, put }) {
      console.log('123123', payload);
      yield call(createTopic, payload);
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *detail({ payload }, { put }) {
      yield put({
        type: 'setDetail',
        payload,
      });
    },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
    setDetail(state, action) {
      return { ...state, detail: action.payload };
    },
  },
};
export default Model;
