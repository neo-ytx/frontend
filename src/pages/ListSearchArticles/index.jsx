import React from 'react';
import { Input, Card, List, Avatar } from 'antd';
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ArticleListContent from './components/ArticleListContent';

import styles from './style.less';

const { Search } = Input;
const ListSearchArticles = ({ dispatch, listSearchArticles: { list }, loading }) => {
  const getfileIcon = (fileName) => {
    const index = fileName.lastIndexOf('.');
    const ext = fileName.substr(index + 1);
    if (ext === 'doc' || ext === 'docx') {
      return '/cus/word.svg';
    }
    if (ext === 'csv' || ext === 'xls' || ext === 'xlsx') {
      return '/cus/excel.svg';
    }
    if (ext === 'ppt' || ext === 'pptx') {
      return '/cus/powerpoint.svg';
    }
    return '/cus/file.svg';
  };

  const IconText = ({ type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      case 'like-o':
        return (
          <span>
            <LikeOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      case 'message':
        return (
          <span>
            <MessageOutlined
              style={{
                marginRight: 8,
              }}
            />
            {text}
          </span>
        );

      default:
        return null;
    }
  };

  const loadMore = list.length > 0 && (
    <div
      style={{
        textAlign: 'center',
        marginTop: 16,
      }}
    />
  );
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Search
          placeholder="输入搜索关键词"
          enterButton="搜索"
          size="large"
          onSearch={(value) => {
            dispatch({
              type: 'listSearchArticles/search',
              payload: {
                keyword: value,
              },
            });
          }}
        />
      </Card>
      <Card
        style={{
          marginTop: 24,
        }}
        bordered={false}
        bodyStyle={{
          padding: '8px 32px 32px 32px',
        }}
      >
        <List
          size="large"
          loading={list.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText key="star" type="star-o" text={item.star} />,
                <IconText key="like" type="like-o" text={item.like} />,
                <IconText key="message" type="message" text={item.message} />,
              ]}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    <Avatar src={getfileIcon(item.title)} shape="square" size="default" />
                    &nbsp;{item.title}
                  </a>
                }
              />
              <ArticleListContent data={item} />
            </List.Item>
          )}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ listSearchArticles, loading }) => ({
  listSearchArticles,
  loading: loading.models.listSearchArticles,
}))(ListSearchArticles);
