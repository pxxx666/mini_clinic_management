import React from 'react';
import styles from './style.less';
type Props = {
  onClick?: () => void;
  children?: React.ReactNode;
  key?: string;
  className?: string;
};
export const AppButton: React.FC<Props> = (props) => {
  const { onClick, children, key } = props;
  return (
    <a key={key} className={styles['fancy']} href="#" onClick={onClick}>
      <span className={styles['top-key']}></span>
      <span className={styles['text']}>{children}</span>
      <span className={styles['bottom-key-1']}></span>
      <span className={styles['bottom-key-2']}></span>
    </a>
  );
};
