import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';

const ArticleListContent = ({ data: { content, createAt, owner } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{content}</div>
    <div className={styles.extra}>
      <Avatar src='/cus/user1.svg' size="small" />
      <a>{owner}</a>
      <em>{moment(createAt).format('YYYY-MM-DD HH:mm')}</em>上传
    </div>
  </div>
);

export default ArticleListContent;
