import React, { useState } from 'react';
import moment from 'moment';
import { Modal, Input } from 'antd';
import ProTable from '@ant-design/pro-table';
import styles from '../style.less';
import { queryRule } from '../service'

const OperationModal = props => {
  const { done, visible, current, onDone, onCancel, onSubmit } = props;
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
      title: '文件创建时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      renderFormItem: (item, { defaultRender, ...rest }, formTable) => {
        const status = formTable.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
  ];
  
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const modalFooter = done
    ? {
        footer: null,
        onCancel: onDone,
      }
    : {
        okText: '提交创建',
        onOk: handleSubmit,
        onCancel,
      };

  return (
    <Modal
      title={done ? null : `任务${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={1000}
      bodyStyle={
        done
          ? {
              padding: '72px 0',
            }
          : {
              padding: '28px 0 0',
            }
      }
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      <ProTable
        headerTitle="文件列表"
        // actionRef={actionRef}
        rowKey="key"
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
    </Modal>
  );
};

export default OperationModal;
