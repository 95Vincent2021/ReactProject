import React, { useEffect } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import {
  reqAddHospital,
  reqGetHospital,
  reqUpdateHospital,
} from "@api/hospital/hospitalSet";
import { reqAddHospitalParams } from "@api/hospital/model/hospitalSetTypes";

function AddOrUpdateHospital() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const params = useParams();

  useEffect(() => {
    const getHospital = async () => {
      const { id } = params;
      // 添加和更新都会来到当前组件
      // 而添加没有id，不需要发送请求
      if (id) {
        // params中的参数类型是string，要将其转化为number
        const hospital = await reqGetHospital(+id);
        // 将获取到的数据设置到表单中
        form.setFieldsValue(hospital);
      }
    };

    getHospital();
  }, [params, form]);

  // 确定
  const onFinish = async (values: reqAddHospitalParams) => {
    const { id } = params;

    if (id) {
      // 更新
      await reqUpdateHospital({
        ...values,
        id: +id, // params中的参数类型是string，要将其转化为number
      });
    } else {
      // 添加
      await reqAddHospital(values);
    }

    message.success(`${id ? "更新" : "添加"}医院成功`);
    goBack();
  };

  // 返回
  const goBack = () => {
    // navigate(-1); // 返回到上个浏览历史记录
    navigate("/syt/hospital/hospitalSet");
  };

  return (
    <Card>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        <Form.Item
          label="医院名称"
          // 查看添加医院接口文档
          // 将字段改为请求参数要求的字段
          name="hosname"
          // 详细规则文档：https://ant.design/components/form-cn/#Rule
          rules={[
            {
              required: true, // 必填项
              message: "请输入医院名称", // 校验失败的错误信息
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="医院编号"
          name="hoscode"
          rules={[{ required: true, message: "请输入医院编号" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="api基础路径"
          name="apiUrl"
          rules={[{ required: true, message: "请输入api基础路径" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系人姓名"
          name="contactsName"
          rules={[{ required: true, message: "请输入联系人姓名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系人手机"
          name="contactsPhone"
          rules={[
            {
              required: true,
              message: "请输入合法的联系人手机",
              pattern: /^1[3-9][0-9]{9}$/, // 正则表达式
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2 }}>
          <Button type="primary" htmlType="submit" className="hospital-btn">
            保存
          </Button>
          <Button onClick={goBack}>返回</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddOrUpdateHospital;
