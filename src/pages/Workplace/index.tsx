import { Radar } from '@ant-design/charts';
import {
  PageContainer,
  ProDescriptions,
  ProFormList,
  ProFormGroup,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProForm,
} from '@ant-design/pro-components';
import { Link, useRequest } from '@umijs/max';
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Flex,
  Form,
  List,
  message,
  Radio,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState, type FC } from 'react';
import useStyles from './style.style';
import { useModel } from '@/.umi/plugin-model';
import {
  callAppointment,
  queryAppointmentList,
  queryDoctorDetail,
  queryDoctorList,
  queryDoctorRanking,
  queryDrugByName,
  queryDrugList,
  queryEvaluationsByDoctorId,
  visitAppointment,
} from '@/services/ant-design-pro';
import { generatePrescriptionDoc } from '@/utils/generatePrescriptionDoc';
import DemoRadar from './AppRadar';
import AppRadar from './AppRadar';
dayjs.extend(relativeTime);

const PageHeaderContent: FC<{
  currentUser: API.Doctor;
  loading?: boolean;
}> = ({ currentUser, loading }) => {
  const { styles } = useStyles();
  if (loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar
          size="large"
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${currentUser?.id % 10}`}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser?.name}
          ，祝你开心每一天！
        </div>
        <div>
          {currentUser?.title} | {currentUser?.department}
        </div>
      </div>
    </div>
  );
};
const ExtraContent: FC<{
  doctorRanking: {
    totalAppointments: number;
    rankInDepartment: number;
    departmentDoctorCount: number;
  };
}> = ({ doctorRanking }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <Statistic title="预约数" value={doctorRanking?.totalAppointments} />
      </div>
      <div className={styles.statItem}>
        <Statistic
          title="科室排名"
          value={doctorRanking?.rankInDepartment}
          suffix={`/ ${doctorRanking?.departmentDoctorCount}`}
        />
      </div>
    </div>
  );
};
const Workplace: FC = () => {
  const { styles } = useStyles();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [currentStatus, setCurrentStatus] = useState('全部');
  const [form] = Form.useForm<API.Appointment>();
  // 就诊处理
  const [treatmentOpen, setTreatmentOpen] = useState(false);
  const [readonly, setReadonly] = useState(false); // 是否只读
  // 当前就诊信息
  const [currentAppointment, setCurrentAppointment] = useState<API.Appointment>();

  // 医生基本信息
  const { data: doctorInfo, loading: doctorLoading } = useRequest(() =>
    queryDoctorDetail(currentUser?.userId),
  );

  const { data: doctorRate } = useRequest(() => queryEvaluationsByDoctorId(currentUser?.userId), {
    formatResult: (res) => {
      const calculateAverageMarks = (data) => {
        const total = data.reduce(
          (acc, curr) => {
            acc.ProfessionalMark += curr.ProfessionalMark;
            acc.CommunicationMark += curr.CommunicationMark;
            acc.ServiceMark += curr.ServiceMark;
            acc.EfficiencyMark += curr.EfficiencyMark;
            acc.EthicsMark += curr.EthicsMark;
            return acc;
          },
          {
            ProfessionalMark: 0,
            CommunicationMark: 0,
            ServiceMark: 0,
            EfficiencyMark: 0,
            EthicsMark: 0,
          },
        );

        const count = data.length;
        return {
          ProfessionalMark: total.ProfessionalMark / count,
          CommunicationMark: total.CommunicationMark / count,
          ServiceMark: total.ServiceMark / count,
          EfficiencyMark: total.EfficiencyMark / count,
          EthicsMark: total.EthicsMark / count,
        };
      };
      const averageMarks = calculateAverageMarks(res.data);
      const formattedMarks = Object.values(averageMarks);
      return formattedMarks;
    },
  });

  const { run: runQueryDrugByName } = useRequest(queryDrugByName, {
    manual: true,
  });

  const { data: drugType } = useRequest(() => queryDrugList({ page: 1, pageSize: 10000 }), {
    formatResult: (res) => {
      return Object.fromEntries(
        res.data.data.map((item) => [item.name, `${item.name} ￥${item.price} 库存 ${item.stock}`]),
      );
    },
  });

  // 医生排名信息
  const { data: doctorRanking } = useRequest(() => queryDoctorRanking(currentUser?.userId));

  const { data: doctors, loading: doctorListLoading } = useRequest(
    () => queryDoctorList({ page: 1, limit: 1000, department: doctorInfo?.department }),
    {
      ready: !!doctorInfo?.department,
      formatResult: (res) => {
        return res.data.data.map((item) => ({
          name: item.name,
          title: item.title,
          avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id % 10}`,
        }));
      },
    },
  );

  const {
    data: appointmentData,
    pagination,
    loading: appointmentLoading,
    refresh,
  } = useRequest(
    ({ current, pageSize }, payload) => {
      if (currentStatus !== '全部') {
        return queryAppointmentList({
          page: current,
          limit: pageSize,
          ...payload,
          doctorId: currentUser?.userId,
          status: currentStatus,
        });
      }
      return queryAppointmentList({
        page: current,
        limit: pageSize,
        ...payload,
        doctorId: currentUser?.userId,
      });
    },
    {
      paginated: true,
      ready: !!currentUser?.userId,
      refreshDeps: [currentStatus],
      formatResult: (res) => {
        return {
          list: res.data.data,
          total: res.data.total,
        };
      },
    },
  );

  // 叫号
  const { run: call } = useRequest(callAppointment, {
    manual: true,
  });

  // 就诊
  const { run: visit } = useRequest(visitAppointment, {
    manual: true,
  });

  const renderActivities = (item: API.Appointment) => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={
            <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.userId % 10}`} />
          }
          title={
            <>
              <Flex justify="space-between">
                <Flex gap={20}>
                  {' '}
                  <a className={styles.username}>{item.patientName}</a>
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
                </Flex>
                {item.status === '待叫号' ? (
                  <a
                    onClick={async () => {
                      await call(item.id);
                      await refresh();
                      message.success('叫号成功');
                    }}
                  >
                    叫号
                  </a>
                ) : item.status === '就诊中' ? (
                  <a
                    onClick={() => {
                      setCurrentAppointment(item);
                      setTreatmentOpen(true);
                      setReadonly(false);
                    }}
                  >
                    处理
                  </a>
                ) : (
                  <Space>
                    <a
                      onClick={() => {
                        setCurrentAppointment(item);
                        setTreatmentOpen(true);
                        setReadonly(true);
                      }}
                    >
                      查看
                    </a>
                    <a
                      onClick={async () => {
                        const newItem = { ...item };
                        const updatedDrugs = await Promise.all(
                          newItem.drug.map(async (d) => {
                            const res = await queryDrugByName(d.name);

                            return {
                              ...d,
                              price: res.data.price,
                              totalPrice: res.data.price * d.count,
                            };
                          }),
                        );
                        newItem.totalAmount = updatedDrugs.reduce(
                          (sum, drug) => sum + drug.totalPrice,
                          0,
                        );
                        newItem.drug = updatedDrugs;
                        generatePrescriptionDoc(newItem);
                      }}
                    >
                      收据
                    </a>
                  </Space>
                )}
              </Flex>

              <div>{item.patientDescription}</div>
            </>
          }
          actions={[<Button key="1">叫号</Button>]}
          description={
            <span className={styles.datetime} title={item.patientDescription}>
              {item.appointmentTime}
            </span>
          }
        />
      </List.Item>
    );
  };

  return (
    <>
      {doctorInfo ? (
        <PageContainer
          content={<PageHeaderContent currentUser={doctorInfo} loading={doctorLoading} />}
          extraContent={<ExtraContent doctorRanking={doctorRanking} />}
        >
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                bodyStyle={{
                  padding: 20,
                }}
                bordered={false}
                className={styles.activeCard}
                title="我的预约"
                // loading={appointmentLoading}
              >
                <Radio.Group
                  style={{
                    marginBottom: 20,
                  }}
                  value={currentStatus}
                  options={[
                    { label: '全部', value: '全部' },
                    { label: '待叫号', value: '待叫号' },
                    { label: '就诊中', value: '就诊中' },
                    { label: '已结束', value: '已结束' },
                  ]}
                  optionType="button"
                  onChange={(e) => {
                    setCurrentStatus(e.target.value);
                  }}
                />
                <List
                  pagination={pagination}
                  loading={appointmentLoading}
                  renderItem={(item) => renderActivities(item)}
                  dataSource={appointmentData?.list || []}
                  className={styles.activitiesList}
                  size="large"
                />
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
                title="医生评分雷达图"
                // loading={data?.radarData?.length === 0}
              >
                {doctorRate && <AppRadar data={doctorRate || []} />}
              </Card>
              <Card
                bodyStyle={{
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
                bordered={false}
                title="团队"
                loading={doctorListLoading}
              >
                <div className={styles.members}>
                  <Row gutter={48}>
                    {doctors?.map((item) => {
                      return (
                        <Col span={12} key={`members-item-${item.id}`}>
                          <Avatar src={item.avatar} size="small" />
                          <span className={styles.member}>
                            {item.name} {'  '}
                            <span style={{ color: '#9c9c9c', fontSize: '12px' }}>{item.title}</span>
                          </span>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
          <Drawer
            title="就诊处理"
            placement="right"
            destroyOnClose={true}
            width={700}
            onClose={() => setTreatmentOpen(false)}
            open={treatmentOpen}
          >
            <ProDescriptions
              title={'患者就诊信息'}
              column={1}
              bordered
              dataSource={currentAppointment}
              style={{ marginBottom: '20px' }}
            >
              <ProDescriptions.Item label="预约编号" dataIndex={'id'} />
              <ProDescriptions.Item label="患者姓名" dataIndex={'patientName'} />
              <ProDescriptions.Item label="邮箱" dataIndex={'patientEmail'} />
              <ProDescriptions.Item label="医生姓名" dataIndex={'doctorName'} />
              <ProDescriptions.Item label="医生职称" dataIndex={'doctorTitle'} />
              <ProDescriptions.Item label="挂号科室" dataIndex={'department'} />
              <ProDescriptions.Item label="预约时间" dataIndex={'appointmentTime'} />
              <ProDescriptions.Item label="病情描述" dataIndex={'patientDescription'} />
            </ProDescriptions>
            <h3>就诊结果</h3>

            <ProForm
              initialValues={currentAppointment}
              readonly={readonly}
              submitter={
                readonly
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
                if (values.drug.length) {
                  const mergedData = values.drug.reduce((acc, current) => {
                    const existingItem = acc.find((item) => item.name === current.name);

                    if (existingItem) {
                      existingItem.count += current.count;
                    } else {
                      acc.push({ ...current });
                    }

                    return acc;
                  }, []);
                  mergedData.forEach(async (item) => {
                    const res = await runQueryDrugByName(item.name);
                    if (res.stock < item.count) {
                      message.error(item.name + '库存不足');
                      return;
                    }
                  });
                }
                // console.log(values);
                await visit(currentAppointment?.id, values);
                message.success('处理成功');
                await refresh();
                setTreatmentOpen(false);
              }}
              form={form}
            >
              <ProFormTextArea
                name="diagnosticResult"
                readonly={readonly}
                label="诊断结果"
                rules={[{ required: true, message: '请输入诊断结果' }]}
              />

              <ProFormList name={'drug'} label="用药清单">
                <ProFormGroup key="group">
                  <ProFormSelect
                    name="name"
                    label="名称"
                    valueEnum={drugType}
                    style={{ minWidth: 250 }}
                    fieldProps={{
                      showSearch: true,
                    }}
                    rules={[
                      {
                        required: true,
                        message: '请选择药品名称',
                      },
                    ]}
                  />
                  <ProFormDigit
                    name="count"
                    label="数量"
                    rules={[
                      {
                        required: true,
                        message: '请输入数量',
                      },
                    ]}
                  />
                  <ProFormText
                    name="useMethod"
                    label="使用方法"
                    rules={[
                      {
                        required: true,
                        message: '请输入使用方法',
                      },
                    ]}
                  />
                </ProFormGroup>
              </ProFormList>
              <ProFormTextArea
                name="doctorAdvice"
                label="医嘱"
                rules={[
                  {
                    required: true,
                    message: '请输入医嘱',
                  },
                ]}
              />
            </ProForm>
          </Drawer>
        </PageContainer>
      ) : (
        <Empty description="暂未录入医生信息，请先录入信息后等待审核" />
      )}
    </>
  );
};
export default Workplace;
