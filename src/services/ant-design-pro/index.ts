import { request } from '@umijs/max';

export const register = async (data: API.RegisterDto) => {
  return request<API.IResponse<API.TokenResult>>('/auth/register', {
    method: 'POST',
    data,
  });
};

export const login = async (data: API.LoginDto) => {
  return request<API.IResponse<API.TokenResult>>('/auth/login', {
    method: 'POST',
    data,
  });
};

export const queryCurrentUser = async () => {
  return request<API.IResponse<API.UserVO>>('/auth/profile', {
    method: 'GET',
  });
};

export const queryUserDetail = async (id: number) => {
  return request<API.IResponse<API.UserVO>>(`/user/profileById`, {
    method: 'GET',
    params: {
      id,
    },
  });
};

export const queryUserList = async (
  data: API.WithPageParams<{ realName?: string; email?: string; role?: string }>,
) => {
  return request<API.IResponse<{ data: API.UserVO[]; total: number }>>('/user', {
    method: 'GET',
    params: data,
  });
};

export const queryCode = async (data: { email: string }) => {
  return request<API.IResponse<{ success: boolean }>>('/auth/send-verification-code', {
    method: 'POST',
    data,
  });
};

export const deleteUser = async (id: number) => {
  return request<API.IResponse<boolean>>(`/user/${id}`, {
    method: 'DELETE',
  });
};

// 科室管理

// 查询科室列表
export const queryDepartmentList = async (data: API.PageParams) => {
  return request<API.IResponse<{ data: API.Department[]; total: number }>>('/departments', {
    method: 'GET',
    params: data,
  });
};

// 创建科室
export const createDepartment = async (data: API.Department) => {
  return request<API.IResponse<API.Department>>('/departments', {
    method: 'POST',
    data,
  });
};

// 更新科室
export const updateDepartment = async (data: API.Department) => {
  const { id, ...rest } = data;
  return request<API.IResponse<API.Department>>(`/departments/${id}`, {
    method: 'PUT',
    data: rest,
  });
};
// 查询科室详情
export const queryDepartmentDetail = async (id: number) => {
  return request<API.IResponse<API.Department>>(`/departments/${id}`, {
    method: 'GET',
  });
};

// 删除科室
export const deleteDepartment = async (id: number) => {
  return request<API.IResponse<boolean>>(`/departments/${id}`, {
    method: 'DELETE',
  });
};

// 查询医生列表
export const queryDoctorList = async (
  data: API.WithPageParams<{
    title: string;
    department: string;
    auditStatus: string;
    schedule: string;
  }>,
) => {
  return request<API.IResponse<{ data: API.Doctor[]; total: number }>>('/doctors', {
    method: 'GET',
    params: data,
  });
};

// 查询医生详情
export const queryDoctorDetail = async (id: number) => {
  return request<API.IResponse<API.Doctor>>(`/doctors/${id}`, {
    method: 'GET',
  });
};
// 创建医生
export const createDoctor = async (data: API.Doctor) => {
  return request<API.IResponse<API.Doctor>>('/doctors', {
    method: 'POST',
    data,
  });
};
// 更新医生
export const updateDoctor = async (data: API.Doctor) => {
  const { id, ...rest } = data;
  return request<API.IResponse<API.Doctor>>(`/doctors/${id}`, {
    method: 'PUT',
    data: rest,
  });
};

// 删除医生
export const deleteDoctor = async (id: number) => {
  return request<API.IResponse<boolean>>(`/doctors/${id}`, {
    method: 'DELETE',
  });
};

// 审核医生
export const auditDoctor = async (id: number) => {
  return request<API.IResponse<boolean>>(`/doctors/${id}/audit`, {
    method: 'PUT',
  });
};

// 获取医生预约排名信息
export const queryDoctorRanking = async (doctorId: number) => {
  return request<
    API.IResponse<{
      totalAppointments: number;
      rankInDepartment: number;
      departmentDoctorCount: number;
    }>
  >(`/doctors/${doctorId}/stats`, {
    method: 'GET',
  });
};

// 药物管理
// 查询药物列表
export const queryDrugList = async (
  data: API.WithPageParams<{ name?: string; department?: string }>,
) => {
  return request<API.IResponse<{ list: API.Drug[]; total: number }>>('/drugs', {
    method: 'GET',
    params: data,
  });
};

// 查询药物详情
export const queryDrugDetail = async (id: number) => {
  return request<API.IResponse<API.Drug>>(`/drugs/${id}`, {
    method: 'GET',
  });
};

// 删除药物
export const deleteDrug = async (id: number) => {
  return request<API.IResponse<boolean>>(`/drugs/${id}`, {
    method: 'DELETE',
  });
};

export const createDrug = async (data: API.Drug) => {
  return request<API.IResponse<API.Drug>>('/drugs', {
    method: 'POST',
    data,
  });
};
export const updateDrug = async (data: API.Drug) => {
  return request<API.IResponse<API.Drug>>(`/drugs/${data.id}`, {
    method: 'PUT',
    data,
  });
};

// 药物种类
export const queryDrugTypeList = async () => {
  return request<API.IResponse<string[]>>('/drugs/distinct/name', {
    method: 'GET',
  });
};

export const queryDrugByName = async (name: string) => {
  return request<API.IResponse<API.Drug>>('/drugs/detail/byName', {
    method: 'GET',
    params: { name },
  });
};

// 药物花费
export const queryDrugCostList = async () => {
  return request<API.IResponse<number>>('/drugs/total/purchase-cost', {
    method: 'GET',
  });
};

// 药物利润
export const queryDrugProfitList = async () => {
  return request<API.IResponse<number>>('/drugs/total/profit', {
    method: 'GET',
  });
};

// 预约管理
// 创建预约
export const createAppointment = async (
  data: Omit<API.Appointment, 'diagnosticResult' | 'drug' | 'doctorAdvice' | 'id' | 'status'>,
) => {
  return request<API.IResponse<API.Appointment>>('/appointments', {
    method: 'POST',
    data,
  });
};

// 查询预约列表
export const queryAppointmentList = async (
  data: API.WithPageParams<{
    userId?: string;
    doctorId?: string;
    status?: string;
  }>,
) => {
  return request<API.IResponse<API.Appointment[]>>('/appointments', {
    method: 'GET',
    params: data,
  });
};

// 叫号
export const callAppointment = async (id: string) => {
  return request<API.IResponse<API.Appointment>>(`/appointments/${id}/call`, {
    method: 'PUT',
  });
};

// 就诊
export const visitAppointment = async (
  id: string,
  data: Pick<API.Appointment, 'diagnosticResult' | 'drug' | 'doctorAdvice'>,
) => {
  return request<API.IResponse>(`/appointments/${id}`, {
    method: 'PUT',
    data,
  });
};

// 评价管理
// 创建评价
export const createEvaluation = async (data: API.Evaluation) => {
  return request<API.IResponse<API.Evaluation>>('/evaluations', {
    method: 'POST',
    data,
  });
};

//
export const queryEvaluationById = async (id: number) => {
  return request<API.IResponse<API.Evaluation>>(`/evaluations/appointment/${id}`, {
    method: 'GET',
  });
};

export const queryEvaluationsByDoctorId = async (doctorId: number) => {
  return request<API.IResponse<API.Evaluation[]>>(`/evaluations/doctor/${doctorId}`, {
    method: 'GET',
  });
};
