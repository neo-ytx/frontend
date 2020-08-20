import request from '@/utils/request';

export async function addProcessDoc(params){
  return request('/api/process_list',{
    method:'POST',
    data: { ...params },
  })
}

export async function getProcessDoc(params){
  return request('/api/process_list',{
    params,
  })
}

export async function getProcessTime(params){
  return request("/api/process_time",{
    params,
  })
}

export async function getProcessFinishSize(params){
  return request("/api/process_finish_size",{
    params,
  })
}

export async function queryFakeList(params) {
  return request('/api/fake_list', {
    params,
  });
}
export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'delete' },
  });
}
export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'post' },
  });
}
export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'update' },
  });
}
export async function queryRule(params) {
  return request('/api/rule', {
    params,
  });
}
