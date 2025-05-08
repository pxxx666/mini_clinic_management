import { useModel } from '@umijs/max';
import AdminWelcome from './components/AdminWelcome';
import UserWelcome from './components/UserWelcome';

const Welcome = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  console.log(currentUser);

  // 由于 AdminWelcome 未定义，暂时返回一个空的 div，需要后续引入或定义该组件
  return currentUser?.role === 'patient' ? <UserWelcome /> : <AdminWelcome />;
};
export default Welcome;
