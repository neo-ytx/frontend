import request from '@/utils/request';

export async function search(params) {
  return request('/api/searchGraph', {
    params,
  });
}

export async function getGraph(params) {
  return request('/api/graph', {
    params,
  });
}
export async function create(params) {
  return request('/api/createImg', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getTopic(params) {
  return request('/api/topic', {
    params,
  });
}
