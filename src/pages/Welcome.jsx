import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Divider, Carousel  } from 'antd';

const contentStyle = {
  height: '650px',
  color: '#fff',
  lineHeight: '75px',
  textAlign: 'center',
  background: '#AED6F1',
  fontSize: '24px',
};

export default () => (
  <PageContainer>
    <Card>
      <Alert
        message="本系统为用户提供文件管理和全文搜索功能，并且提供对文件进行实体关系抽取功能。展示本领域的知识图谱，并且提供相关的搜索功能。"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <Typography.Text strong>
        在本系统中使用的实体关系联合抽取的模型，首先通过BERT的中文预训练模型对中文字符进行编码，
        然后使用Bi-LSTM网络提取中文文本的每个句子中，得到句子前后两个方向的编码出的隐藏层向量，
        在实体抽取部分使用对不同长度span进行预测，在关系抽取中在通过多层GCN网络进行编码，
        再使用多层指针网络预测实体之间对应的关系类型。使用此模型对比其他几种模型，
        在2020百度关系抽取竞赛数据集上进行训练，通过Precision、Recall和F1值横向对比实验结果，
        得出结论：通过使用BERT等中文预训练模型可增强模型预测效果；使用Bi-LSTM可以获得句子前后方向上的信息；
        目前的针对关系抽取任务中的模型不能够很好地利用上结构上的信息，通过使用多层GCN对句子进行编码使得隐藏层包含结构信息；
        使用Span序列预测和多层指针网络的解码可以解决实体和关系重叠问题。
        所以，通过本文提出的模型在中文专业文本上进行实体关系抽取会有相对较好预测结果。
      </Typography.Text>
      <Divider />
    </Card>
    <Carousel>
      <div>
        <h3 align="middle" style={contentStyle}>
          实体关系联合抽取模型网络结构图
          <center>
            <img  className ="welcomeImg" height="500px" src='/cus/net.png' alt="神经网络结构图"/>
          </center>
        </h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
    </Carousel>
  </PageContainer>
);
