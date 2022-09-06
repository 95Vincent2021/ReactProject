import { request } from "@/utils/http";

const api_name = "/admin/cms/banner";

export const getPageList = (page: number, limit: number) => {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: "get",
  });
};

export const getById = (id: number) => {
  return request({
    url: `${api_name}/get/${id}`,
    method: "get",
  });
};

export const save = (role: any) => {
  return request({
    url: `${api_name}/save`,
    method: "post",
    data: role,
  });
};

export const updateById = (role: any) => {
  return request({
    url: `${api_name}/update`,
    method: "put",
    data: role,
  });
};

export const removeById = (id: number) => {
  return request({
    url: `${api_name}/remove/${id}`,
    method: "delete",
  });
};

export const removeRows = (idList: any) => {
  return request({
    url: `${api_name}/batchRemove`,
    method: "delete",
    data: idList,
  });
};
