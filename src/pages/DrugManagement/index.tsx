import {
  createDrug,
  deleteDrug,
  queryDepartmentList,
  queryDrugCostList,
  queryDrugList,
  queryDrugProfitList,
  queryDrugTypeList,
  updateDrug,
} from '@/services/ant-design-pro';
import {
  DrawerForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
  ModalForm,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import type { ProgressProps, StatisticProps } from 'antd';
import {
  Button,
  Card,
  Col,
  Flex,
  message,
  Modal,
  Progress,
  Row,
  Statistic,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import CountUp from 'react-countup';

const DrugManagement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentDrug, setCurrentDrug] = useState<API.Drug | null>(null);
  const [visible, setVisible] = useState(false);
  const conicColors: ProgressProps['strokeColor'] = {
    '0%': '#d43a26',
    '50%': '#c09f32',
    '100%': 'green',
  };
  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator="," />
  );

  const onClose = () => {
    setOpen(false);
  };

  const { data: typeList } = useRequest(queryDrugTypeList);
  const { data: drugCostList } = useRequest(queryDrugCostList);
  const { data: drugProfitList } = useRequest(queryDrugProfitList);

  const { run, data, refresh, loading, pagination, params } = useRequest(
    ({ current, pageSize }, payload) =>
      queryDrugList({ page: current, limit: pageSize, ...payload }),
    {
      paginated: true,
      formatResult: (res) => {
        return {
          list: res.data.data,
          total: res.data.total,
        };
      },
    },
  );

  // 进货
  const { run: runCreateDrug } = useRequest(createDrug, {
    manual: true,
    onSuccess: () => {
      refresh();
      onClose();
    },
    onError: () => {
      message.error('货物已存在，请勿重复添加，可以进行补货');
    },
  });

  // 补货
  const { run: runUpdate } = useRequest(updateDrug, {
    manual: true,
    onSuccess: () => {
      refresh();
    },
  });

  // 获取科室信息
  const { data: departmentList } = useRequest(() => queryDepartmentList({ page: 1, limit: 1000 }), {
    formatResult: (res) => {
      return Object.fromEntries(res.data.data.map((dept) => [dept.name, dept.name]));
    },
  });
  const columns: ProColumns<API.Drug>[] = [
    {
      title: '货物ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '药品名称',
      dataIndex: 'name',
    },
    {
      title: '售卖价格（￥）',
      dataIndex: 'price',
      search: false,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      search: false,
      render: (_, record) => {
        return (
          <Flex gap={10}>
            <Progress
              percent={(record.stock / record.purchaseQuantity) * 100}
              status="active"
              strokeColor={conicColors}
              showInfo={false}
            />
            <Tooltip
              title={
                <div style={{ color: 'black' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>库存（件）：</span>
                    <span>{record.stock}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>进货数量（件）：</span>
                    <span>{record.purchaseQuantity}</span>
                  </div>
                </div>
              }
            >
              <Tag>{`剩余${record.stock}件`}</Tag>
            </Tooltip>
          </Flex>
        );
      },
    },
    {
      title: '规格',
      dataIndex: 'specification',
      search: false,
    },
    {
      title: '批发价格（￥）',
      dataIndex: 'purchasePrice',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      valueType: 'dateTimeRange',
      render: (_, record) => <span>{moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}</span>,
      search: {
        transform: (value) => {
          return {
            start: value?.[0],
            end: value?.[1],
          };
        },
      },
    },
    {
      title: '科室',
      dataIndex: 'department',
      valueEnum: departmentList,
      valueType: 'select',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setVisible(true);
              setCurrentDrug(record);
            }}
          >
            补货
          </Button>
        );
      },
    },
  ];
  return (
    <PageContainer header={{ title: '药品货物管理' }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="药物种类"
              value={typeList?.distinctNames.length}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="耗资（￥）" value={drugCostList} formatter={formatter} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="利润（￥）"
              value={drugProfitList}
              precision={2}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
      <ProTable<API.Drug>
        onSubmit={async (payload) => {
          await run(params[0], payload);
        }}
        toolBarRender={() => {
          return (
            <Button type="primary" onClick={() => setOpen(true)}>
              进货
            </Button>
          );
        }}
        options={false}
        columns={columns}
        dataSource={data?.list}
        loading={loading}
        pagination={pagination}
        rowKey="id"
      />
      <DrawerForm<API.Drug>
        open={open}
        title={'进货'}
        onFinish={async (values) => {
          // await run(values);
          // setOpen(false);
          const stock = values.purchaseQuantity;
          const specification = `${values.specificationCount}mg/${values.specificationUnit}`;
          const tranformedValues = { ...values, stock, specification };
          delete tranformedValues.specificationCount;
          delete tranformedValues.specificationUnit;
          await runCreateDrug(tranformedValues);
        }}
        drawerProps={{ onClose, destroyOnClose: true }}
      >
        <ProFormText
          name={'name'}
          label={'药品名称'}
          rules={[{ required: true, message: '请输入药品名称' }]}
        />
        <ProForm.Group>
          <ProFormDigit
            name={'specificationCount'}
            label={'规格/量'}
            rules={[{ required: true, message: '请输入规格/量' }]}
          />
          <ProFormSelect
            name={'specificationUnit'}
            label={'规格/单位'}
            rules={[{ required: true, message: '请输入规格/单位' }]}
            valueEnum={{
              胶囊: '胶囊',
              片: '片',
              粉剂: '粉剂',
              支: '支',
            }}
          />
        </ProForm.Group>
        <ProFormDigit
          name={'price'}
          label={'售卖价格（￥）'}
          rules={[{ required: true, message: '请输入售卖价格' }]}
        />
        <ProFormDigit
          name={'purchasePrice'}
          label={'批发价格（￥）'}
          rules={[{ required: true, message: '请输入批发价格' }]}
        />
        <ProFormDigit
          name={'purchaseQuantity'}
          label={'进货数量（件）'}
          rules={[{ required: true, message: '请输入进货数量' }]}
        />
        <ProFormSelect
          name={'department'}
          label={'所属科室'}
          valueEnum={departmentList}
          rules={[{ required: true, message: '请选择所属科室' }]}
        />
      </DrawerForm>
      <ModalForm
        title="补货"
        width={400}
        open={visible}
        initialValues={currentDrug}
        onFinish={async (values) => {
          values.stock += values.count;
          values.purchaseQuantity += values.count;
          await runUpdate({
            id: values.id,
            stock: values.stock,
            purchaseQuantity: values.purchaseQuantity,
          });
          setVisible(false);
        }}
        modalProps={{ onCancel: () => setVisible(false), destroyOnClose: true }}
      >
        <ProForm.Group>
          <ProFormText
            hidden
            name={'id'}
            readonly
            label={'货物ID'}
            rules={[{ required: true, message: '请输入药品名称' }]}
          />
          <ProFormText
            name={'name'}
            readonly
            label={'药品名称'}
            rules={[{ required: true, message: '请输入药品名称' }]}
          />
          <ProFormDigit
            name={'stock'}
            label={'库存'}
            readonly
            rules={[{ required: true, message: '请输入批发价格' }]}
          />
          <ProFormDigit
            hidden
            name={'purchaseQuantity'}
            label={'总数'}
            readonly
            rules={[{ required: true, message: '请输入批发价格' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            name={'price'}
            readonly
            label={'售卖价格（￥）'}
            rules={[{ required: true, message: '请输入售卖价格' }]}
          />
          <ProFormDigit
            name={'purchasePrice'}
            label={'批发价格（￥）'}
            readonly
            rules={[{ required: true, message: '请输入批发价格' }]}
          />
        </ProForm.Group>
        <ProFormDigit
          name={'count'}
          label={'进货数量（件）'}
          rules={[{ required: true, message: '请输入进货数量' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default DrugManagement;
