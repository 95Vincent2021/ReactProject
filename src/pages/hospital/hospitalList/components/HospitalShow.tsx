// src/pages/hospital/hospitalList/components/HospitalShow.tsx
import React, { useState, useEffect } from "react";
import { Card, Descriptions, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";

import { reqGetHospitalShow } from "@api/hospital/hospitalList";
import { HospitalShowType } from "@api/hospital/model/hospitalListTypes";

import "./HospitalShow.less";

function HospitalShow() {
  // 数据初始化要按照数据结构全部进行初始化(因为属性是必填项)
  const [hospitalShow, setHospitalShow] = useState<HospitalShowType>({
    bookingRule: {
      cycle: 0,
      releaseTime: "",
      stopTime: "",
      quitTime: "",
      rule: [],
    },
    hospital: {
      id: "",
      createTime: "",
      param: {
        hostypeString: "",
        fullAddress: "",
      },
      hoscode: "",
      hosname: "",
      hostype: "",
      provinceCode: "",
      cityCode: "",
      districtCode: "",
      logoData: "",
      intro: "",
      route: "",
      status: 0,
    },
  });
  // 获取路由参数
  const params = useParams();

  useEffect(() => {
    const getHospitalShow = async () => {
      const res = await reqGetHospitalShow(params.id as string);
      setHospitalShow(res);
    };
    getHospitalShow();
  }, []);

  const navigate = useNavigate();
  // 返回
  const goBack = () => {
    navigate("/syt/hospital/hospitalList");
  };

  return (
    <Card>
      {/* 
        title 标题
        bordered 带边框
        column 一行的 DescriptionItems 数量
      */}
      <Descriptions title="基本信息" bordered column={2}>
        <Descriptions.Item label="医院名称">
          {hospitalShow.hospital.hosname}
        </Descriptions.Item>
        <Descriptions.Item label="医院logo">
          <img
            className="hospital-img"
            src={"data:image/jpeg;base64," + hospitalShow.hospital.logoData}
            alt="logo"
          />
        </Descriptions.Item>
        <Descriptions.Item label="医院编码">
          {hospitalShow.hospital.hoscode}
        </Descriptions.Item>
        <Descriptions.Item label="医院地址">
          {hospitalShow.hospital.param.fullAddress}
        </Descriptions.Item>
        {/* 
          span={2} 包含列的数量
        */}
        <Descriptions.Item label="坐车路线" span={2}>
          {hospitalShow.hospital.route}
        </Descriptions.Item>
        <Descriptions.Item label="医院简介" span={2}>
          {hospitalShow.hospital.intro}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        title="预约规则信息"
        bordered
        column={2}
        style={{ margin: "30px 0" }}
      >
        <Descriptions.Item label="预约周期">
          {hospitalShow.bookingRule.cycle}天
        </Descriptions.Item>
        <Descriptions.Item label="放号时间">
          {hospitalShow.bookingRule.releaseTime}
        </Descriptions.Item>
        <Descriptions.Item label="停挂时间">
          {hospitalShow.bookingRule.stopTime}
        </Descriptions.Item>
        <Descriptions.Item label="退号时间">
          {hospitalShow.bookingRule.quitTime}
        </Descriptions.Item>
        {/* 
          span={2} 包含列的数量
        */}
        <Descriptions.Item label="预约规则" span={2}>
          {hospitalShow.bookingRule.rule.map((rule, index) => {
            return (
              <div key={index}>
                {index + 1}. {rule}
              </div>
            );
          })}
        </Descriptions.Item>
      </Descriptions>

      <Button onClick={goBack}>返回</Button>
    </Card>
  );
}

export default HospitalShow;
