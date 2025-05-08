import { queryAppointmentList, queryDrugTypeList, queryUserList } from '@/services/ant-design-pro';
import {
  CalendarOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd';
import React, { useEffect } from 'react';

const { Title, Paragraph } = Typography;

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  links: { name: string; path: string }[];
  color: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, description, links, color }) => (
  <Card
    style={{
      height: '100%',
      borderTop: `2px solid ${color}`,
    }}
    actions={links.map((link, index) => (
      <Button key={index} type="link" onClick={() => history.push(link.path)}>
        {link.name}
      </Button>
    ))}
  >
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <div
          style={{
            background: color,
            color: '#fff',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
      </Space>
      <Paragraph style={{ marginTop: 16 }}>{description}</Paragraph>
    </Space>
  </Card>
);

const AdminWelcome: React.FC = () => {
  const { data } = useRequest(() => queryUserList({ page: 1, limit: 10000 }), {
    formatResult: (res) => {
      const patientCount = res.data.data.filter((user) => user.role === 'patient').length;
      const doctorCount = res.data.data.filter((user) => user.role === 'doctor').length;
      return {
        patientCount,
        doctorCount,
      };
    },
  });
  const { data: appointmentData } = useRequest(
    () => queryAppointmentList({ page: 1, limit: 10000 }),
    {
      formatResult: (res) => {
        return res.data.total;
      },
    },
  );
  const { data: typeList } = useRequest(queryDrugTypeList);

  const modules = [
    {
      title: '用户管理模块',
      icon: <UserOutlined />,
      description: '管理系统用户，包括用户注册、登录和角色管理功能',
      links: [{ name: '用户管理', path: '/user/management' }],
      color: '#722ED1',
    },
    {
      title: '预约管理模块',
      icon: <CalendarOutlined />,
      description: '处理医疗预约的创建、确认和管理功能',
      links: [{ name: '预约功能', path: '/book' }],
      color: '#13C2C2',
    },
    {
      title: '医生信息模块',
      icon: <MedicineBoxOutlined />,
      description: '管理医生档案、评价和医疗单系统',
      links: [{ name: '医生档案管理', path: '/doctor/manage' }],
      color: '#1890FF',
    },
    {
      title: '药物服务模块',
      icon: <ExperimentOutlined />,
      description: '管理药物库存和药品信息',
      links: [{ name: '药物库存管理', path: '/drug' }],
      color: '#EB2F96',
    },
    {
      title: '患者服务模块',
      icon: <HeartOutlined />,
      description: '提供个人健康记录和健康管理工具',
      links: [
        { name: 'AI问诊', path: '/aiDoctor' },
        { name: '健康管理工具', path: '/health-tools' },
      ],
      color: '#52C41A',
    },
  ];

  return (
    <PageContainer title="医疗预约系统" subTitle="一站式医疗服务平台">
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <Statistic
              title="医生总数"
              value={data?.doctorCount || 0}
              prefix={<MedicineBoxOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic title="患者总数" value={data?.patientCount || 0} prefix={<UserOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic
              title="预约总数"
              value={appointmentData || 0}
              prefix={<CalendarOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="药品种类"
              value={typeList?.distinctNames.length || 0}
              prefix={<ExperimentOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {modules.map((module, index) => (
          <Col key={index} xs={24} sm={24} md={12} lg={8}>
            <ModuleCard
              title={module.title}
              icon={module.icon}
              description={module.description}
              links={module.links}
              color={module.color}
            />
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default AdminWelcome;
