import React, { useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  message,
} from 'antd';
import { findDOMNode } from 'react-dom';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import styles from './style.less';
import { addProcessDoc } from './service';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{owner}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>开始时间</span>
      <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
    </div>
    <div className={styles.listContentItem}>
      <Progress
        percent={percent}
        status={status}
        strokeWidth={6}
        style={{
          width: 180,
        }}
      />
    </div>
  </div>
);

export const FileList = props => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    processList: { 
      list,
      listTotal,
    },
  } = props;
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  useEffect(() => {
    dispatch({
      type: 'processList/fetch',
      payload: {
      },
    });
  }, [1]);

  const handleSubmit = async selectedRows => {
    if(selectedRows&&selectedRows.length!==0){
      const hide = message.loading('正在提交');
      try {
        await addProcessDoc({
          key: selectedRows.map(row => row.key),
        })
        hide();
        message.success('提交成功');
        return true;
      } catch (error) {
        hide();
        message.error('提交失败');
        return false;
      }
    }
    return true;
  };
  

  const paginationProps = {
    // showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: listTotal,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = item => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = id => {
    dispatch({
      type: 'fileList/submit',
      payload: {
        id,
      },
    });
  };

  const editAndDelete = (key, currentItem) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除任务',
        content: '确定删除该任务吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all" >
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">进行中</RadioButton>
        <RadioButton value="waiting">等待中</RadioButton>
      </RadioGroup>
    </div>
  );

  const MoreBtn = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current);
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();
    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const getfileIcon = (fileName) =>{
    const index= fileName.lastIndexOf(".");
    const ext = fileName.substr(index+1);
    if(ext==='doc'||ext==='docx') {
      return '/cus/word.svg';
    }
    if(ext==='csv'||ext==='xls'||ext==='xlsx') {
      return '/cus/excel.svg';
    }
    if(ext==='ppt'||ext==='pptx') {
      return '/cus/powerpoint.svg';
    }
    return '/cus/file.svg';
  }

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="处理文档总数量" value={`${listTotal}个`} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="文档处理平均处理时间" value="32分钟" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="已处理文档处理数量" value="24个" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="处理文档列表"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{
                width: '100%',
                marginBottom: 8,
              }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={e => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={getfileIcon(item.title)} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={async(selectRows) =>{
          await handleSubmit(selectRows);
          dispatch({
            type: 'processList/fetch',
            payload: {
              count: 5,
            },
          });
          setVisible(false);
        }}
      />
    </div>
  );
};
export default connect(({ processList, loading }) => ({
  processList,
  loading: loading.models.processList,
}))(FileList);
