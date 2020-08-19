import { addProcessDoc , getProcessDoc} from './service';

const Model = {
  namespace: 'processList',
  state: {
    list: [],
    listTotal: 0,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProcessDoc, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },

    *submit({ payload }, { call, put }) {
      const response = yield call(addProcessDoc, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload , listTotal: action.payload.length };
    },
  },
};
export default Model;
