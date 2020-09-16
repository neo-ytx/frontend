import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'umi';
import { Button, Row, Col, Modal, Select } from 'antd';

const { Option } = Select;

const ERGraphChart = (props) => {
  const { option, dispatch, topicList } = props;
  let myChart = null;
  const [modelVisiable, setModelVisiable] = useState(false);
  const [topic, setTopic] = useState('默认');
  const dlImg = () => {
    setModelVisiable(false);
    const instance = myChart.getEchartsInstance();
    const base64 = instance.getDataURL();
    dispatch({
      type: 'graph/createImg',
      payload: {
        data: base64,
        topic,
      },
    });
  };
  return (
    <div>
      <Row>
        <Col span={24}>
          <ReactEcharts
            ref={(e) => {
              myChart = e;
            }}
            option={option}
            style={{ height: '800px' }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            type="primary"
            l
            onClick={() => {
              setModelVisiable(true);
            }}
          >
            保存图片
          </Button>
        </Col>
      </Row>
      <Modal
        title="选择主题"
        okText="保存"
        style={{ width: 240 }}
        visible={modelVisiable}
        onOk={() => dlImg()}
        onCancel={() => {
          setModelVisiable(false);
        }}
      >
        主题：
        <Select
          defaultValue="默认"
          style={{ width: 120 }}
          onChange={(value) => {
            setTopic(value);
          }}
        >
          {topicList.map((item) => {
            console.log(item);
            return <Option value={item}>{item}</Option>;
          })}
        </Select>
      </Modal>
    </div>
  );
};

export default connect(({ graph }) => ({
  option: graph.option,
  topicList: graph.topicList,
}))(ERGraphChart);
