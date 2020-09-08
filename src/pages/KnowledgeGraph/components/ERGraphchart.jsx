import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'umi';
import { Button } from 'antd';

const ERGraphChart = (props) => {
  const { option, dispatch } = props;
  let myChart = null;
  const dlImg = () => {
    const instance = myChart.getEchartsInstance();
    console.log(instance);
    const base64 = instance.getDataURL();
    console.log(base64);
    dispatch({
      type: 'graph/createImg',
      payload: {
        data: base64,
      },
    });
  };
  return (
    <div>
      <ReactEcharts
        ref={(e) => {
          myChart = e;
        }}
        option={option}
        style={{ height: '800px' }}
      />
      <Button type="primary" l onClick={() => dlImg()}>
        下载图片
      </Button>
    </div>
  );
};

export default connect(({ graph }) => ({
  option: graph.option,
}))(ERGraphChart);
