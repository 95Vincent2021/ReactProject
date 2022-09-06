// src/pages/hospital/hospitalList/components/HospitalSchedule.tsx
import React, { useState, useEffect, Key } from "react";
import {
  Card,
  Row,
  Col,
  Tree,
  Tag,
  Pagination,
  Table,
  message,
  Button,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";

import {
  reqGetDepartmentList,
  reqGetScheduleRuleList,
  reqGetScheduleList,
} from "@api/hospital/hospitalList";
import type {
  DepartmentList,
  ScheduleRuleList,
  ScheduleList,
} from "@api/hospital/model/hospitalListTypes";

function HospitalSchedule() {
  // 医院科室数据
  const [departmentList, setDepartmentList] = useState<DepartmentList>([]);

  const params = useParams();

  // 获取医院科室数据
  const getDepartmentList = async (hoscode: string) => {
    const res = await reqGetDepartmentList(hoscode);
    // 设置医院科室数据
    setDepartmentList(
      res.map((item) => {
        return {
          ...item,
          disabled: true, // 禁用父级菜单
        };
      })
    );
    // 设置展开的医院数据
    setExpandedKeys(res.map((item) => item.depcode));
    // 数据更新是异步的，必须返回出去下面才能使用，否则数据为空
    return res;
  };

  // 医院科室数据
  const [scheduleRuleList, setScheduleRuleList] = useState<ScheduleRuleList>(
    []
  );

  // 获取排班规则数据
  const getScheduleRuleList = async (
    hoscode: string,
    depcode: string,
    page: number,
    limit: number
  ) => {
    const res = await reqGetScheduleRuleList({
      page,
      limit,
      hoscode,
      // 默认用医院科室的第一个数据的第一个子元素的depcode
      depcode,
    });
    // 设置排班规则数据
    setScheduleRuleList(res.bookingScheduleList);
    // 设置总数
    setTotal(res.total);

    setHosname(res.baseMap.hosname);

    return res.bookingScheduleList;
  };

  // 点击排班规则
  const setScheduleRule = (workDate: string) => {
    return () => {
      const hoscode = params.id as string;
      const depcode = departmentList[0].children
        ? departmentList[0].children[0].depcode
        : "";
      getScheduleList(hoscode, depcode, workDate);
    };
  };

  const [scheduleList, setScheduleList] = useState<ScheduleList>([]);

  // 获取详细医生排班数据
  const getScheduleList = async (
    hoscode: string,
    depcode: string,
    workDate: string
  ) => {
    const res = await reqGetScheduleList({
      hoscode,
      depcode,
      workDate,
    });
    // 设置排班规则数据
    setScheduleList(res);

    setWorkDate(workDate);
  };

  // 头部选择三个内容
  const [hosname, setHosname] = useState("");
  const [depname, setDepname] = useState("");
  const [workDate, setWorkDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const hoscode = params.id as string;
      const departmentList = await getDepartmentList(hoscode);

      // 默认用医院科室的第一个数据的第一个子元素的depcode
      const depcode = departmentList[0].children
        ? departmentList[0].children[0].depcode
        : "";
      const depname = departmentList[0].children
        ? departmentList[0].children[0].depname
        : "";

      setDepname(depname);
      const scheduleRuleList = await getScheduleRuleList(
        hoscode,
        depcode,
        current,
        pageSize
      );

      // 默认用排班规则第一个规则的workDate
      const workDate = scheduleRuleList[0].workDate;
      await getScheduleList(hoscode, depcode, workDate);
    };

    fetchData();
  }, []);

  /*
    窗口高度 - Header组件高度（64） - Card的上下padding（24*2） - p元素的高度（22）和下外边距（14） - 防止纵向滚动条（5）
  */
  const treeHeight =
    document.body.getBoundingClientRect().height - 64 - 24 * 2 - 22 - 14 - 5;

  // 选择触发的事件
  const onSelect = async (selectedKeys: Key[], info: any) => {
    try {
      setDepname(info.node.depname);
      const depcode = selectedKeys[0] as string;
      const hoscode = params.id as string;
      const scheduleRuleList = await getScheduleRuleList(
        hoscode,
        depcode,
        current,
        pageSize
      );
      const workDate = scheduleRuleList[0].workDate;
      await getScheduleList(hoscode, depcode, workDate);
    } catch {
      setDepname("");
      setWorkDate("");
      setScheduleRuleList([]);
      setScheduleList([]);
      message.error("暂无数据");
    }
  };

  // 默认展开的树形数据的key
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  // 分页器
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  // 点击分页器触发的事件
  const handleChange = async (page: number, limit: number) => {
    setCurrent(page);
    setPageSize(limit);

    const hoscode = params.id as string;
    const depcode = departmentList[0].children
      ? departmentList[0].children[0].depcode
      : "";

    const scheduleRuleList = await getScheduleRuleList(
      hoscode,
      depcode,
      page,
      limit
    );

    // 默认用排班规则第一个规则的workDate
    const workDate = scheduleRuleList[0].workDate;
    await getScheduleList(hoscode, depcode, workDate);
  };

  // 表格
  const columns = [
    {
      title: "序号",
      render: (_a: any, _b: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: "职称",
      dataIndex: "title",
    },
    { title: "号源时间", dataIndex: "workDate" },

    {
      title: "可预约数",
      dataIndex: "availableNumber",
    },
    {
      title: "剩余预约数",
      dataIndex: "reservedNumber",
    },
    {
      title: "挂号费(元)",
      dataIndex: "amount",
    },
    {
      title: "擅长技能",
      dataIndex: "skill",
    },
  ];

  const navigate = useNavigate();
  const goBack = () => {
    navigate("/syt/hospital/hospitalList");
  };

  return (
    <Card>
      <p>
        选择：{hosname} / {depname} / {workDate}
      </p>
      {/* 
        Row/Col是响应式布局组件，也叫做栅格布局
        类似于Bootstrap中的栅格布局，不同的是：一行分为24等份

        Row 行
          gutter={20}
          列与列的间距，单位px
        Col 列
          span={4} 占一行4等份
      */}
      <Row gutter={20}>
        <Col span={5}>
          <div
            style={{
              height: treeHeight,
              border: "1px solid silver",
              overflow: "scroll",
            }}
          >
            <Tree
              // https://github.com/ant-design/ant-design/issues/32912
              // 目前antd官方没有太好解决方案，只有临时方案
              treeData={departmentList as []}
              fieldNames={{
                title: "depname",
                key: "depcode",
              }}
              onSelect={onSelect}
              // defaultExpandedKeys只会第一次生效，导致请求生成的expandedKeys没法生效，所以得用expandedKeys
              expandedKeys={expandedKeys}
            />
          </div>
        </Col>
        <Col span={19}>
          {scheduleRuleList.map((item) => {
            return (
              <Tag
                style={{ marginBottom: 10, cursor: "pointer" }}
                color={workDate === item.workDate ? "green" : ""}
                key={item.workDate}
                onClick={setScheduleRule(item.workDate)}
              >
                <div>
                  {item.workDate} {item.dayOfWeek}
                </div>
                <div>
                  {item.availableNumber} / {item.reservedNumber}
                </div>
              </Tag>
            );
          })}

          <Pagination
            showSizeChanger
            onChange={handleChange}
            current={current}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={[5, 10, 15, 20]}
          />

          <Table
            style={{ margin: "10px 0" }}
            columns={columns}
            dataSource={scheduleList}
            bordered
            rowKey="id"
            pagination={false}
          />

          <Button onClick={goBack}>返回</Button>
        </Col>
      </Row>
    </Card>
  );
}

export default HospitalSchedule;
