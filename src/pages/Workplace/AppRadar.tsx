import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
type Props = {
  data: any;
};
const AppRadar: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  // console.log(data);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      const option = {
        // title: {
        //   text: '医生评分雷达图',
        // },
        legend: {
          data: ['医生评分'],
        },
        radar: {
          indicator: [
            { name: '专业能力', max: 5 },
            { name: '沟通能力', max: 5 },
            { name: '服务态度', max: 5 },
            { name: '效率', max: 5 },
            { name: '医德', max: 5 },
          ],
        },
        series: [
          {
            name: '评分',
            type: 'radar',
            data: [
              {
                value: data, // 替换为你的数据
                name: '医生评分',
              },
            ],
          },
        ],
      };
      myChart.setOption(option);

      // 清理函数
      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default AppRadar;
