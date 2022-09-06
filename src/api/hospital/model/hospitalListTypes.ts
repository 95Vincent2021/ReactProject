// src/api/hospital/model/hospitalListTypes.ts

// 预约规则信息
export interface BookingRuleType {
  cycle: number; // 预约周期
  releaseTime: string; // 放号时间
  stopTime: string; // 停挂时间
  quitTime: string; // 退号时间
  rule: string[]; // 预约规则
}

// 单个医院类型(不包含预约规则信息)
export interface HospitalType {
  id: string;
  createTime: string; // 创建时间
  param: {
    hostypeString: string; // 医院类型
    fullAddress: string; // 医院完整地址
  };
  hoscode: string; // 医院编码
  hosname: string; // 医院名称
  hostype: string; // 医院类型标识
  provinceCode: string; // 省编码
  cityCode: string; // 市编码
  districtCode: string; // 区编码
  logoData: string; // 医院logo
  intro: string; // 医院介绍
  route: string; // 交通方式
  status: Status; // 状态：0：未上线 1：已上线
}
// 单个医院类型
export interface HospitalItemType extends HospitalType {
  bookingRule: BookingRuleType; // 预约规则信息
}

// 医院详情类型
export interface HospitalShowType {
  bookingRule: BookingRuleType; // 预约规则信息
  hospital: HospitalType;
}

// 状态类型
export type Status = 0 | 1; // 状态：0：未上线 1：已上线

// 医院列表类型
export type HospitalListType = HospitalItemType[];

// 获取医院列表参数类型
export interface reqGetHospitalListParams {
  page: number; // 当前页码
  limit: number; // 每页条数
  hoscode?: string; // 医院编码
  hosname?: string; // 医院名称
  hostype?: string; // 医院类型
  provinceCode?: string; // 省编码
  cityCode?: string; // 市编码
  districtCode?: string; // 区编码
  status?: Status; // 状态：0：未上线 1：已上线
}

// 获取医院列表返回值类型
export interface reqGetHospitalListResponse {
  // 注意接口返回值字段与之前不一样~所以使用前需要测试接口
  content: HospitalListType;
  totalElements: number;
}

// 单个省市区数据
export interface ProvinceItem {
  id: number;
  name: string; // 名称
  value: string; // 选中的值
  // 只定义需要使用的数据，不用的可以不定义
  // "parentId": number,
  // "createTime": "2020-06-23 15:48:53",
  // "updateTime": "2020-06-23 15:52:57",
  // "isDeleted": 0,
  // "param": {},
  // "dictCode": null,
  // "hasChildren": true
}
// 省市区数据列表
export type ProvinceList = ProvinceItem[];

// 单个医院科室类型
export interface DepartmentItem {
  depcode: string; // 科室编码
  depname: string; // 科室名称
  children: DepartmentList | null;
}
// 医院科室列表类型
export type DepartmentList = DepartmentItem[];

// 公共参数类型
export interface commonScheduleParams {
  hoscode: string; // 医院编码
  depcode: string; // 科室编码
}

// 获取排班规则参数类型
export interface reqGetScheduleRuleListParams extends commonScheduleParams {
  page: number; // 当前页码
  limit: number; // 每页条数
}

// 单个排班规则类型
export interface ScheduleRuleItem {
  availableNumber: number; // 已预约数
  dayOfWeek: string; // 星期几
  reservedNumber: number; // 总可预约数
  workDate: string; // 具体日期
}
// 排班规则列表类型
export type ScheduleRuleList = ScheduleRuleItem[];

// 获取排班规则响应类型
export interface reqGetHospitalRuleListResponse {
  total: number;
  bookingScheduleList: ScheduleRuleList;
  baseMap: {
    hosname: string; // 医院名称
  };
}

// 获取详细医生排班参数类型
export interface reqGetScheduleListParams extends commonScheduleParams {
  workDate: string;
}

// 单个详细医生排班数据类型
export interface ScheduleItem {
  amount: number; // 挂号费
  availableNumber: number; // 可预约数
  id: string;
  reservedNumber: number; // 剩余预约数
  skill: string; // 擅长技能
  title: string; // 职称
  workDate: string; // 号源时间
}
// 详细医生排班数列表据类型
export type ScheduleList = ScheduleItem[];
