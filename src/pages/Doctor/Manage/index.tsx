import { SCHEDULE } from '@/constants/schedule';
import {
  auditDoctor,
  deleteDoctor,
  queryDepartmentList,
  queryDoctorDetail,
  queryDoctorList,
  updateDoctor,
} from '@/services/ant-design-pro';
import {
  DrawerForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  Badge,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Tabs,
  Tag,
  Tooltip,
} from 'antd'; // 导入 Button 组件，解决未定义问题
import React, { useState } from 'react';
// 导入 PlusOutlined 组件
const DoctorManage: React.FC = () => {
  const [form] = Form.useForm<API.Doctor>(); // 初始化 form
  const [id, setId] = useState<number | null | undefined>(null);
  const [readonly, setReadonly] = useState<boolean>(false); // 新增状态
  const [activeKey, setActiveKey] = useState<string>('1');
  const { run, data, refresh, loading, pagination, params } = useRequest(
    ({ current, pageSize }, payload) =>
      queryDoctorList({ page: current, limit: pageSize, ...payload }),
    {
      paginated: true,
      formatResult: (res) => {
        return { list: res.data.data, total: res.data.total };
      },
    },
  );

  const { run: updateRun } = useRequest(updateDoctor, { manual: true, onSuccess: refresh });
  const { run: detailRun } = useRequest(deleteDoctor, { manual: true, onSuccess: refresh });

  // 获取科室信息
  const { data: departmentList } = useRequest(() => queryDepartmentList({ page: 1, limit: 1000 }), {
    formatResult: (res) => {
      return Object.fromEntries(res.data.map((dept) => [dept.name, dept.name]));
    },
  });

  // 审核医生
  const { run: auditRun } = useRequest(auditDoctor, { manual: true });
  const { data: doctor } = useRequest(
    () => {
      if (id) {
        return queryDoctorDetail(id);
      }
    },
    {
      refreshDeps: [id],
      onSuccess: (data) => {
        form.setFieldsValue(data);
      },
    },
  );

  const columns: ProColumns<API.Doctor>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '科室',
      dataIndex: 'department',
      valueEnum: departmentList,
    },
    {
      title: '职位',
      dataIndex: 'title',
      valueEnum: {
        主治医生: '主治医生',
        副主任医师: '副主任医师',
        主任医师: '主任医师',
        专家: '专家',
      },
    },
    {
      title: '排班时间',
      dataIndex: 'schedule',
      // hideInTable: true,
      valueType: 'select',
      render: (_, record) => {
        return (
          <Tooltip
            title={record.schedule.map((item) => (
              <span key={item} style={{ color: 'black', marginRight: 5 }}>
                {SCHEDULE[item].text}
              </span>
            ))}
          >
            <a>排班信息</a>
          </Tooltip>
        );
      },
      valueEnum: SCHEDULE,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      render: (_, record) =>
        record.auditStatus === '1' ? (
          <Badge status="success" text="审核通过" />
        ) : (
          <Badge status="error" text="未审核" />
        ), // 根据状态值渲染文本
      valueEnum: { '1': '审核通过', '0': '未审核' }, // 定义枚举值
    },
    {
      title: '操作',
      dataIndex: 'operation',
      search: false,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setId(record.id);
              setReadonly(true);
            }}
          >
            查看详情
          </a>
          <a
            onClick={() => {
              setId(record.id);
              setReadonly(false);
            }}
          >
            编辑
          </a>

          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => {
              detailRun(record.id);
            }}
          >
            <a>删除</a>
          </Popconfirm>
          <a
            onClick={() => {
              Modal.confirm({
                title: '审核',
                content: (
                  <div>
                    <div>审核通过后方可认证医生权限，你确定要审核【{record.name}】吗？</div>
                  </div>
                ),
                onOk: async () => {
                  await auditRun(record.id);
                  refresh();
                },
              });
            }}
            hidden={record.auditStatus === '1'}
          >
            审核
          </a>
        </Space>
      ),
    },
  ];
  const onClose = () => {
    setId(null);
  };

  return (
    <PageContainer header={{ title: '医生管理' }}>
      <ProTable<API.Doctor>
        onSubmit={async (payload) => {
          await run(params[0], payload);
        }}
        columns={columns}
        options={false}
        dataSource={data?.list}
        pagination={pagination}
        loading={loading}
        rowKey="id"
        headerTitle="医生信息"
      />
      <DrawerForm<API.Doctor>
        open={id !== null}
        title={readonly ? '医生详情' : '编辑医生'}
        readonly={readonly}
        form={form}
        submitter={
          readonly
            ? false
            : {
                render: () => (
                  <Space>
                    <Button onClick={onClose}>取消</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                      提交
                    </Button>
                  </Space>
                ),
              }
        }
        onFinish={async (values) => {
          await updateRun({ id, ...values });
          onClose();
          refresh();
        }}
        drawerProps={{ onClose, destroyOnClose: true }}
      >
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <Tabs.TabPane tab="基本信息" key="1">
            <ProForm.Group>
              <ProFormText
                label={'姓名'}
                name={'name'}
                disabled
                rule={[{ required: true, message: '请输入姓名' }]}
              />
              <ProFormSelect
                label={'性别'}
                name={'gender'}
                rules={[{ required: true, message: '请选择性别' }]}
                valueEnum={{
                  男: '男',
                  女: '女',
                }}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                label={'职位'}
                name={'title'}
                rules={[{ required: true, message: '请选择职位' }]}
                valueEnum={{
                  主治医生: '主治医生',
                  副主任医师: '副主任医师',
                  主任医师: '主任医师',
                  专家: '专家',
                }}
              />
              <ProFormSelect
                label={'科室'}
                name={'department'}
                valueEnum={departmentList}
                rules={[{ required: true, message: '请选择科室' }]}
              />
            </ProForm.Group>
            <ProFormGroup>
              <ProFormText label={'专长'} name={'expertise'} />
              <ProFormDigit
                label={'从业年限'}
                name={'workingYears'}
                rules={[{ required: true, message: '请输入从业年限' }]}
              />
            </ProFormGroup>
            <ProForm.Group>
              <ProFormText
                label={'电话'}
                name={'phone'}
                disabled
                rules={[{ required: true, message: '请输入电话' }]}
              />
              <ProFormText
                label={'邮箱'}
                name={'email'}
                disabled
                rules={[{ required: true, message: '请输入邮箱' }]}
              />
            </ProForm.Group>
          </Tabs.TabPane>
          <Tabs.TabPane tab="医生信息" key="2">
            <ProFormTextArea label={'简介'} name={'introduction'} />
            {/* <ProFormText label={'学历'} name={'education'} /> */}
            <ProForm.Item label={'学历'}>
              {readonly ? (
                doctor?.education?.map((edu, index) => {
                  return (
                    <div key={index} style={{ marginBottom: 8 }}>
                      <span>{index === 0 ? '本科: ' : index === 1 ? '硕士: ' : '博士: '}</span>
                      <Tag key={index}>{edu}</Tag>
                    </div>
                  );
                })
              ) : (
                <Form.List name={'education'}>
                  {(subFields, subOpt) => (
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                      {subFields.map((subField) => (
                        <Space key={subField.key}>
                          <span>
                            {subField.key === 0 ? '本科:' : subField.key === 1 ? '硕士:' : '博士:'}
                          </span>
                          <Form.Item noStyle name={subField.name}>
                            <Input disabled />
                          </Form.Item>
                          {/* <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        /> */}
                        </Space>
                      ))}
                      {/* 管理员没有权限添加 */}
                      {/* {(subFields.length < 3)  && (
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + 添加
                      </Button>
                    )} */}
                    </div>
                  )}
                </Form.List>
              )}
            </ProForm.Item>
            <ProForm.Item label={'证书'}>
              {readonly ? (
                doctor?.certificate?.map((cert, index) => {
                  return <Tag key={index}>{cert}</Tag>;
                })
              ) : (
                <Form.List name={'certificate'}>
                  {(subFields, subOpt) => (
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                      {subFields.map((subField) => (
                        <Form.Item noStyle name={subField.name} key={subField.key}>
                          <Input disabled />
                        </Form.Item>
                      ))}
                    </div>
                  )}
                </Form.List>
              )}
            </ProForm.Item>

            <ProFormSelect
              label={'排班时间'}
              name={'schedule'}
              mode="multiple"
              valueEnum={SCHEDULE}
            />
          </Tabs.TabPane>
        </Tabs>
      </DrawerForm>
    </PageContainer>
  );
};

export default DoctorManage;
