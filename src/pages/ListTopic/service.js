import request from 'umi-request';

export async function queryFakeList(params) {
  return request('/api/topic', {
    params,
  });
}
export async function createTopic(params) {
  return request('/api/topic', {
    method: 'POST',
    params,
  });
}
export async function getTopicDetail(params) {
  return request('/api/topicDetail', {
    params,
  });
}
