import {
  createEvaluation,
  queryAppointmentList,
  queryEvaluationById,
} from '@/services/ant-design-pro';
import { FileTextOutlined, PlusOutlined, SearchOutlined, StarOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormRate,
  ProFormTextArea,
  ProFormCheckbox,
  DrawerForm,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  List,
  Rate,
  Row,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import { Checkbox } from 'antd/lib';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;

const PatientHealthRecords: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [currentAppointment, setCurrentAppointment] = useState<API.Appointment>();
  const [currentRemark, setCurrentRemark] = useState<API.Evaluation>();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { run, data, pagination, loading, params, refresh } = useRequest(
    ({ current, pageSize }, payload) =>
      queryAppointmentList({
        page: current,
        limit: 5,
        ...payload,
        userId: currentUser?.userId,
      }),
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
  const { data: remarkData, run: runQueryEvaluationById } = useRequest(queryEvaluationById, {
    manual: true,
  });

  const handleViewRecord = (record: API.Appointment) => {
    setCurrentAppointment(record);
    setDrawerVisible(true);
  };

  const handleRating = async (record: API.Appointment) => {
    setCurrentAppointment(record);
    await runQueryEvaluationById(record.id);
    setOpen(true);
  };

  return (
    <PageContainer title="健康记录">
      <Card style={{ marginTop: 16 }}>
        {data?.list.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={data?.list}
            loading={loading}
            pagination={pagination}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    key="view"
                    type="link"
                    icon={<FileTextOutlined />}
                    onClick={() => handleViewRecord(item)}
                  >
                    查看详情
                  </Button>,
                  <Button
                    hidden={item.status !== '已结束'}
                    key="rating"
                    type="link"
                    icon={<StarOutlined />}
                    onClick={() => handleRating(item)}
                  >
                    评价
                  </Button>,
                ]}
                extra={
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: 8 }}>
                      <Tag
                        color={
                          item.status === '待叫号'
                            ? 'warning'
                            : item.status === '就诊中'
                            ? 'processing'
                            : 'success'
                        }
                      >
                        {item.status}
                      </Tag>
                    </div>
                    <div>{item.appointmentTime}</div>
                  </div>
                }
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span style={{ fontSize: 16 }}>编号ID：{item.id}</span>
                      <Badge
                        status="processing"
                        text={`${item.patientName} (ID: ${item.userId})`}
                      />
                    </Space>
                  }
                  description={
                    <Space>
                      <span>{item.department}</span>
                      <span>{item.doctorName}</span>
                    </Space>
                  }
                />
                <Paragraph ellipsis={{ rows: 2 }}>
                  {item.diagnosticResult ? item.diagnosticResult : '暂无诊断'}
                </Paragraph>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无健康记录" />
        )}
      </Card>

      <Drawer
        title="健康记录详情"
        width={600}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {currentAppointment && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="记录ID">{currentAppointment?.id}</Descriptions.Item>
              <Descriptions.Item label="患者姓名">
                {currentAppointment?.patientName}
              </Descriptions.Item>
              <Descriptions.Item label="患者ID">{currentAppointment?.userId}</Descriptions.Item>
              <Descriptions.Item label="预约日期">
                {currentAppointment?.appointmentTime}
              </Descriptions.Item>
              <Descriptions.Item label="科室">{currentAppointment.department}</Descriptions.Item>
              <Descriptions.Item label="医生">{currentAppointment.doctorName}</Descriptions.Item>
            </Descriptions>

            <div style={{ margin: '16px 0' }}>
              <Title level={5}>患者病情描述</Title>
              <div style={{ whiteSpace: 'pre-line' }}>{currentAppointment?.patientDescription}</div>
            </div>

            {currentAppointment?.drug && (
              <div style={{ margin: '16px 0' }}>
                <Title level={5}>用药信息</Title>
                <List
                  size="small"
                  bordered
                  dataSource={currentAppointment.drug}
                  renderItem={(med: any) => (
                    <List.Item>
                      <Text strong>{med.name}</Text>: {med.count}盒 , {med.useMethod}
                    </List.Item>
                  )}
                />
              </div>
            )}

            {currentAppointment?.doctorAdvice && (
              <div style={{ margin: '16px 0' }}>
                <Title level={5}>医嘱</Title>
                <div>{currentAppointment?.doctorAdvice}</div>
              </div>
            )}

            {currentAppointment?.diagnosticResult && (
              <div style={{ margin: '16px 0' }}>
                <Title level={5}>结论</Title>
                <div>{currentAppointment?.diagnosticResult}</div>
              </div>
            )}
          </>
        )}
      </Drawer>
      <DrawerForm<API.Evaluation>
        title="评价信息"
        width={600}
        placement="right"
        drawerProps={{ onClose: () => setOpen(false), destroyOnClose: true }}
        open={open}
        initialValues={{
          ...remarkData,
          ProfessionalMark: Number(remarkData?.ProfessionalMark) || 0,
          CommunicationMark: Number(remarkData?.CommunicationMark) || 0,
          ServiceMark: Number(remarkData?.ServiceMark) || 0,
          EfficiencyMark: Number(remarkData?.EfficiencyMark) || 0,
          EthicsMark: Number(remarkData?.EthicsMark) || 0,
        }}
        readonly={!!remarkData}
        submitter={
          remarkData
            ? false
            : {
                // Customize your submitter configuration here if needed
                resetButtonProps: {
                  style: {
                    display: 'inline-block',
                  },
                },
                submitButtonProps: {
                  style: {
                    display: 'inline-block',
                  },
                },
              }
        }
        onFinish={async (values) => {
          await createEvaluation({
            ...values,
            appointmentId: currentAppointment?.id,
            patientId: currentAppointment?.userId,
            doctorId: currentAppointment?.doctorId,
            patientName: currentAppointment?.patientName,
            doctorName: currentAppointment?.doctorName,
            evaluationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          });
          message.success('评价成功');
          setOpen(false);
        }}
      >
        <ProFormRate
          label="专业能力"
          name={'ProfessionalMark'}
          rules={[{ required: true }]}
          fieldProps={{ allowHalf: false }}
        />

        <ProFormRate
          label="沟通技巧"
          name={'CommunicationMark'}
          rules={[{ required: true }]}
          fieldProps={{ allowHalf: false }}
        />
        <ProFormRate
          label="服务态度"
          name={'ServiceMark'}
          rules={[{ required: true }]}
          fieldProps={{ allowHalf: false }}
        />
        <ProFormRate
          label="疗效评价"
          name={'EfficiencyMark'}
          rules={[{ required: true }]}
          fieldProps={{ allowHalf: false }}
        />
        <ProFormRate
          label="医德与诚信"
          name={'EthicsMark'}
          rules={[{ required: true }]}
          fieldProps={{ allowHalf: false }}
        />
        <ProFormCheckbox.Group
          label="标签"
          name={'tags'}
          options={[
            { label: '医术精湛', value: '医术精湛' },
            { label: '耐心细致', value: '耐心细致' },
            { label: '态度友善', value: '态度友善' },
            { label: '沟通清晰', value: '沟通清晰' },
            { label: '高效负责', value: '高效负责' },
            { label: '医德高尚', value: '医德高尚' },
            { label: '经验丰富', value: '经验丰富' },
            { label: '推荐度高', value: '推荐度高' },
            { label: '态度冷漠', value: '态度冷漠' },
            { label: '敷衍了事', value: '敷衍了事' },
            { label: '不专业', value: '不专业' },
            { label: '态度恶劣', value: '态度恶劣' },
            { label: '沟通不清晰', value: '沟通不清晰' },
            { label: '效率低下', value: '效率低下' },
            { label: '医德差', value: '医德差' },
            { label: '经验不足', value: '经验不足' },
            { label: '推荐度低', value: '推荐度低' },
          ]}
        />
        <ProFormTextArea label="评价内容" name={'remark'} rules={[{ required: true }]} />
      </DrawerForm>
    </PageContainer>
  );
};

export default PatientHealthRecords;
