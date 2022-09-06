// src/api/hospital/hospitalSet.ts
import { request } from "@/utils/http";
import type { Key } from "react";
import type {
  reqGetHospitalListParams,
  reqGetHospitalListResponse,
  reqAddHospitalParams,
  reqUpdateHospitalParams,
  HospitalItem,
} from "./model/hospitalSetTypes";

// 获取医院列表
export const reqGetHospitalList = ({
  page,
  limit,
  hosname,
  hoscode,
}: reqGetHospitalListParams) => {
  // 查询才会有返回值
  return request.get<any, reqGetHospitalListResponse>(
    `/admin/hosp/hospitalSet/${page}/${limit}`,
    {
      params: {
        hosname,
        hoscode,
      },
    }
  );
};

// 添加医院
export const reqAddHospital = (data: reqAddHospitalParams) => {
  // 添加/更新/删除都没有返回值，返回值null
  return request.post<any, null>(`/admin/hosp/hospitalSet/save`, data);
};

// 修改医院
export const reqUpdateHospital = (data: reqUpdateHospitalParams) => {
  return request.put<any, null>(`/admin/hosp/hospitalSet/update`, data);
};

// 获取某个医院数据
export const reqGetHospital = (id: number) => {
  return request.get<any, HospitalItem>(`/admin/hosp/hospitalSet/get/${id}`);
};

// 删除医院
export const reqRemoveHospital = (id: number) => {
  return request.delete<any, null>(`/admin/hosp/hospitalSet/remove/${id}`);
};

// 批量删除医院
export const reqBatchRemoveHospitalList = (idList: Key[]) => {
  return request.delete<any, null>(`/admin/hosp/hospitalSet/batchRemove`, {
    // 注意请求参数
    // 如果是post/put可以直接写参数，但是get/delete要携带body参数必须这样写
    data: idList,
  });
};

// 以下功能暂不开发
// // 锁定&解锁
// export const reqLockHospital = (id: number, status: Status) => {
//   return request.get<any, null>(`/admin/hosp/hospitalSet/lock/${id}/${status}`);
// };

// // 发送签名
// export const reqSendSignKey = (id: number) => {
//   return request.get<any, null>(`/admin/hosp/hospitalSet/sendSignKey/${id}`);
// };
