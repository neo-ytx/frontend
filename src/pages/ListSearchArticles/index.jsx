import React from 'react';
import { Input, Button, Card, Form, List, Select, Avatar } from 'antd';
import { LoadingOutlined, StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ArticleListContent from './components/ArticleListContent';
import StandardFormRow from './components/StandardFormRow';
// import TagSelect from './components/TagSelect';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 5;
const { Search } = Input;
const ListSearchArticles = ({ dispatch, listSearchArticles: { list }, loading }) => {
  const [form] = Form.useForm();
  // useEffect(() => {
  //   dispatch({
  //     type: 'listSearchArticles/fetch',
  //     payload: {
  //       count: 5,
  //     },
  //   });
  // }, []);

  const setOwner = () => {
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  const fetchMore = () => {
    dispatch({
      type: 'listSearchArticles/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };
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

  const owners = [
    {
      id: 'wzj',
      name: '我自己',
    },
    {
      id: 'wjh',
      name: '吴家豪',
    },
    {
      id: 'zxx',
      name: '周星星',
    },
    {
      id: 'zly',
      name: '赵丽颖',
    },
    {
      id: 'ym',
      name: '姚明',
    },
  ];

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

  // const formItemLayout = {
  //   wrapperCol: {
  //     xs: {
  //       span: 24,
  //     },
  //     sm: {
  //       span: 24,
  //     },
  //     md: {
  //       span: 12,
  //     },
  //   },
  // };
  const loadMore = list.length > 0 && (
    <div
      style={{
        textAlign: 'center',
        marginTop: 16,
      }}
    >
      <Button
        onClick={fetchMore}
        style={{
          paddingLeft: 48,
          paddingRight: 48,
        }}
      >
        {loading ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  );
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Search
          placeholder="输入搜索关键词"
          enterButton="Search"
          size="large"
          onSearch={(value) => {
            console.log(value);
            dispatch({
              type: 'listSearchArticles/search',
              payload: {
                keyword: value,
              },
            });
          }}
        />
      </Card>
      <Card bordered={false}>
        <Form
          layout="inline"
          form={form}
          initialValues={{
            owner: ['wjh', 'zxx'],
          }}
          onValuesChange={() => {
            dispatch({
              type: 'listSearchArticles/fetch',
              payload: {
                count: 8,
              },
            });
          }}
        >
          <StandardFormRow title="owner" grid>
            <FormItem name="owner" noStyle>
              <Select mode="multiple" placeholder="选择 owner">
                {owners.map((owner) => (
                  <Option key={owner.id} value={owner.id}>
                    {owner.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <a className={styles.selfTrigger} onClick={setOwner}>
              只看自己的
            </a>
          </StandardFormRow>
        </Form>
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
              extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    <Avatar src={getfileIcon(item.title)} shape="square" size="default" />
                    &nbsp;{item.title}
                  </a>
                }
                // description={
                //   <span>
                //     <Tag>生物技术</Tag>
                //     <Tag>医学</Tag>
                //     <Tag>中文文本</Tag>
                //   </span>
                // }
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
