import request from '@/utils/request';

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
