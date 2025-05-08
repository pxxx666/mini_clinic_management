import { deleteUser, queryUserList } from '@/services/ant-design-pro';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Input, Popconfirm, Tabs, Tag } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useState } from 'react';

const UserManagement = () => {
  const [key, setKey] = useState('all');
  const { run, data, pagination, loading, params, refresh } = useRequest(
    ({ current, pageSize }, payload) => {
      if (key === 'all') {
        return queryUserList({ page: current, limit: pageSize, ...payload });
      } else {
        return queryUserList({ page: current, limit: pageSize, role: key, ...payload });
      }
    },
    {
      paginated: true,
      refreshDeps: [key],
      formatResult: (res) => {
        return {
          list: res.data.data,
          total: res.data.total,
        };
      },
    },
  );

  const { run: runDelete } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: '所有',
    },
    {
      key: 'patient',
      label: '患者',
    },
    {
      key: 'doctor',
      label: '医生',
    },
    {
      key: 'admin',
      label: '管理员',
    },
  ];
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '邮箱号',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '身份证',
      dataIndex: 'idCard',
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (_, record) => {
        if (record.role === 'patient') {
          return (
            <Tag bordered={false} color="processing">
              患者
            </Tag>
          );
        } else if (record.role === 'doctor') {
          return (
            <Tag bordered={false} color="success">
              医生
            </Tag>
          );
        } else if (record.role === 'admin') {
          return (
            <Tag bordered={false} color="error">
              管理员
            </Tag>
          );
        }
      },
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Popconfirm
            title="注销用户"
            description="确认注销该用户吗？"
            onConfirm={() => runDelete(record.id)}
          >
            <a>注销用户</a>
          </Popconfirm>
        );
      },
    },
  ];
  return (
    <PageContainer header={{ title: '用户管理' }}>
      <Input.Search
        placeholder="请输入姓名"
        style={{ width: 200, marginBottom: 16 }}
        onSearch={(v) => {
          run({ ...params[0] }, { realName: v });
        }}
      />
      <Tabs
        items={items}
        defaultActiveKey={key}
        onChange={(value) => {
          setKey(value);
        }}
      />
      <ProTable
        columns={columns}
        search={false}
        dataSource={data?.list || []}
        pagination={pagination}
        loading={loading}
      />
    </PageContainer>
  );
};
export default UserManagement;
