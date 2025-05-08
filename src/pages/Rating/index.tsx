import { queryEvaluationsByDoctorId } from '@/services/ant-design-pro';
import { PageContainer } from '@ant-design/pro-components';
import { request, useModel, useRequest } from '@umijs/max';
import { Avatar, Card, Col, List, Progress, Rate, Row, Statistic, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';

const DoctorRatings: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  function calculateRoundedAverage(arr) {
    const sum = arr.reduce((total, num) => total + num, 0);
    return Math.round(sum / arr.length);
  }

  const { data: doctorRate, loading } = useRequest(
    () => queryEvaluationsByDoctorId(currentUser?.userId),
    {
      formatResult: (res) => {
        const calculateAverageMarks = (data) => {
          const total = data.reduce(
            (acc, curr) => {
              acc.ProfessionalMark += curr.ProfessionalMark;
              acc.CommunicationMark += curr.CommunicationMark;
              acc.ServiceMark += curr.ServiceMark;
              acc.EfficiencyMark += curr.EfficiencyMark;
              acc.EthicsMark += curr.EthicsMark;
              return acc;
            },
            {
              ProfessionalMark: 0,
              CommunicationMark: 0,
              ServiceMark: 0,
              EfficiencyMark: 0,
              EthicsMark: 0,
            },
          );

          const count = data.length;
          return {
            ProfessionalMark: total.ProfessionalMark / count,
            CommunicationMark: total.CommunicationMark / count,
            ServiceMark: total.ServiceMark / count,
            EfficiencyMark: total.EfficiencyMark / count,
            EthicsMark: total.EthicsMark / count,
          };
        };
        const countRatings = (data) => {
          const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          data.forEach((item) => {
            const mark = calculateRoundedAverage([
              item.ProfessionalMark,
              item.CommunicationMark,
              item.ServiceMark,
              item.EfficiencyMark,
              item.EthicsMark,
            ]);
            if ([1, 2, 3, 4, 5].includes(mark)) {
              ratingCounts[mark]++;
            }
          });

          return ratingCounts;
        };
        const count = countRatings(res.data);
        const averageMarks = calculateAverageMarks(res.data);
        const formattedMarks = Object.values(averageMarks);
        return {
          averageMarks: calculateRoundedAverage(formattedMarks),
          count: count,
          data: res.data,
        };
      },
    },
  );

  const renderRatingDistribution = () => {
    const ratingLevels = [5, 4, 3, 2, 1];
    const totalCount = doctorRate?.data.length;

    return (
      <div>
        {ratingLevels.map((level) => {
          const count = doctorRate?.count[level] || 0;

          const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

          return (
            <Row key={level} style={{ marginBottom: 8 }} align="middle">
              <Col span={4}>
                <span>{level} 星</span>
              </Col>
              <Col span={16}>
                <Progress percent={percentage} showInfo={false} strokeColor="#52c41a" />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <span>{count} 人</span>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  return (
    <PageContainer title="我的评价">
      <Card loading={loading}>
        <Row gutter={24}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Statistic
                title="平均评分"
                value={doctorRate?.averageMarks || 0}
                precision={1}
                valueStyle={{ color: '#faad14', fontSize: 36 }}
                suffix={<span style={{ fontSize: 20 }}>/5</span>}
              />
              <Rate disabled defaultValue={doctorRate?.averageMarks} allowHalf />
              <div style={{ marginTop: 8 }}>共 {doctorRate?.data.length} 条评价</div>
            </div>
          </Col>
          <Col span={16}>
            <div>{doctorRate && renderRatingDistribution()}</div>
          </Col>
        </Row>
      </Card>

      <Card title="患者评价" style={{ marginTop: 16 }} loading={loading}>
        <List
          itemLayout="horizontal"
          dataSource={doctorRate?.data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.patientName.slice(0, 1)}</Avatar>}
                title={
                  <div>
                    <span style={{ fontSize: 16, marginRight: 12 }}>{item.patientName}</span>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{item.evaluationDate}</span>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 8, marginTop: 4 }}>
                      <Rate
                        disabled
                        defaultValue={Math.round(
                          (item.ProfessionalMark +
                            item.CommunicationMark +
                            item.ServiceMark +
                            item.EfficiencyMark +
                            item.EthicsMark) /
                            5,
                        )}
                      />
                    </div>
                    <div style={{ marginBottom: 8 }}>{item.remark}</div>
                    <div>
                      {item.tags.map((tag: string) => (
                        <Tag key={tag} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default DoctorRatings;
