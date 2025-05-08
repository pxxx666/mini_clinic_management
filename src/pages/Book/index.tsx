import { CalendarOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { Avatar, Button, Card, DatePicker, Form, message, Select, Tag, Typography } from 'antd';
import { useState } from 'react';
import styles from './index.less';
import { history, useRequest } from '@umijs/max';
import { queryDepartmentList, queryDoctorList } from '@/services/ant-design-pro';
import { SCHEDULE } from '@/constants/schedule';
import { getDayOfWeek } from '@/utils/getDayofWeek';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const AppointmentBookPage: React.FC = () => {
  const [form] = Form.useForm();
  // 只能展示审核过的医生
  const { run, data, refresh, loading, pagination, params } = useRequest(
    ({ current, pageSize }, payload) =>
      queryDoctorList({ page: current, limit: pageSize, ...payload, auditStatus: '1' }),
    {
      paginated: true,
      formatResult: (res) => {
        return { list: res.data.data, total: res.data.total };
      },
    },
  );
  // 获取科室信息
  const { data: departmentList } = useRequest(() => queryDepartmentList({ page: 1, limit: 1000 }), {
    formatResult: (res) => {
      return res.data.data.map((item) => ({ label: item.name, value: item.name }));
    },
  });

  // Handle search
  const handleSearch = () => {
    // fetchDoctors();
    const values = form.getFieldsValue();
    run({ ...params[0] }, values);
  };

  const handleAppointment = (doctor: API.Doctor) => {
    // 检查医生是否有排班
    console.log(getDayOfWeek(new Date()), doctor.schedule);
    if (!doctor.schedule.includes(getDayOfWeek(new Date()) + '')) {
      message.error('该医生当天没有排班');
      return;
    }
    history.push(`/book/create/${doctor.id}`);
  };

  return (
    <div>
      <Title level={2}>医生预约服务</Title>
      <Paragraph>
        请选择您想要预约的科室、医生职称和日期，我们将为您提供符合条件的医生列表。
      </Paragraph>

      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm} form={form}>
          <Form.Item label="科室" name={'department'}>
            <Select placeholder="请选择科室" style={{ width: 160 }} allowClear>
              {departmentList?.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="职称" name={'title'}>
            <Select placeholder="请选择职称" style={{ width: 160 }} allowClear>
              <Option value="主任医师">主任医师</Option>
              <Option value="副主任医师">副主任医师</Option>
              <Option value="主治医师">主治医师</Option>
              <Option value="专家">专家</Option>
            </Select>
          </Form.Item>

          <Form.Item label="日期" name={'schedule'}>
            <Select placeholder="请选择日期" style={{ width: 160 }} allowClear>
              {Object.keys(SCHEDULE).map((item) => (
                <Option key={item} value={item}>
                  {SCHEDULE[item].text}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <ProList<API.Doctor>
        rowKey="id"
        headerTitle="可预约医生列表"
        pagination={pagination}
        dataSource={data?.list || []}
        loading={loading}
        showActions="always"
        metas={{
          title: {
            render: (_, doctor) => (
              <div className={styles.doctorTitle}>
                <span>{doctor.name}</span>
                <span className={styles.doctorDepartment}>
                  {doctor.department} | {doctor.title}
                </span>
              </div>
            ),
          },
          avatar: {
            render: (_, doctor) => (
              <Avatar
                size={64}
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${doctor.id % 10}`}
                icon={<UserOutlined />}
              />
            ),
          },
          description: {
            render: (_, doctor) => (
              <>
                <div className={styles.specialties}>
                  <MedicineBoxOutlined style={{ marginRight: 8 }} />
                  擅长：
                  {doctor.expertise}
                </div>
                <div>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  可预约日期：
                  {doctor.schedule?.map((date) => (
                    <Tag key={date} color="green" style={{ marginRight: 8 }}>
                      {SCHEDULE[date].text}
                    </Tag>
                  ))}
                </div>
                <Paragraph ellipsis={{ rows: 3 }} style={{ marginTop: 8 }}>
                  {doctor.introduction}
                </Paragraph>
              </>
            ),
          },
          actions: {
            render: (_, doctor) => [
              <Button key="appointment" type="primary" onClick={() => handleAppointment(doctor)}>
                预约
              </Button>,
            ],
          },
        }}
      />
    </div>
  );
};

export default AppointmentBookPage;
