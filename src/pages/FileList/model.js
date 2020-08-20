import { addProcessDoc ,getProcessDoc , getProcessTime, getProcessFinishSize} from './service';

const Model = {
  namespace: 'processList',
  state: {
    list: [],
    listTotal: 0,
    time: 0,
    finishSize: 0,
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
    *time({payload}, {call,put}){
      const time = yield call(getProcessTime, payload);
      yield put({
        type:'updateTime',
        payload: time,
      })
    },
    *size({payload}, {call,put}){
      const size = yield call(getProcessFinishSize, payload);
      yield put({
        type: 'updateFinishSize',
        payload: size,
      })
    }
  },
  reducers: {
    updateFinishSize(state, action){
      return {...state, finishSize:action.payload}
    },
    updateTime(state, action){
      return {...state, time:action.payload}
    },
    queryList(state, action) {
      return { ...state, list: action.payload , listTotal: action.payload.length };
    },
  },
};
export default Model;
