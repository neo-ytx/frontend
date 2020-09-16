import { queryFakeList, createTopic, getTopicDetail } from './service';

const Model = {
  namespace: 'listTopic',
  state: {
    list: [],
    detail: {},
  },
  effects: {
    *create({ payload }, { call, put }) {
      const response = yield call(createTopic, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(getTopicDetail, payload);
      yield put({
        type: 'setDetail',
        payload: response.data,
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
