import {
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Layout, Row, Space, Tag, Timeline, Typography } from 'antd';
// import AnimatedCard from './components/AnimatedCard';
import FeatureCard from './components/FeatureCard';
import WelcomeHero from './components/WelcomeHero';
import './style.less';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const UserWelcome = () => {
  const features = [
    {
      icon: <DashboardOutlined />,
      title: '智能仪表盘',
      description: '实时监控诊所运营数据，帮助您做出明智决策',
    },
    {
      icon: <TeamOutlined />,
      title: '患者管理',
      description: '全面的患者信息管理，包括病历、处方和随访记录',
      color: '#006064',
      bgGradient: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
    },
    {
      icon: <CalendarOutlined />,
      title: '预约系统',
      description: '灵活的在线预约系统，提高就医效率',
      color: '#1b5e20',
      bgGradient: 'linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)',
    },
    {
      icon: <MedicineBoxOutlined />,
      title: '药品管理',
      description: '智能库存管理，自动补货提醒',
      color: '#bf360c',
      bgGradient: 'linear-gradient(135deg, #FBE9E7 0%, #FFCCBC 100%)',
    },
    {
      icon: <FileTextOutlined />,
      title: '电子病历',
      description: '标准化电子病历系统，支持快速记录和查询',
      color: '#4a148c',
      bgGradient: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    },
    {
      icon: <BookOutlined />,
      title: '医疗知识库',
      description: '丰富的医疗资源库，辅助临床决策',
      color: '#0d47a1',
      bgGradient: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)',
    },
  ];

  const quickActions = [
    {
      icon: <UserOutlined />,
      text: '接诊患者',
      color: '#1890ff',
    },
    {
      icon: <CalendarOutlined />,
      text: '预约管理',
      color: '#52c41a',
    },
    {
      icon: <MedicineBoxOutlined />,
      text: '药品管理',
      color: '#faad14',
    },
    {
      icon: <SettingOutlined />,
      text: '系统设置',
      color: '#722ed1',
    },
  ];
  return (
    <Layout className="layout">
      <Content>
        <WelcomeHero />

        <div className="main-content">
          <section className="quick-actions">
            {/* <AnimatedCard> */}
            <Title level={3}>快速入口</Title>
            {/* </AnimatedCard> */}
            <Row gutter={[24, 24]} className="action-buttons">
              {quickActions.map((action, index) => (
                <Col xs={12} sm={6} key={index}>
                  {/* <AnimatedCard delay={index * 100}> */}
                  <Button
                    type="text"
                    className="action-button hover-float"
                    style={{ color: action.color }}
                    icon={action.icon}
                  >
                    {action.text}
                  </Button>
                  {/* </AnimatedCard> */}
                </Col>
              ))}
            </Row>
          </section>

          <section className="features">
            {/* <AnimatedCard> */}
            <Title level={3}>系统功能</Title>
            {/* </AnimatedCard> */}
            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  {/* <AnimatedCard delay={index * 150}> */}
                  <FeatureCard {...feature} />
                  {/* </AnimatedCard> */}
                </Col>
              ))}
            </Row>
          </section>

          <section className="news-updates">
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                {/* <AnimatedCard> */}
                <Card title="最新动态" className="news-card">
                  <Timeline
                    items={[
                      {
                        color: '#000',
                        dot: <RocketOutlined />,
                        children: (
                          <div className="timeline-item">
                            <Tag color="black">新功能</Tag>
                            <span>智能问诊系统正式上线</span>
                            <div className="timeline-date">2023-12-01</div>
                          </div>
                        ),
                      },
                      {
                        color: '#000',
                        dot: <SafetyCertificateOutlined />,
                        children: (
                          <div className="timeline-item">
                            <Tag color="green">安全更新</Tag>
                            <span>系统安全性全面升级</span>
                            <div className="timeline-date">2023-11-28</div>
                          </div>
                        ),
                      },
                      {
                        color: '#000',
                        dot: <ThunderboltOutlined />,
                        children: (
                          <div className="timeline-item">
                            <Tag color="blue">性能优化</Tag>
                            <span>系统响应速度提升50%</span>
                            <div className="timeline-date">2023-11-25</div>
                          </div>
                        ),
                      },
                      {
                        color: '#000',
                        dot: <StarOutlined />,
                        children: (
                          <div className="timeline-item">
                            <Tag color="purple">功能优化</Tag>
                            <span>用户界面全新升级</span>
                            <div className="timeline-date">2023-11-20</div>
                          </div>
                        ),
                      },
                    ]}
                  />
                </Card>
                {/* </AnimatedCard> */}
              </Col>
            </Row>
          </section>

          <section className="certification-section">
            {/* <AnimatedCard> */}
            <Row gutter={[24, 24]} justify="center" align="middle">
              <Col xs={24} md={12}>
                <div className="cert-content">
                  <Title level={3}>安全认证</Title>
                  <Space direction="vertical" size="large">
                    <div className="cert-item">
                      <CheckCircleOutlined /> ISO27001信息安全认证
                    </div>
                    <div className="cert-item">
                      <CheckCircleOutlined /> 医疗器械软件认证
                    </div>
                    <div className="cert-item">
                      <CheckCircleOutlined /> 数据隐私保护认证
                    </div>
                  </Space>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="cert-image">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80"
                    alt="Security Certification"
                  />
                </div>
              </Col>
            </Row>
            {/* </AnimatedCard> */}
          </section>
          <section className="get-started">
            {/* <AnimatedCard> */}
            <Card className="get-started-card">
              <Title level={3}>开始使用</Title>
              <Paragraph>立即开始使用智慧诊所管理系统，提升诊所管理效率</Paragraph>
              <Space size="large">
                <Button type="primary" size="large" className="pulse-button">
                  查看教程
                </Button>
                <Button size="large" className="hover-float">
                  系统帮助
                </Button>
              </Space>
              <Row className="support-info" justify="center" style={{ marginTop: 24 }}>
                <Col xs={24} sm={8}>
                  <div className="support-item">
                    <BellOutlined />
                    <div>7x24小时支持</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="support-item">
                    <SafetyCertificateOutlined />
                    <div>安全防护</div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="support-item">
                    <ThunderboltOutlined />
                    <div>快速响应</div>
                  </div>
                </Col>
              </Row>
            </Card>
            {/* </AnimatedCard> */}
          </section>
        </div>
      </Content>
    </Layout>
  );
};

export default UserWelcome;
