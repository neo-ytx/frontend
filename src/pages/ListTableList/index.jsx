import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Upload, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';
/**
 * 添加节点
 * @param fields
 */

const { Dragger } = Upload;

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
const deleteConfirm = async record =>{
  const hide = message.loading('正在删除');
  if (!record) return true;

  try {
    await removeRule({
      key: [record.key],
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
}
const TableList = () => {
  const uploadProps = {
    // withCredentials: true,
    name: 'file',
    multiple: true,
    action: '/api/rule',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功。`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败。`);
      }
    },
  };

  const [createModalVisible, handleModalVisible] = useState(false);
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: '命名实体数量',
      dataIndex: 'entityNo',
      sorter: true,
      hideInForm: true,
      renderText: val => `${val}个`,
    },
    {
      title: '关系种类',
      dataIndex: 'ralNo',
      sorter: true,
      hideInForm: true,
      renderText: val => `${val}种`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '已处理',
          status: 'Success',
        },
        1: {
          text: '未处理',
          status: 'Default',
        },
        2: {
          text: '正在处理',
          status: 'Processing',
        }
      },
    },
    {
      title: '文件创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a href="">实体关系抽取</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除这个文件吗？"
            onConfirm={async () => {
              await deleteConfirm(record);
              actionRef.current?.reloadAndRest();
            }
            }
            okText="确定"
            cancelText="取消"
          >
            <a href="">删除</a>
          </Popconfirm>
          
        </>
      ),
    },
  ];


  return (
    <PageContainer>
      <ProTable
        headerTitle="个人文件"
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 上传文件
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量处理</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => {
        handleModalVisible(false);
        actionRef.current?.reloadAndRest();
      }} modalVisible={createModalVisible}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击此处上传文件</p>
          <p className="ant-upload-hint">
           支持单次或者批量上传。
          </p>
        </Dragger>
      </CreateForm>
    </PageContainer>
  );
};

export default TableList;
