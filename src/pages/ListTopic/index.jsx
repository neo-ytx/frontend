import { Card, List, Typography, Button, Modal, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';

const { Paragraph } = Typography;

const ListTopic = ({ dispatch, listTopic: { list = [] }, loading }) => {
  useEffect(() => {
    dispatch({
      type: 'listTopic/fetch',
      payload: {
        count: 8,
      },
    });
  }, []);
  const [createModal, setCreateModal] = useState(false);
  const [showVisiable, setShowVisiable] = useState(false);
  const showTopic = (id) => {
    setShowVisiable(true);
    console.log(id);
  };
  const cardList = list && (
    <List
      rowKey="id"
      loading={loading}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Card className={styles.card} hoverable cover={<img alt={item.title} src={item.cover} />}>
            <Card.Meta
              title={
                <a
                  onClick={() => {
                    showTopic(item.id);
                  }}
                >
                  {item.title}
                </a>
              }
              description={
                <Paragraph
                  className={styles.item}
                  ellipsis={{
                    rows: 2,
                  }}
                >
                  {item.subDescription}
                </Paragraph>
              }
            />
            <div className={styles.cardItemContent}>
              <span>{moment(item.updatedAt).fromNow()}</span>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  const [topicName, setTopicName] = useState('');
  const [topicDes, setTopicDes] = useState('');

  const handleOk = () => {
    if (topicName === '' || topicDes === '') {
      message.error('请填写表单');
    } else {
      const params = {
        name: topicName,
        desc: topicDes,
      };
      dispatch({
        type: 'listTopic',
        params,
      });
      message.success('提交成功');
    }
    setCreateModal(false);
  };

  return (
    <PageContainer>
      <Button
        type="primary"
        onClick={() => {
          setCreateModal(true);
        }}
      >
        创建主题
      </Button>
      <Modal
        title="创建主题"
        visible={createModal}
        onOk={() => handleOk()}
        onCancel={() => {
          setCreateModal(false);
        }}
      >
        主题名称：
        <Input placeholder="主题名称" onChange={(value) => setTopicName(value)} />
        主题描述：
        <Input placeholder="主题描述" onChange={(value) => setTopicDes(value)} />
      </Modal>
      <div className={styles.coverCardList}>
        <div className={styles.cardList}>{cardList}</div>
      </div>
      <Modal title="主题展示" visible={showVisiable} destroyOnClose footer={null}>
        主题名称：
        <Input placeholder="主题名称" onChange={(value) => setTopicName(value)} />
        主题描述：
        <Input placeholder="主题描述" onChange={(value) => setTopicDes(value)} />
      </Modal>
    </PageContainer>
  );
};

export default connect(({ listTopic, loading }) => ({
  listTopic,
  loading: loading.models.listTopic,
}))(ListTopic);
