import {
  createDepartment,
  deleteDepartment,
  queryDepartmentDetail,
  queryDepartmentList,
  updateDepartment,
} from '@/services/ant-design-pro';
import {
  DrawerForm,
  ProColumns,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { Button, Form, Popconfirm, Space } from 'antd'; // 导入 Button 组件，解决未定义问题
import React, { useState } from 'react';

const DepartmentManagement: React.FC = () => {
  const [form] = Form.useForm<Department>(); // 初始化 form
  const [id, setId] = useState<number | null | undefined>(null);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const canDo = currentUser?.role === 'admin';
  const { data, refresh, loading, pagination } = useRequest(
    ({ current, pageSize }) => queryDepartmentList({ page: current, limit: pageSize }),
    {
      paginated: true,
      formatResult: (res) => {
        return {
          list: res.data.data,
          total: res.data.total,
        };
      },
    },
  );
  const { run: createRun } = useRequest(createDepartment, { manual: true });
  const { run: updateRun } = useRequest(updateDepartment, { manual: true });
  const { run: detailRun } = useRequest(deleteDepartment, { manual: true });
  useRequest(
    () => {
      if (id) {
        return queryDepartmentDetail(id);
      }
    },
    {
      refreshDeps: [id],
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  );

  const columns: ProColumns<API.Department>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '科室名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      hideInTable: !canDo,
      render: (_, record) => (
        <Space>
          <a onClick={() => setId(record.id)}>编辑</a>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => {
              detailRun(record.id);
              refresh();
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onClose = () => {
    setId(null);
  };

  return (
    <>
      <ProTable<Department>
        columns={columns}
        search={false}
        options={false}
        dataSource={data?.list}
        pagination={pagination}
        loading={loading}
        toolBarRender={() => {
          return (
            canDo && (
              <Button type="primary" onClick={() => setId(undefined)}>
                新增
              </Button>
            )
          );
        }}
        rowKey="id"
        headerTitle="科室管理"
      />
      <DrawerForm<Department>
        open={id !== null}
        title={id ? '编辑科室' : '新增科室'}
        form={form}
        onFinish={async (values) => {
          if (id) {
            await updateRun({ id, ...values });
            onClose();
            refresh();
          } else {
            await createRun(values);
            onClose();
            refresh();
          }
        }}
        drawerProps={{
          onClose,
          destroyOnClose: true,
        }}
      >
        <ProFormText label={'名称'} name={'name'} />
        <ProFormTextArea label={'描述'} name={'description'} />
      </DrawerForm>
    </>
  );
};

export default DepartmentManagement;
