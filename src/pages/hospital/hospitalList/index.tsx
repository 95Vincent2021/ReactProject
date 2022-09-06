// src/pages/hospital/hospitalList/index.ts
import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Select, Table, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import {
  reqGetHospitalList,
  reqGetProvinceList,
  reqGetCityOrDistrictList,
  reqUpdateHospitalStatus,
} from "@api/hospital/hospitalList";
import type {
  HospitalListType,
  HospitalItemType,
  ProvinceList,
  Status,
} from "@api/hospital/model/hospitalListTypes";

import "./index.less";

const { Option } = Select;

function HospitalList() {
  // loading
  const [loading, setLoading] = useState(false);
  // 定义医院列表数据和类型
  const [hospitalList, setHospitalList] = useState<HospitalListType>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  // 获取医院列表
  const getHospitalList = async (page: number, limit: number) => {
    // 设置loading
    setLoading(true);
    // 读取表单的值
    const values = form.getFieldsValue();
    const res = await reqGetHospitalList({ page, limit, ...values });
    // 更新数据
    setHospitalList(res.content);
    setTotal(res.totalElements);
    // 分页器需要更新页码和每页条数
    setCurrent(page);
    setPageSize(limit);
    setLoading(false);
  };

  // 一上来发送请求
  useEffect(() => {
    getHospitalList(current, pageSize);
  }, []);

  const [hostypeList, setHostypeList] = useState<ProvinceList>([]);
  // 一上来获取医院类型数据
  useEffect(() => {
    const getHostypeList = async () => {
      // 通过查看已完成项目，得知医院类型的id为10000, 这样就能找到所有类型了
      const res = await reqGetCityOrDistrictList(10000);
      setHostypeList(res);
    };
    getHostypeList();
  }, []);

  const [form] = Form.useForm();

  // 定义省市区数据
  const [provinceList, setProvinceList] = useState<ProvinceList>([]);
  const [cityList, setCityList] = useState<ProvinceList>([]);
  const [districtList, setDistrictList] = useState<ProvinceList>([]);

  // 一上来发送请求,请求省份数据
  useEffect(() => {
    const getProvinceList = async () => {
      const res = await reqGetProvinceList();
      setProvinceList(res);
    };
    getProvinceList();
  }, []);

  // 当省份发生变化，获取城市数据
  const getCityList = async (id: number) => {
    const res = await reqGetCityOrDistrictList(id);
    // 市列表数据因为更新了。所以不需要清空了~
    setCityList(res);
    // 将选中的市和区值清空
    form.setFieldsValue({ cityCode: undefined, districtCode: undefined });
    // 将区列表数据清空
    setDistrictList([]);
  };

  // 当市发生变化，获取区数据
  const getDistrictList = async (id: number) => {
    const res = await reqGetCityOrDistrictList(id);
    setDistrictList(res);
    // 将选中区值清空
    form.setFieldsValue({ districtCode: undefined });
  };

  const columns = [
    {
      title: "序号",
      width: 70,
      align: "center" as "center",
      render: (_x: any, _y: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: "医院logo",
      dataIndex: "logoData", // 将dataIndex改为对应数据字段
      render: (logo: string) => (
        // base64图片技术
        // 找到一张base64格式图片，观察我们数据缺少了哪部分。加上去即可
        <img
          className="hospital-img"
          src={"data:image/jpeg;base64," + logo}
          alt="logo"
        />
      ),
    },
    {
      title: "医院名称",
      dataIndex: "hosname",
    },
    {
      title: "等级",
      // 不写dataIndex得到就是整行数据
      render: (row: HospitalItemType) => row.param.hostypeString,
    },
    {
      title: "详细地址",
      render: (row: HospitalItemType) => row.param.fullAddress,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status: Status) => (status ? "已上线" : "未上线"),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
    },
    {
      title: "操作",
      width: 250,
      render: (row: HospitalItemType) => {
        return (
          <>
            <Button
              type="primary"
              className="hospital-btn"
              onClick={goHospitalShow(row.id)}
            >
              查看
            </Button>
            <Button
              type="primary"
              className="hospital-btn"
              onClick={goHospitalSchedule(row.hoscode)}
            >
              排班
            </Button>
            {row.status === 0 ? (
              <Button type="primary" onClick={updateHospitalStatus(row.id, 1)}>
                上线
              </Button>
            ) : (
              <Button type="primary" onClick={updateHospitalStatus(row.id, 0)}>
                下线
              </Button>
            )}
          </>
        );
      },
    },
  ];

  // 上线&下线
  const updateHospitalStatus = (id: string, status: Status) => {
    return async () => {
      await reqUpdateHospitalStatus(id, status);
      message.success("更新状态成功");
      getHospitalList(current, pageSize);
    };
  };

  const navigate = useNavigate();
  // 跳转到医院详情
  const goHospitalShow = (id: string) => {
    return () => {
      navigate(`/syt/hospital/hospitalList/show/${id}`);
    };
  };

  // 跳转到医院排班
  const goHospitalSchedule = (hoscode: string) => {
    return () => {
      navigate(`/syt/hospital/hospitalList/schedule/${hoscode}`);
    };
  };

  // 提交表单触发的函数
  const onFinish = () => {
    getHospitalList(current, pageSize);
  };

  // 清空
  const reset = () => {
    // 清空输入/选择的数据
    form.resetFields();
    // 将城市和区的数据清空
    setCityList([]);
    setDistrictList([]);
    // 重新获取数据
    getHospitalList(1, 5);
  };

  return (
    <Card>
      {/* 头部表单 */}
      <Form form={form} layout="inline" onFinish={onFinish}>
        {/* Form、Select不支持className，只能用style写样式 */}
        {/* 给Form.Item指定name，必须是将来发送请求字段，所以要与接口文档对照 */}
        <Form.Item name="provinceCode" style={{ marginBottom: 20 }}>
          <Select
            placeholder="请选择省"
            style={{ width: 200 }}
            onChange={getCityList}
          >
            {provinceList.map((provinceItem) => {
              return (
                // value代表option选中的值
                <Option value={provinceItem.value} key={provinceItem.id}>
                  {provinceItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="cityCode" style={{ marginBottom: 20 }}>
          <Select
            placeholder="请选择市"
            style={{ width: 200 }}
            onChange={getDistrictList}
          >
            {cityList.map((cityItem) => {
              return (
                <Option value={cityItem.value} key={cityItem.id}>
                  {cityItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="districtCode" style={{ marginBottom: 20 }}>
          <Select placeholder="请选择区" style={{ width: 200 }}>
            {districtList.map((districtItem) => {
              return (
                <Option value={districtItem.value} key={districtItem.id}>
                  {districtItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="hosname" style={{ marginBottom: 20 }}>
          <Input placeholder="医院名称" />
        </Form.Item>

        <Form.Item name="hoscode" style={{ marginBottom: 20 }}>
          <Input placeholder="医院编号" />
        </Form.Item>

        <Form.Item name="hostype" style={{ marginBottom: 20 }}>
          <Select placeholder="医院类型" style={{ width: 200 }}>
            {hostypeList.map((hostypeItem) => {
              return (
                <Option value={hostypeItem.value} key={hostypeItem.id}>
                  {hostypeItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="status" style={{ marginBottom: 20 }}>
          <Select placeholder="医院状态" style={{ width: 200 }}>
            {/* 注意要使用jsx语法，才会是number类型 */}
            <Option value={0}>未上线</Option>
            <Option value={1}>已上线</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 20 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            className="hospital-btn m"
          >
            查询
          </Button>
          <Button onClick={reset}>清空</Button>
        </Form.Item>
      </Form>

      {/* 底部表格和分页器 */}
      <Table
        columns={columns}
        dataSource={hospitalList}
        bordered
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `总共 ${total} 条`,
          onChange: getHospitalList,
          onShowSizeChange: getHospitalList,
        }}
        loading={loading}
      />
    </Card>
  );
}

export default HospitalList;
