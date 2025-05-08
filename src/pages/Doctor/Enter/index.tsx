import { SCHEDULE } from '@/constants/schedule';
import {
  createDoctor,
  queryDepartmentList,
  queryDoctorDetail,
  queryUserDetail,
  updateDoctor,
} from '@/services/ant-design-pro';
import {
  CalendarOutlined,
  CloseOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  DrawerForm,
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Tabs,
  Timeline,
  message,
} from 'antd';

import React, { useState } from 'react';

const DoctorEnter: React.FC = () => {
  const [form] = Form.useForm<API.Doctor>(); // 初始化 form
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string>('1');
  const {
    data: doctor,
    loading,
    refresh,
  } = useRequest(() => queryDoctorDetail(currentUser?.userId), {
    onSuccess: (res) => {
      form.setFieldsValue(res);
    },
  });

  const onClose = () => {
    setOpen(false);
  };
  // 获取科室信息
  const { data: departmentList } = useRequest(() => queryDepartmentList({ page: 1, limit: 1000 }), {
    formatResult: (res) => {
      return Object.fromEntries(res.data.data.map((dept) => [dept.name, dept.name]));
    },
  });

  // 获取用户基本信息
  const { data: userInfo } = useRequest(() => queryUserDetail(currentUser?.userId));

  // 录入医生信息
  const { run: runCreateDoctor } = useRequest(createDoctor, {
    manual: true,
    onSuccess: () => {
      message.success('医生信息录入成功');
      onClose(); // 关闭 DrawerForm 组件
      refresh(); // 刷新页面
    },
  });

  const { run: runUpdateDoctor } = useRequest(updateDoctor, {
    manual: true,
    onSuccess: () => {
      message.success('医生信息更新成功');
      onClose(); // 关闭 DrawerForm 组件
      refresh(); // 刷新页面
    },
  });

  const handleEditProfile = () => {
    setOpen(true);
  };

  if (loading) {
    return (
      <PageContainer title="医生个人资料">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="医生个人资料">
      {doctor ? (
        <Card>
          <Row>
            <Col span={6} style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${doctor.id % 10}`}
              />
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold' }}>{doctor?.name}</div>
              <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                {doctor?.department} · {doctor?.title}
              </div>
              <div style={{ marginTop: 16 }}>
                <Button type="primary" icon={<EditOutlined />} onClick={handleEditProfile}>
                  编辑个人资料
                </Button>
              </div>
            </Col>
            <Col span={18}>
              <Descriptions title="基本信息" bordered column={2}>
                <Descriptions.Item label="性别">{doctor?.gender}</Descriptions.Item>
                <Descriptions.Item label="职称">{doctor?.title}</Descriptions.Item>
                <Descriptions.Item label="科室">{doctor?.department}</Descriptions.Item>
                <Descriptions.Item label="专长">{doctor?.expertise}</Descriptions.Item>
                <Descriptions.Item label="工作年限">{doctor?.workingYears}年</Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {doctor?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="电子邮箱" span={2}>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {doctor?.email}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          <Divider />
          <Tabs
            defaultActiveKey="intro"
            items={[
              {
                key: 'intro',
                label: '个人简介',
                children: (
                  <Card bordered={false}>
                    <div style={{ fontSize: 16, lineHeight: 1.8 }}>{doctor?.introduction}</div>
                  </Card>
                ),
              },
              {
                key: 'education',
                label: '教育背景',
                children: (
                  <Card bordered={false}>
                    <Timeline
                      items={doctor?.education.map((edu: any, index: number) => ({
                        children: (
                          <div>
                            {/* <div style={{ fontWeight: 'bold' }}>{edu?.year}</div> */}
                            <div>{index === 0 ? '本科' : index === 1 ? '硕士' : '博士'}</div>
                            <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{edu}</div>
                          </div>
                        ),
                      }))}
                    />
                  </Card>
                ),
              },
              {
                key: 'certificates',
                label: '资格证书',
                children: (
                  <Card bordered={false}>
                    <Timeline
                      items={doctor?.certificate.map((cert: any) => ({
                        children: (
                          <div>
                            <div>{cert}</div>
                          </div>
                        ),
                      }))}
                    />
                  </Card>
                ),
              },
              {
                key: 'schedule',
                label: '出诊安排',
                children: (
                  <Card bordered={false}>
                    {doctor?.schedule.map((item: any, index: number) => (
                      <div key={index} style={{ marginBottom: 16 }}>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        <span style={{ fontWeight: 'bold', marginRight: 16 }}>
                          {SCHEDULE[item].text}
                        </span>
                        {/* <span>{item.time}</span> */}
                      </div>
                    ))}
                  </Card>
                ),
              },
            ]}
          />
        </Card>
      ) : (
        <Flex vertical align="center" gap={50}>
          <Empty description="暂未录入医生信息，请录入后等待管理员通过审核，方可正式成为该院医生！" />
          <Button type="primary" style={{ width: '16vw' }} onClick={() => setOpen(true)}>
            立即录入
          </Button>
        </Flex>
      )}
      <DrawerForm<API.Doctor>
        open={open}
        title={doctor ? '编辑医生信息' : '录入医生信息'}
        form={form}
        onFinish={async (values) => {
          if (!doctor) {
            await runCreateDoctor({ ...values, id: currentUser?.userId });
          } else {
            await runUpdateDoctor({ ...values, id: currentUser?.userId });
          }
        }}
        drawerProps={{ onClose }}
      >
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <Tabs.TabPane tab="基本信息" key="1">
            <ProForm.Group>
              <ProFormText
                label={'姓名'}
                name={'name'}
                initialValue={userInfo?.realName} // 从用户信息中获取姓名
                readonly={doctor}
                rule={[{ required: true, message: '请输入姓名' }]}
              />
              <ProFormSelect
                label={'性别'}
                name={'gender'}
                readonly={doctor}
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
                readonly={doctor}
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
                readonly={doctor}
                rules={[{ required: true, message: '请选择科室' }]}
              />
            </ProForm.Group>
            <ProFormGroup>
              <ProFormText label={'专长'} name={'expertise'} />
              <ProFormDigit
                label={'从业年限'}
                name={'workingYears'}
                readonly={doctor}
                rules={[{ required: true, message: '请输入从业年限' }]}
              />
            </ProFormGroup>
            <ProForm.Group>
              <ProFormText
                label={'电话'}
                name={'phone'}
                initialValue={userInfo?.phone} // 从用户信息中获取电话
                disabled
                rules={[{ required: true, message: '请输入电话' }]}
              />
              <ProFormText
                label={'邮箱'}
                name={'email'}
                initialValue={userInfo?.email} // 从用户信息中获取邮箱
                disabled
                rules={[{ required: true, message: '请输入邮箱' }]}
              />
            </ProForm.Group>
          </Tabs.TabPane>
          <Tabs.TabPane tab="医生信息" key="2">
            <ProFormTextArea label={'简介'} name={'introduction'} />
            {/* <ProFormText label={'学历'} name={'education'} /> */}
            <ProForm.Item label={'学历'}>
              <Form.List name={'education'}>
                {(subFields, subOpt) => (
                  <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <span>
                          {subField.key === 0 ? '本科:' : subField.key === 1 ? '硕士:' : '博士:'}
                        </span>
                        <Form.Item noStyle name={subField.name}>
                          <Input />
                        </Form.Item>

                        <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      </Space>
                    ))}
                    {subFields.length < 3 && (
                      <Button type="dashed" onClick={() => subOpt.add()} block>
                        + 添加
                      </Button>
                    )}
                  </div>
                )}
              </Form.List>
            </ProForm.Item>
            <ProForm.Item label={'证书'}>
              <Form.List name={'certificate'}>
                {(subFields, subOpt) => (
                  <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item noStyle name={subField.name} key={subField.key}>
                          <Input />
                        </Form.Item>
                        <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => subOpt.add()} block>
                      + 添加
                    </Button>
                  </div>
                )}
              </Form.List>
            </ProForm.Item>

            <ProFormSelect
              label={'排班时间'}
              name={'schedule'}
              mode="multiple"
              valueEnum={SCHEDULE}
              disabled={doctor}
            />
          </Tabs.TabPane>
        </Tabs>
      </DrawerForm>
    </PageContainer>
  );
};
export default DoctorEnter;
