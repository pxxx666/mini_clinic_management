import { useInView } from 'react-intersection-observer';
import { animated, useSpring } from 'react-spring';

const AnimatedCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    delay,
    config: { tension: 280, friction: 20 },
  });

  return (
    <animated.div ref={ref} style={animation}>
      {children}
    </animated.div>
  );
};

export default AnimatedCard;
