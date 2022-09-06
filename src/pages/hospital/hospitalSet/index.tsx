// src/pages/hospital/hospitalSet/index.tsx
import React, { useState, useEffect, Key } from "react";
import { Card, Form, Input, Button, Table, Tooltip, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { reqGetHospitalList, reqRemoveHospital, reqBatchRemoveHospitalList } from "@api/hospital/hospitalSet";
import type { HospitalList, HospitalItem } from "@api/hospital/model/hospitalSetTypes";

import "./index.less";

function HospitalSet() {
  const { t } = useTranslation(["hospitalSet"]);
  // loading
  const [loading, setLoading] = useState(false);
  // 定义医院列表数据和类型
  const [hospitalList, setHospitalList] = useState<HospitalList>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();

  // 封装公共请求函数
  const getHospitalList = async (page: number, limit: number) => {
    // 发送请求开启loading
    setLoading(true);
    // 读取表单数据
    const { hosname, hoscode } = form.getFieldsValue();
    // 发送请求携带上另外的参数
    const res = await reqGetHospitalList({ page, limit, hosname, hoscode });
    // 更新页码
    setCurrent(page);
    setPageSize(limit);
    // 更新总数
    setTotal(res.total);
    // 更新数据
    setHospitalList(res.records);
    // 请求完成结束loading
    setLoading(false);
  };

  // 一上来发送请求
  useEffect(() => {
    getHospitalList(current, pageSize);
    // 注意：依赖数组中不能有current, pageSize
    // 因为会导致请求发送两次
  }, []);

  // 点击查询按钮，触发的回调函数
  // values就是收集到的表单数据
  const onFinish = () => {
    // 发送请求，获取最新数据展示
    getHospitalList(current, pageSize);
  };

  // 清空表单
  const reset = () => {
    // 清空表单内容
    form.resetFields();
    // 重新获取数据展示
    getHospitalList(1, 5);
  };

  // 列
  const columns = [
    {
      // 标题
      title: t("index"),
      width: 70,
      align: "center" as "center",
      // 渲染什么数据
      // dataIndex写啥？看接口文档返回数据的格式，数据返回叫啥就写啥
      // 接口文档没有的就自己定义，保证唯一即可
      // dataIndex: "index",
      render: (_x: any, _y: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: t("hosname"),
      dataIndex: "hosname",
    },
    {
      title: t("hoscode"),
      dataIndex: "hoscode",
    },
    {
      title: t("apiUrl"),
      dataIndex: "apiUrl",
    },
    {
      title: t("signKey"),
      dataIndex: "signKey",
    },
    {
      title: t("contactsName"),
      dataIndex: "contactsName",
    },
    {
      title: t("contactsPhone"),
      // 纯数据渲染直接dataIndex
      dataIndex: "contactsPhone",
    },
    {
      title: t("operator"),
      // 固定在右侧
      // fixed: 'right', // 报错，会自动将类型推论为string
      fixed: "right" as "right", // 将类型断言为 'right' 字符串字面量类型就好
      width: 120,
      // 写了dataIndex就只能得到某个数据
      // 不写dataIndex，render方法就能接收到整行数据
      // 类型为单个医院数据
      render: (row: HospitalItem) => {
        return (
          <>
            <Tooltip placement="top" title={t("updateBtnText")}>
              <Button className="hospital-btn" type="primary" icon={<EditOutlined />} onClick={goUpdateHospital(row.id)} />
            </Tooltip>
            <Tooltip placement="top" title={t("delBtnText")}>
              <Button className="hospital-btn" type="primary" danger icon={<DeleteOutlined />} onClick={removeHospital(row.id)} />
            </Tooltip>
          </>
        );
      },
    },
  ];

  // 删除医院
  const removeHospital = (id: number) => {
    return async () => {
      // 发送请求，只会删除服务器数据，客户端数据没变
      await reqRemoveHospital(id);
      message.success("删除医院成功");
      // 重新获取最新医院列表即可
      getHospitalList(current, pageSize);
    };
  };

  // 功能代码尽量放一起
  const navigate = useNavigate();

  // 跳转到添加医院组件
  const goAddHospital = () => {
    // navigate('/syt/hospital/hospitalSet/add', { replace: true }) // replace
    navigate("/syt/hospital/hospitalSet/add"); // push
  };

  // 跳转到修改医院组件
  // 需要传参就得用高阶函数形式
  const goUpdateHospital = (id: number) => {
    return () => {
      navigate(`/syt/hospital/hospitalSet/edit/${id}`);
    };
  };

  // 选中的医院id列表数据
  const [selectedHospitalIds, setSelectedHospitalIds] = useState<Key[]>([]);

  // 复选框触发的事件
  const rowSelection = {
    // 全选&单选
    onChange: (
      selectedRowKeys: Key[]
      // selectedRows: HospitalList
    ) => {
      // selectedRowKeys 选中的当前元素key的值组成的数组（我们之前设置rowKey为id，所以实际获取的是当前元素的id）
      // selectedRows 选中的当前元素组成的数组

      // 设置选中的医院id列表
      setSelectedHospitalIds(selectedRowKeys);
    },
    // 单选
    // onSelect: (record: any, selected: any, selectedRows: any) => {
    //   console.log(record, selected, selectedRows);
    // },
    // 全选
    // onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
    //   console.log(selected, selectedRows, changeRows);
    // },
  };

  // 批量删除
  const batchRemoveHospitalList = async () => {
    await reqBatchRemoveHospitalList(selectedHospitalIds);
    message.success("批量删除成功");
    // 重新获取最新医院列表即可
    getHospitalList(current, pageSize);
  };

  return (
    <Card>
      {/* 头部表单和按钮组件 */}
      {/*
        Form 表单组件
          form={form} 通过Form.useForm()得到，最终可以操作Form实例对象，从而完成表单校验、清空等操作
          layout="inline" 表单项布局方式，内联（水平）布局
          onFinish={onFinish} 当按钮设置htmlType="submit"时，点击这个按钮就会触发onFinish，此时会对整个表单进行校验，通过了，才会执行onFinish函数

        Form.Item 单个表单项组件
          name 表单项名称，也是将来收集的表单数据名称
          rules 表单校验规则
            required 必填
          message 校验失败的错误信息
      */}
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          // 将表单字段更新为请求参数对应的字段
          name="hosname"
          // 不需要表单校验功能
          // rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder={t("hosname")} />
        </Form.Item>
        <Form.Item
          // 将表单字段更新为请求参数对应的字段
          name="hoscode"
          // 不需要表单校验功能
          // rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input placeholder={t("hoscode")} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} className="hospital-btn mb">
            {t("searchBtnText")}
          </Button>
          <Button onClick={reset}>{t("clearBtnText")}</Button>
        </Form.Item>
      </Form>

      <Button type="primary" className="hospital-btn mb" onClick={goAddHospital}>
        {t("addBtnText")}
      </Button>
      {/*
        selectedHospitalIds.length 如果为0，代表没有选中，就要禁用
        selectedHospitalIds.length 如果为1,2,3，代表有选中，就要不禁用
      */}
      <Button type="primary" danger disabled={!selectedHospitalIds.length} onClick={batchRemoveHospitalList}>
        {t("batchDelBtnText")}
      </Button>

      {/* 底部表格和分页器 */}
      {/*
        Table 表格组件
          columns 决定表格渲染几列
          dataSource 决定表格每一行渲染什么数据
          bordered 带边框
          scroll 滚动条
          rowKey="id" 遍历的key属性的值用id
          pagination 分页器设置
            current 当前页码
            pageSize 每页条数
            total 总数
            showQuickJumper 是否显示快速跳转
            showSizeChanger 是否显示每页条数
            showTotal 显示总数
            onChange 当前页码发送变化触发的事件
            onShowSizeChange 每页条数发送变化触发的事件
          loading 加载中
          rowSelection 复选框
      */}
      <Table
        columns={columns}
        dataSource={hospitalList}
        bordered
        scroll={{ x: 1500 }}
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `${t("total")} ${total}`,
          onChange: getHospitalList,
          onShowSizeChange: getHospitalList,
        }}
        loading={loading}
        rowSelection={rowSelection}
      />
    </Card>
  );
}

export default HospitalSet;
