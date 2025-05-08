import { createAppointment, queryDoctorDetail } from '@/services/ant-design-pro';
import { ProDescriptions, PageContainer } from '@ant-design/pro-components';
import { history, useModel, useParams, useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { useState } from 'react';
const BookCreate = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const params = useParams();
  const { doctorId } = params; // 医生id
  const { data: doctor } = useRequest(() => queryDoctorDetail(doctorId));
  // 病情描述
  const [description, setDescription] = useState('');
  // 创建预约
  const { run } = useRequest(createAppointment, {
    manual: true,
    onSuccess: () => {
      message.success('预约成功');
      history.push('/book');
    },
  });

  const handleSubmit = async () => {
    const bookDetail = {
      userId: currentUser?.userId,
      patientName: currentUser?.realName,
      patientEmail: currentUser?.email,
      doctorId: doctor?.id,
      doctorName: doctor?.name,
      doctorTitle: doctor?.title,
      department: doctor?.department,
      appointmentTime: moment().format('YYYY-MM-DD'),
      patientDescription: description,
    };
    await run(bookDetail);
  };
  return (
    <PageContainer header={{ title: '创建预约' }}>
      <ProDescriptions title={'预约信息'} column={1} bordered>
        <ProDescriptions.Item label="预约人ID">{currentUser?.userId}</ProDescriptions.Item>
        <ProDescriptions.Item label="患者姓名">{currentUser?.realName}</ProDescriptions.Item>
        <ProDescriptions.Item label="邮箱">{currentUser?.email}</ProDescriptions.Item>
        <ProDescriptions.Item label="医生姓名">{doctor?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="医生职称">{doctor?.title}</ProDescriptions.Item>
        <ProDescriptions.Item label="挂号科室">{doctor?.department}</ProDescriptions.Item>
        <ProDescriptions.Item label="预约时间">
          {moment().format('YYYY-MM-DD')}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="病情描述">
          <TextArea
            rows={4}
            placeholder="请输入病情描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </ProDescriptions.Item>
      </ProDescriptions>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Button
          type="primary"
          style={{ margin: '30px auto', width: '16vw' }}
          onClick={handleSubmit}
        >
          提交预约
        </Button>
      </div>
    </PageContainer>
  );
};
export default BookCreate;
