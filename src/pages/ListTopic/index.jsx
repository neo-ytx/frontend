import { Card, List, Typography, Button, Modal, Input, message, Carousel } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';

const { Paragraph } = Typography;

const ListTopic = ({ dispatch, listTopic: { list = [], detail = [] }, loading }) => {
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
    const it = list.filter((item) => item.id === id)[0];
    dispatch({
      type: 'listTopic/detail',
      payload: it.images,
    });
    setShowVisiable(true);
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
          <Card
            className={styles.card}
            hoverable
            cover={
              item.images.length > 0 ? (
                <img alt={item.title} src={item.images.length > 0 ? item.images[0] : ''} />
              ) : (
                ''
              )
            }
          >
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
                  {item.description}
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
      console.log(params);
      dispatch({
        type: 'listTopic/create',
        payload: params,
      });
      message.success('提交成功');
    }
    setCreateModal(false);
  };

  const contentStyle = {
    width: '1150px',
    textAlign: 'center',
    background: '#FFFDF7',
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
        <Input
          placeholder="主题名称"
          onChange={(e) => {
            if (e.target) {
              console.log(e.target.value);
              setTopicName(e.target.value);
            }
          }}
        />
        主题描述：
        <Input
          placeholder="主题描述"
          onChange={(e) => {
            if (e.target) {
              console.log(e.target.value);
              setTopicDes(e.target.value);
            }
          }}
        />
      </Modal>
      <div className={styles.coverCardList}>
        <div className={styles.cardList}>{cardList}</div>
      </div>
      <Modal
        title="主题展示"
        visible={showVisiable}
        footer={null}
        onCancel={() => setShowVisiable(false)}
        width="1200px"
      >
        <Carousel autoplay>
          {detail.map((item) => (
            <div>
              <img style={contentStyle} width="" alt="" src={item} />
            </div>
          ))}
        </Carousel>
      </Modal>
    </PageContainer>
  );
};

export default connect(({ listTopic, loading }) => ({
  listTopic,
  loading: loading.models.listTopic,
}))(ListTopic);
