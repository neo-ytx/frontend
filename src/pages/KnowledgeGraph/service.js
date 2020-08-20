import request from '@/utils/request';

export async function getGraph(params){
  return request('/apt/graph', {
    params,
  })
} 