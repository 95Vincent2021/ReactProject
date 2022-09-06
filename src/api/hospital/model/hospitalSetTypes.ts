// 获取医院列表参数类型
export interface reqGetHospitalListParams {
  page: number;
  limit: number;
  hosname?: string;
  hoscode?: string;
}

// 单个医院类型
export interface HospitalItem {
  id: number;
  // 医院名称
  hosname: string;
  // 医院编号
  hoscode: string;
  // API基础路径
  apiUrl: string;
  // 签名
  signKey: string;
  // 联系人姓名
  contactsName: string;
  // 联系人手机
  contactsPhone: string;
  // 状态：0锁定 1解锁
  // status: 0 | 1;
}



// 医院列表类型
export type HospitalList = HospitalItem[];

// 获取医院列表返回值类型
export interface reqGetHospitalListResponse {
  total: number;
  // 数据需要进一步定义，后续需要复用
  records: HospitalList;
}

// 添加医院参数类型
export interface reqAddHospitalParams {
  apiUrl: string;
  contactsName: string;
  contactsPhone: string;
  hoscode: string;
  hosname: string;
}

// 定义类型时能复用一定要复用！
// 修改医院参数类型
export interface reqUpdateHospitalParams extends reqAddHospitalParams {
  id: number;
}
