import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  List,
  Radio,
  Result,
  Row,
  Select,
  Statistic,
  Tabs,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const PatientHealthTools: React.FC = () => {
  const [bmiResult, setBmiResult] = useState<any>(null);
  const [calorieResult, setCalorieResult] = useState<any>(null);
  const [waterResult, setWaterResult] = useState<any>(null);
  const [bmiForm] = Form.useForm();
  const [calorieForm] = Form.useForm();
  const [waterForm] = Form.useForm();

  // BMI计算器
  const calculateBMI = (values: any) => {
    const { height, weight } = values;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let category = '';
    let color = '';

    if (bmi < 18.5) {
      category = '体重过轻';
      color = '#faad14';
    } else if (bmi >= 18.5 && bmi < 24) {
      category = '正常范围';
      color = '#52c41a';
    } else if (bmi >= 24 && bmi < 28) {
      category = '超重';
      color = '#faad14';
    } else {
      category = '肥胖';
      color = '#f5222d';
    }

    setBmiResult({
      bmi: bmi.toFixed(1),
      category,
      color,
    });
  };

  // 卡路里计算器
  const calculateCalories = (values: any) => {
    const { gender, age, height, weight, activityLevel } = values;

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let activityMultiplier = 1.2; // 久坐不动
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'veryActive':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }

    const maintenance = Math.round(bmr * activityMultiplier);
    const mildLoss = Math.round(maintenance * 0.9);
    const mediumLoss = Math.round(maintenance * 0.8);
    const heavyLoss = Math.round(maintenance * 0.7);

    setCalorieResult({
      maintenance,
      mildLoss,
      mediumLoss,
      heavyLoss,
    });
  };

  // 水分摄入计算器
  const calculateWater = (values: any) => {
    const { weight, exercise } = values;

    // 基础水分需求：体重(kg) * 30ml
    const baseWater = weight * 30;

    // 运动补充：每30分钟额外补充300ml
    const exerciseWater = exercise * 300;

    // 总水分需求
    const totalWater = baseWater + exerciseWater;

    // 转换为升
    const waterInLiters = totalWater / 1000;

    // 杯数（假设1杯= 250ml）
    const cups = Math.round(totalWater / 250);

    setWaterResult({
      totalWater,
      waterInLiters: waterInLiters.toFixed(1),
      cups,
    });
  };

  const resetBmi = () => {
    bmiForm.resetFields();
    setBmiResult(null);
  };

  const resetCalorie = () => {
    calorieForm.resetFields();
    setCalorieResult(null);
  };

  const resetWater = () => {
    waterForm.resetFields();
    setWaterResult(null);
  };

  const renderBmiCalculator = () => (
    <div>
      <Paragraph>
        身体质量指数(BMI)是一个人的体重(公斤)除以身高(米)的平方。BMI提供了一个简单的方法来评估一个人是否有合适的体重。
      </Paragraph>

      {bmiResult ? (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Result
            status="success"
            title="BMI计算结果"
            subTitle={
              <div style={{ marginTop: 16 }}>
                <Statistic
                  title="您的BMI"
                  value={bmiResult.bmi}
                  valueStyle={{ color: bmiResult.color }}
                  suffix={`(${bmiResult.category})`}
                />
              </div>
            }
            extra={[
              <Button type="primary" key="reset" onClick={resetBmi}>
                重新计算
              </Button>,
            ]}
          />
          <div style={{ marginTop: 24 }}>
            <Title level={5}>BMI范围参考：</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Text strong style={{ color: '#faad14' }}>
                  少于18.5
                </Text>
                <div>体重过轻</div>
              </div>
              <div>
                <Text strong style={{ color: '#52c41a' }}>
                  18.5 - 23.9
                </Text>
                <div>正常范围</div>
              </div>
              <div>
                <Text strong style={{ color: '#faad14' }}>
                  24 - 27.9
                </Text>
                <div>超重</div>
              </div>
              <div>
                <Text strong style={{ color: '#f5222d' }}>
                  28或以上
                </Text>
                <div>肥胖</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Form form={bmiForm} layout="vertical" onFinish={calculateBMI}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="height"
                label="身高 (厘米)"
                rules={[{ required: true, message: '请输入身高' }]}
              >
                <InputNumber min={1} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="体重 (公斤)"
                rules={[{ required: true, message: '请输入体重' }]}
              >
                <InputNumber min={1} max={500} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              计算BMI
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
  const renderCalorieCalculator = () => (
    <div>
      <Paragraph>
        基础代谢率(BMR)是人体在完全休息状态下维持生命所需的最低热量。每日卡路里需求则根据您的活动水平计算。
      </Paragraph>

      {calorieResult ? (
        <div style={{ marginBottom: 24 }}>
          <Result
            status="success"
            title="卡路里计算结果"
            subTitle="根据您提供的信息，以下是您的每日卡路里需求："
          />
          <Row gutter={16} style={{ textAlign: 'center' }}>
            <Col span={6}>
              <Card>
                <Statistic title="维持体重" value={calorieResult.maintenance} suffix="卡路里" />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="轻度减重"
                  value={calorieResult.mildLoss}
                  suffix="卡路里"
                  valueStyle={{ color: '#52c41a' }}
                />
                <div>每周减重约0.25kg</div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="中度减重"
                  value={calorieResult.mediumLoss}
                  suffix="卡路里"
                  valueStyle={{ color: '#1890ff' }}
                />
                <div>每周减重约0.5kg</div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="快速减重"
                  value={calorieResult.heavyLoss}
                  suffix="卡路里"
                  valueStyle={{ color: '#faad14' }}
                />
                <div>每周减重约0.75kg</div>
              </Card>
            </Col>
          </Row>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button type="primary" onClick={resetCalorie}>
              重新计算
            </Button>
          </div>
        </div>
      ) : (
        <Form form={calorieForm} layout="vertical" onFinish={calculateCalories}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <InputNumber min={1} max={120} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="height"
                label="身高 (厘米)"
                rules={[{ required: true, message: '请输入身高' }]}
              >
                <InputNumber min={1} max={300} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="体重 (公斤)"
                rules={[{ required: true, message: '请输入体重' }]}
              >
                <InputNumber min={1} max={500} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="activityLevel"
            label="活动水平"
            rules={[{ required: true, message: '请选择活动水平' }]}
          >
            <Select>
              <Option value="sedentary">久坐不动 (几乎不运动)</Option>
              <Option value="light">轻度活动 (每周运动1-3天)</Option>
              <Option value="moderate">中度活动 (每周运动3-5天)</Option>
              <Option value="active">积极活动 (每周运动6-7天)</Option>
              <Option value="veryActive">非常活跃 (每天重体力劳动或高强度训练)</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              计算卡路里需求
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );

  const renderWaterCalculator = () => (
    <div>
      <Paragraph>
        水是人体必需的营养素，对于维持健康至关重要。这个工具可以帮助您计算每日所需的水分摄入量。
      </Paragraph>

      {waterResult ? (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Result
            status="success"
            title="水分摄入计算结果"
            subTitle="根据您提供的信息，以下是您的每日水分需求："
          />
          <Row gutter={16} style={{ textAlign: 'center', marginBottom: 24 }}>
            <Col span={8}>
              <Statistic
                title="每日水分需求"
                value={waterResult.waterInLiters}
                suffix="升"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={8}>
              <Statistic title="毫升" value={waterResult.totalWater} suffix="ml" />
            </Col>
            <Col span={8}>
              <Statistic
                title="大约杯数"
                value={waterResult.cups}
                suffix="杯"
                valueStyle={{ color: '#52c41a' }}
              />
              <div>(每杯250ml)</div>
            </Col>
          </Row>
          <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={resetWater}>
              重新计算
            </Button>
          </div>
        </div>
      ) : (
        <Form form={waterForm} layout="vertical" onFinish={calculateWater}>
          <Form.Item
            name="weight"
            label="体重 (公斤)"
            rules={[{ required: true, message: '请输入体重' }]}
          >
            <InputNumber min={1} max={500} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="exercise"
            label="每日运动时长 (小时)"
            rules={[{ required: true, message: '请输入运动时长' }]}
            initialValue={0}
          >
            <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              计算水分需求
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );

  const healthToolsData = [
    {
      title: 'BMI计算器',
      description: '计算您的身体质量指数(BMI)，评估您的体重状况。',
      content: renderBmiCalculator,
    },
    {
      title: '卡路里计算器',
      description: '计算您的基础代谢率(BMR)和每日卡路里需求。',
      content: renderCalorieCalculator,
    },
    {
      title: '水分摄入计算器',
      description: '根据体重和活动水平计算每日所需的水分摄入量。',
      content: renderWaterCalculator,
    },
  ];

  return (
    <PageContainer title="健康工具">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="可用工具" style={{ height: '100%' }}>
            <List
              itemLayout="horizontal"
              dataSource={healthToolsData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={<a>{item.title}</a>} description={item.description} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <Tabs
              defaultActiveKey="0"
              items={healthToolsData.map((item, index) => ({
                key: String(index),
                label: item.title,
                children: item.content(),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default PatientHealthTools;
