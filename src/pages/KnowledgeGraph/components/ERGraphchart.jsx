import React from 'react';
import ReactEcharts from "echarts-for-react";
import {connect} from 'umi';

const ERGraphChart = props => {
  const {
    option
  } = props;
  return (
    <ReactEcharts
      option={option}
      style={{ height: '800px'}}
    />
  )
}

export default connect(({graph})=>({
  option: graph.option,
}))(ERGraphChart);