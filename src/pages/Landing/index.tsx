import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from '@/components/GlowingStars';
import { useTokenLocalStorage } from '@/hooks/useTokenLocalStorage';
import {
  ApiOutlined,
  CalendarOutlined,
  CloudSyncOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  FileSearchOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Card, Col, Divider, Image, List, Row, Space, Statistic, Typography } from 'antd';
import React from 'react';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const Landing: React.FC = () => {
  const { get } = useTokenLocalStorage();
  const token = get();
  const link = token ? '/welcome' : '/user/login';
  const testimonials = [
    {
      name: '张三医生',
      title: '心脏科专家',
      content:
        '这个平台彻底改变了我的日常工作流程。预约管理系统使我能够更有效地安排时间，为患者提供更优质的服务。',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: '李四',
      title: '长期患者',
      content:
        '在线预约系统让我的就医体验变得轻松顺畅，无需长时间排队等候。医生评价功能也帮助我找到了最适合的专科医生。',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: '王五',
      title: '医院管理员',
      content:
        '系统的数据分析功能帮助我们实时监控医院运营状况，优化资源分配，提高了整体服务质量和患者满意度。',
      avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    },
  ];

  const statistics = [
    { title: '注册医生', value: '500+', icon: <MedicineBoxOutlined /> },
    { title: '日均预约', value: '1,200+', icon: <CalendarOutlined /> },
    { title: '患者满意度', value: '96%', icon: <HeartOutlined /> },
    { title: '医疗机构', value: '120+', icon: <MedicineBoxOutlined /> },
  ];

  const features = [
    {
      icon: <CalendarOutlined className="feature-icon" />,
      title: '智能预约系统',
      description: '基于AI算法的预约系统，自动匹配最合适的医生和时间，减少等待时间，提高就医效率。',
    },
    {
      icon: <UserOutlined className="feature-icon" />,
      title: '医生资源管理',
      description: '全面的医生信息档案，包括专业背景、出诊时间和患者评价，帮助患者做出明智的选择。',
    },
    {
      icon: <UserOutlined className="feature-icon" />,
      title: '患者健康档案',
      description:
        '安全存储患者健康记录，提供历史就诊数据、检查结果和治疗方案，实现医疗信息的连续性。',
    },
    {
      icon: <MedicineBoxOutlined className="feature-icon" />,
      title: '药物追踪系统',
      description:
        '实时监控药物库存和使用情况，确保患者能够及时获取所需药物，并防止药物过期和浪费。',
    },
    {
      icon: <SecurityScanOutlined className="feature-icon" />,
      title: '数据安全保障',
      description: '采用先进的加密技术和访问控制措施，确保敏感医疗数据的安全，符合行业合规要求。',
    },
    {
      icon: <MobileOutlined className="feature-icon" />,
      title: '全渠道接入',
      description:
        '支持网页、移动应用和微信小程序等多种渠道访问，为患者和医护人员提供灵活便捷的使用体验。',
    },
    {
      icon: <CloudSyncOutlined className="feature-icon" />,
      title: '实时数据同步',
      description: '跨平台数据实时同步，确保医疗信息的一致性和准确性，提高医疗决策的效率和质量。',
    },
    {
      icon: <DashboardOutlined className="feature-icon" />,
      title: '智能分析仪表盘',
      description:
        '强大的数据可视化功能，帮助医院管理者分析就诊趋势、资源利用率和服务质量，支持数据驱动的决策。',
    },
  ];

  const solutions = [
    {
      title: '智慧门诊管理解决方案',
      description:
        '整合预约、挂号、分诊、医生排班等功能，优化门诊流程，提高运营效率，改善患者就医体验。',
      icon: <TeamOutlined />,
    },
    {
      title: '远程医疗咨询平台',
      description:
        '通过视频会议、在线问诊等功能，实现医患远程交流，解决地理限制，扩大优质医疗资源覆盖范围。',
      icon: <ApiOutlined />,
    },
    {
      title: '医疗数据智能分析系统',
      description: '基于大数据和人工智能技术，挖掘医疗数据价值，辅助医生诊断，促进精准医疗发展。',
      icon: <DatabaseOutlined />,
    },
    {
      title: '医药供应链管理平台',
      description: '贯通药品采购、库存管理、配送物流等环节，优化医药供应链，确保药品安全有效使用。',
      icon: <ExperimentOutlined />,
    },
  ];

  return (
    <div className="landing-page">
      {/* Background particles/stars effect */}
      <div className="background-stars">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 5 + 3}s linear infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      {/* Header and Content */}
      <div className="container">
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>
              <span className="gradient-text">Medical</span>
              <span style={{ fontWeight: 700 }}>Nexus</span>
            </Title>
          </Col>
          <Col>
            <Space size={24}>
              <Button
                shape="round"
                style={{
                  background: 'rgba(17, 168, 253, 0.1)',
                  borderColor: '#11a8fd',
                  color: '#11a8fd',
                }}
                onClick={() => history.push(link)}
              >
                立即体验
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Hero Section */}
        <Row gutter={[48, 48]} style={{ marginTop: 80, marginBottom: 100 }}>
          <Col xs={24} lg={12}>
            <div style={{ paddingTop: 40 }}>
              <Title
                className="hero-title"
                style={{
                  fontSize: '3.5rem',
                  lineHeight: 1.1,
                  marginBottom: 24,
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                智慧微诊所平台
                <br />
                <span className="gradient-text" style={{ fontWeight: 800 }}>
                  连接医患，优化就医体验
                </span>
              </Title>
              <Paragraph
                style={{
                  fontSize: '1.2rem',
                  color: '#bbc',
                  marginBottom: 40,
                  maxWidth: 600,
                }}
              >
                我们的智能医疗预约系统通过数字化技术革新传统就医流程，实现资源精准匹配，让患者享受便捷高效的医疗服务，让医生管理诊疗时间更加灵活。提供全方位的医疗信息管理和分析功能，助力医疗机构提升运营效率和服务质量。
              </Paragraph>
              <Space size="large">
                <Button
                  className="hero-btn"
                  size="large"
                  icon={<CalendarOutlined />}
                  onClick={() => history.push(link)}
                >
                  立即预约
                </Button>
                <Button
                  ghost
                  size="large"
                  style={{
                    borderColor: '#666',
                    color: '#ccc',
                    height: 48,
                    borderRadius: 24,
                  }}
                  onClick={() => history.push(link)}
                >
                  了解更多
                </Button>
              </Space>
            </div>
          </Col>
          <Col
            xs={24}
            lg={12}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 500,
                height: 400,
              }}
            >
              <GlowingStarsBackgroundCard
                className="w-full h-full"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              >
                <GlowingStarsTitle>智慧微诊所新纪元</GlowingStarsTitle>
                <GlowingStarsDescription>
                  AI驱动的医疗预约管理平台，实现医患精准匹配，提升医疗资源利用效率，改善就医体验。
                </GlowingStarsDescription>
              </GlowingStarsBackgroundCard>
            </div>
          </Col>
        </Row>

        {/* Statistics Section */}
        <div className="statistics-section" style={{ marginBottom: 120 }}>
          <Row gutter={[32, 32]} justify="center">
            {statistics.map((stat, index) => (
              <Col xs={12} md={6} key={index}>
                <Card className="stat-card" bordered={false}>
                  <div className="stat-icon">{stat.icon}</div>
                  <Statistic
                    title={<span style={{ color: '#bbc', fontSize: '1rem' }}>{stat.title}</span>}
                    value={stat.value}
                    valueStyle={{
                      color: '#fff',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {/* Feature Section */}
        <div style={{ marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Text
              style={{
                color: '#11a8fd',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '1px',
                marginBottom: 16,
                display: 'block',
              }}
            >
              核心功能
            </Text>
            <Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
              全面创新的智慧微诊所平台
            </Title>
            <Paragraph
              style={{
                color: '#bbc',
                fontSize: '1.1rem',
                maxWidth: 700,
                margin: '0 auto',
              }}
            >
              我们的系统集成了预约管理、医生排班、患者档案、药物追踪等多项功能，
              通过数字化手段实现医疗资源的优化配置，提高医疗服务效率和质量。
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="feature-card" bordered={false} style={{ height: '100%' }}>
                  {feature.icon}
                  <Title level={4} style={{ color: '#fff' }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: '#bbc' }}>{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Solution Section */}
        <div style={{ marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Text
              style={{
                color: '#11a8fd',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '1px',
                marginBottom: 16,
                display: 'block',
              }}
            >
              行业解决方案
            </Text>
            <Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
              为医疗行业量身定制的整体解决方案
            </Title>
            <Paragraph
              style={{
                color: '#bbc',
                fontSize: '1.1rem',
                maxWidth: 700,
                margin: '0 auto',
              }}
            >
              我们深入理解医疗行业的需求和挑战，提供全面、高效、安全的医疗信息化解决方案，
              助力医疗机构数字化转型，提升医疗服务质量。
            </Paragraph>
          </div>

          <Row gutter={[48, 48]}>
            {solutions.map((solution, index) => (
              <Col xs={24} md={12} key={index}>
                <div className="solution-card">
                  <div className="solution-icon">{solution.icon}</div>
                  <div className="solution-content">
                    <Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
                      {solution.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: '#bbc',
                        fontSize: '1rem',
                        marginBottom: 0,
                      }}
                    >
                      {solution.description}
                    </Paragraph>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        {/* Process Section */}
        <div style={{ marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Text
              style={{
                color: '#11a8fd',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '1px',
                marginBottom: 16,
                display: 'block',
              }}
            >
              便捷流程
            </Text>
            <Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
              简单几步，体验智能医疗预约
            </Title>
            <Paragraph
              style={{
                color: '#bbc',
                fontSize: '1.1rem',
                maxWidth: 700,
                margin: '0 auto',
              }}
            >
              我们精心设计的用户流程，让您轻松完成从注册到预约就诊的全过程，享受无缝的数字化医疗体验。
            </Paragraph>
          </div>

          <Row gutter={[24, 48]} justify="center" className="process-row">
            {[
              {
                step: '01',
                title: '注册账号',
                description: '简单填写个人信息，快速完成注册，获取系统访问权限。',
                icon: <UserOutlined />,
              },
              {
                step: '02',
                title: '选择医生',
                description: '浏览医生资料和评价，根据专业背景和患者反馈选择合适的医生。',
                icon: <FileSearchOutlined />,
              },
              {
                step: '03',
                title: '预约时间',
                description: '查看医生出诊计划，选择方便的就诊时间，系统自动确认预约。',
                icon: <CalendarOutlined />,
              },
              {
                step: '04',
                title: '就诊提醒',
                description: '系统自动发送预约提醒，支持在线修改或取消预约，灵活管理就诊计划。',
                icon: <SafetyCertificateOutlined />,
              },
            ].map((process, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div className="process-card">
                  <div className="process-step">{process.step}</div>
                  <div className="process-icon">{process.icon}</div>
                  <Title level={4} style={{ color: '#fff', marginTop: 16 }}>
                    {process.title}
                  </Title>
                  <Paragraph style={{ color: '#bbc' }}>{process.description}</Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Testimonials Section */}
        <div style={{ marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Text
              style={{
                color: '#11a8fd',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '1px',
                marginBottom: 16,
                display: 'block',
              }}
            >
              用户评价
            </Text>
            <Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
              他们如何评价我们的系统
            </Title>
            <Paragraph
              style={{
                color: '#bbc',
                fontSize: '1.1rem',
                maxWidth: 700,
                margin: '0 auto',
              }}
            >
              来自医生、患者和医院管理者的真实反馈，见证我们系统的实际应用价值。
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <Paragraph style={{ color: '#bbc', fontSize: '1rem' }}>
                      &ldquo;{testimonial.content}&rdquo;
                    </Paragraph>
                  </div>
                  <Divider
                    style={{
                      borderColor: 'rgba(255,255,255,0.1)',
                      margin: '20px 0',
                    }}
                  />
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        preview={false}
                        style={{ borderRadius: '50%' }}
                      />
                    </div>
                    <div className="testimonial-info">
                      <Text strong style={{ color: '#fff', display: 'block' }}>
                        {testimonial.name}
                      </Text>
                      <Text style={{ color: '#11a8fd' }}>{testimonial.title}</Text>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        {/* CTA Section */}
        <div className="cta-section" style={{ marginBottom: 80 }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={16}>
              <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
                准备体验智能医疗预约系统？
              </Title>
              <Paragraph style={{ color: '#bbc', fontSize: '1.1rem', marginBottom: 0 }}>
                立即注册，探索更高效、便捷的医疗预约管理方式，享受数字化医疗服务带来的全新体验。
              </Paragraph>
            </Col>
            <Col xs={24} lg={8} style={{ textAlign: 'center' }}>
              <Button className="hero-btn" size="large" block>
                开始您的数字医疗之旅
              </Button>
            </Col>
          </Row>
        </div>

        {/* Footer */}
        <Row justify="space-between" className="footer">
          <Col>
            <Title level={4} style={{ color: '#fff', marginBottom: 24 }}>
              <span className="gradient-text">Medical</span>
              <span style={{ fontWeight: 700 }}>Nexus</span>
            </Title>
            <Paragraph style={{ color: '#777', maxWidth: 400 }}>
              我们致力于通过技术创新改变传统医疗服务模式，提供便捷高效的医疗预约解决方案，连接医患，优化医疗资源配置。
            </Paragraph>
          </Col>
          <Col>
            <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>
              快速链接
            </Title>
            <List
              split={false}
              dataSource={['首页', '功能', '解决方案', '客户案例', '关于我们', '联系我们']}
              renderItem={(item) => (
                <List.Item style={{ borderBottom: 'none', padding: '4px 0' }}>
                  <Button type="text" style={{ color: '#777', padding: 0 }}>
                    {item}
                  </Button>
                </List.Item>
              )}
            />
          </Col>
          <Col>
            <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>
              联系我们
            </Title>
            <List
              split={false}
              dataSource={[
                '电话: 189-123-4567',
                '邮箱: 1209304680@medicalnexus.com',
                '地址: 长沙学院',
              ]}
              renderItem={(item) => (
                <List.Item
                  style={{
                    borderBottom: 'none',
                    padding: '4px 0',
                    color: '#777',
                  }}
                >
                  {item}
                </List.Item>
              )}
            />
          </Col>
          <Col span={24} style={{ marginTop: 40, textAlign: 'center' }}>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Text style={{ color: '#777' }}>© 2025 MedicalNexus智慧微诊所平台. 保留所有权利.</Text>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Landing;
