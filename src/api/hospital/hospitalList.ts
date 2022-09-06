// src/api/hospital/hospitalList.ts
import { request } from "@/utils/http";
import type {
  reqGetHospitalListParams,
  reqGetHospitalListResponse,
  ProvinceList,
  HospitalShowType,
  DepartmentList,
  reqGetScheduleRuleListParams,
  reqGetHospitalRuleListResponse,
  reqGetScheduleListParams,
  ScheduleList,
  Status,
} from "./model/hospitalListTypes";

// 获取医院列表
export const reqGetHospitalList = ({
  page,
  limit,
  ...restParams // 代表剩下其他参数
}: reqGetHospitalListParams) => {
  return request.get<any, reqGetHospitalListResponse>(
    `/admin/hosp/hospital/${page}/${limit}`,
    {
      params: restParams,
    }
  );
};

// 获取省份数据
export const reqGetProvinceList = (dictCode = "province") => {
  return request.get<any, ProvinceList>(
    `/admin/cmn/dict/findByDictCode/${dictCode}`
  );
};

// 获取市区数据
export const reqGetCityOrDistrictList = (parentId: number) => {
  return request.get<any, ProvinceList>(
    `/admin/cmn/dict/findByParentId/${parentId}`
  );
};

// 获取医院详情
export const reqGetHospitalShow = (id: string) => {
  return request.get<any, HospitalShowType>(`/admin/hosp/hospital/show/${id}`);
};

// 获取医院科室数据
export const reqGetDepartmentList = (hoscode: string) => {
  return request.get<any, DepartmentList>(`/admin/hosp/department/${hoscode}`);
};

// 获取排班规则数据
export const reqGetScheduleRuleList = ({
  page,
  limit,
  hoscode,
  depcode,
}: reqGetScheduleRuleListParams) => {
  return request.get<any, reqGetHospitalRuleListResponse>(
    `/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`
  );
};

// 获取详细医生排班数据
export const reqGetScheduleList = ({
  hoscode,
  depcode,
  workDate,
}: reqGetScheduleListParams) => {
  return request.get<any, ScheduleList>(
    `/admin/hosp/schedule/findScheduleList/${hoscode}/${depcode}/${workDate}`
  );
};

// 医院上线
export const reqUpdateHospitalStatus = (
  id: string,
  status: Status // （0：未上线 1：已上线）
) => {
  return request.get<any, null>(
    `/admin/hosp/hospital/updateStatus/${id}/${status}`
  );
};
