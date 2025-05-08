import { Card, Typography } from 'antd';
import { animated, useSpring } from 'react-spring';

const { Title, Paragraph } = Typography;

const FeatureCard = ({ icon, title, description }) => {
  const [props, set] = useSpring(() => ({
    scale: 1,
    shadow: '0 2px 8px rgba(0,0,0,0.06)',
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  return (
    <animated.div
      onMouseEnter={() =>
        set({
          scale: 1.02,
          shadow: '0 12px 24px rgba(0,0,0,0.1)',
        })
      }
      onMouseLeave={() =>
        set({
          scale: 1,
          shadow: '0 2px 8px rgba(0,0,0,0.06)',
        })
      }
      style={{
        transform: props.scale.to((s) => `scale(${s})`),
        boxShadow: props.shadow,
      }}
    >
      <Card className="feature-card" hoverable>
        <animated.div
          className="feature-icon"
          style={{
            transform: props.scale.to((s) => `scale(${s})`),
          }}
        >
          {icon}
        </animated.div>
        <Title level={4}>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Card>
    </animated.div>
  );
};

export default FeatureCard;
