import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'title',
          title: '智慧微诊所系统',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/pxxx666/mini_clinic_management',
          blankTarget: true,
        },
        {
          key: 'Autor',
          title: 'Pxxx666',
          href: 'https://github.com/pxxx666/mini_clinic_management',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
