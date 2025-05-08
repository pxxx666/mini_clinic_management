import { Button, Space, Typography } from 'antd';
import { animated, config, useSpring } from 'react-spring';

const { Title, Paragraph } = Typography;

const WelcomeHero = () => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.gentle,
  });

  const imageAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8) translateX(50px)' },
    to: { opacity: 1, transform: 'scale(1) translateX(0)' },
    delay: 300,
    config: config.wobbly,
  });

  return (
    <div className="hero-section">
      <animated.div className="hero-content" style={fadeIn}>
        <Title className="animate-title">
          欢迎使用
          <span className="highlight"> MedicalNexus</span>
        </Title>
        {/* <div className="typical-wrapper">
          <Typical
            steps={['提升诊所管理效率', 2000, '优化患者就医体验', 2000, '助力医疗数字化转型', 2000]}
            loop={Infinity}
            wrapper="p"
          />
        </div> */}
        <Paragraph className="hero-description">
          专业的诊所管理解决方案，助力您的诊所实现智能化、数字化转型
        </Paragraph>
        <Space size="large" className="hero-buttons">
          <Button type="primary" size="large" className="pulse-button">
            立即开始
          </Button>
          <Button size="large" className="hover-float">
            了解更多
          </Button>
        </Space>
      </animated.div>
      <animated.div className="hero-image" style={imageAnimation}>
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
          alt="Medical Professional"
        />
      </animated.div>
    </div>
  );
};

export default WelcomeHero;
