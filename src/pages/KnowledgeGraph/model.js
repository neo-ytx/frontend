import {getGraph} from './service';

const Model = {
  namespace: 'graph',
  state: {
    node: [],
    relationship: [],
  },
  effects:{
    *fetch({payload}, {call, put}){
      const response = yield call(getGraph, payload);
      yield put({
        type: 'updateGraph',
        payload: response,
      });
    }
  },
  reducers:{
    updateGraph(state, action){
      return {
        ...state,
        node: action.payload.node,
        relationship: action.payload.rel,
      }
    }
  },
}

export default Model;