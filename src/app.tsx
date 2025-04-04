import { AvatarDropdown, AvatarName, Footer } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';
import defaultSettings from '../config/defaultSettings';
import { useTokenLocalStorage } from './hooks/useTokenLocalStorage';
import { queryCurrentUser } from './services/ant-design-pro';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.UserVO;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.UserVO | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.email,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// Error handling configuration
export const request: RequestConfig = {
  // Other request configurations...

  errorConfig: {
    // Default error handling
    errorHandler(error: any) {
      // Handle HTTP errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;

        switch (status) {
          case 400:
            message.error(data.message || '请求参数错误');
            break;
          case 401:
            message.error(data.message || '未授权，请重新登录');
            // You can redirect to login page here if needed
            // history.push('/user/login');
            break;
          case 403:
            message.error(data.message || '拒绝访问');
            break;
          case 404:
            message.error(data.message || '请求资源不存在');
            break;
          case 500:
            message.error(data.message || '服务器错误');
            break;
          default:
            message.error(data.message || `请求错误 ${status}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        message.error('网络异常，请检查您的网络连接');
      }

      // Throw the error to stop the execution chain
      throw error;
    },
  },

  // Request interceptors
  requestInterceptors: [
    (url: string, options: any) => {
      // Add your request interceptors here
      // For example, add authorization token
      const { get } = useTokenLocalStorage();
      const token = get();

      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { url, options };
    },
  ],

  // Response interceptors
  responseInterceptors: [
    (response: any) => {
      // Add your response interceptors here
      // You can modify the response data here
      return response;
    },
  ],
};
