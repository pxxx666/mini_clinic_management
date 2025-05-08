import { request } from '@umijs/max';

export const register = async (data: API.RegisterDto) => {
  return request<API.IResponse<API.TokenResult>>('/api/auth/register', {
    method: 'POST',
    data,
  });
};

export const login = async (data: API.LoginDto) => {
  return request<API.IResponse<API.TokenResult>>('/api/auth/login', {
    method: 'POST',
    data,
  });
};

export const queryCurrentUser = async () => {
  return request<API.IResponse<API.UserVO>>('/api/auth/profile', {
    method: 'GET',
  });
};

export const queryUserDetail = async (id: number) => {
  return request<API.IResponse<API.UserVO>>(`/api/user/profileById`, {
    method: 'GET',
    params: {
      id,
    },
  });
};

export const queryUserList = async (
  data: API.WithPageParams<{ realName?: string; email?: string; role?: string }>,
) => {
  return request<API.IResponse<{ data: API.UserVO[]; total: number }>>('/api/user', {
    method: 'GET',
    params: data,
  });
};

export const queryCode = async (data: { email: string }) => {
  return request<API.IResponse<{ success: boolean }>>('/api/auth/send-verification-code', {
    method: 'POST',
    data,
  });
};

export const deleteUser = async (id: number) => {
  return request<API.IResponse<boolean>>(`/api/user/${id}`, {
    method: 'DELETE',
  });
};

// 科室管理

// 查询科室列表
export const queryDepartmentList = async (data: API.PageParams) => {
  return request<API.IResponse<{ data: API.Department[]; total: number }>>('/api/departments', {
    method: 'GET',
    params: data,
  });
};

// 创建科室
export const createDepartment = async (data: API.Department) => {
  return request<API.IResponse<API.Department>>('/api/departments', {
    method: 'POST',
    data,
  });
};

// 更新科室
export const updateDepartment = async (data: API.Department) => {
  const { id, ...rest } = data;
  return request<API.IResponse<API.Department>>(`/api/departments/${id}`, {
    method: 'PUT',
    data: rest,
  });
};
// 查询科室详情
export const queryDepartmentDetail = async (id: number) => {
  return request<API.IResponse<API.Department>>(`/api/departments/${id}`, {
    method: 'GET',
  });
};

// 删除科室
export const deleteDepartment = async (id: number) => {
  return request<API.IResponse<boolean>>(`/api/departments/${id}`, {
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
  return request<API.IResponse<{ data: API.Doctor[]; total: number }>>('/api/doctors', {
    method: 'GET',
    params: data,
  });
};

// 查询医生详情
export const queryDoctorDetail = async (id: number) => {
  return request<API.IResponse<API.Doctor>>(`/api/doctors/${id}`, {
    method: 'GET',
  });
};
// 创建医生
export const createDoctor = async (data: API.Doctor) => {
  return request<API.IResponse<API.Doctor>>('/api/doctors', {
    method: 'POST',
    data,
  });
};
// 更新医生
export const updateDoctor = async (data: API.Doctor) => {
  const { id, ...rest } = data;
  return request<API.IResponse<API.Doctor>>(`/api/doctors/${id}`, {
    method: 'PUT',
    data: rest,
  });
};

// 删除医生
export const deleteDoctor = async (id: number) => {
  return request<API.IResponse<boolean>>(`/api/doctors/${id}`, {
    method: 'DELETE',
  });
};

// 审核医生
export const auditDoctor = async (id: number) => {
  return request<API.IResponse<boolean>>(`/api/doctors/${id}/audit`, {
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
  >(`/api/doctors/${doctorId}/stats`, {
    method: 'GET',
  });
};

// 药物管理
// 查询药物列表
export const queryDrugList = async (
  data: API.WithPageParams<{ name?: string; department?: string }>,
) => {
  return request<API.IResponse<{ list: API.Drug[]; total: number }>>('/api/drugs', {
    method: 'GET',
    params: data,
  });
};

// 查询药物详情
export const queryDrugDetail = async (id: number) => {
  return request<API.IResponse<API.Drug>>(`/api/drugs/${id}`, {
    method: 'GET',
  });
};

// 删除药物
export const deleteDrug = async (id: number) => {
  return request<API.IResponse<boolean>>(`/api/drugs/${id}`, {
    method: 'DELETE',
  });
};

export const createDrug = async (data: API.Drug) => {
  return request<API.IResponse<API.Drug>>('/api/drugs', {
    method: 'POST',
    data,
  });
};
export const updateDrug = async (data: API.Drug) => {
  return request<API.IResponse<API.Drug>>(`/api/drugs/${data.id}`, {
    method: 'PUT',
    data,
  });
};

// 药物种类
export const queryDrugTypeList = async () => {
  return request<API.IResponse<string[]>>('/api/drugs/distinct/name', {
    method: 'GET',
  });
};

export const queryDrugByName = async (name: string) => {
  return request<API.IResponse<API.Drug>>('/api/drugs/detail/byName', {
    method: 'GET',
    params: { name },
  });
};

// 药物花费
export const queryDrugCostList = async () => {
  return request<API.IResponse<number>>('/api/drugs/total/purchase-cost', {
    method: 'GET',
  });
};

// 药物利润
export const queryDrugProfitList = async () => {
  return request<API.IResponse<number>>('/api/drugs/total/profit', {
    method: 'GET',
  });
};

// 预约管理
// 创建预约
export const createAppointment = async (
  data: Omit<API.Appointment, 'diagnosticResult' | 'drug' | 'doctorAdvice' | 'id' | 'status'>,
) => {
  return request<API.IResponse<API.Appointment>>('/api/appointments', {
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
  return request<API.IResponse<API.Appointment[]>>('/api/appointments', {
    method: 'GET',
    params: data,
  });
};

// 叫号
export const callAppointment = async (id: string) => {
  return request<API.IResponse<API.Appointment>>(`/api/appointments/${id}/call`, {
    method: 'PUT',
  });
};

// 就诊
export const visitAppointment = async (
  id: string,
  data: Pick<API.Appointment, 'diagnosticResult' | 'drug' | 'doctorAdvice'>,
) => {
  return request<API.IResponse>(`/api/appointments/${id}`, {
    method: 'PUT',
    data,
  });
};

// 评价管理
// 创建评价
export const createEvaluation = async (data: API.Evaluation) => {
  return request<API.IResponse<API.Evaluation>>('/api/evaluations', {
    method: 'POST',
    data,
  });
};

//
export const queryEvaluationById = async (id: number) => {
  return request<API.IResponse<API.Evaluation>>(`/api/evaluations/appointment/${id}`, {
    method: 'GET',
  });
};

export const queryEvaluationsByDoctorId = async (doctorId: number) => {
  return request<API.IResponse<API.Evaluation[]>>(`/api/evaluations/doctor/${doctorId}`, {
    method: 'GET',
  });
};
