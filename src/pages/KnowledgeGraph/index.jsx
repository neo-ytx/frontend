import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Input } from 'antd';
import styles from './index.less';
// import GraphChart from './GraphChart.jsx';
import EntityTable from './EntityTable';
import ERGraphChart from './components/ERGraphchart' ;

const { Search } = Input;
export default () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageHeaderWrapper className={styles.main}>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={value => console.log(value)}
        />
        {/* <GraphChart /> */}
        <Spin spinning={loading} size="large" />
      </div>
      <EntityTable />
      <ERGraphChart/>
    </PageHeaderWrapper>
  );
};
