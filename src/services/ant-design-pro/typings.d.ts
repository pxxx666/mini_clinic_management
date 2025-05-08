// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    page?: number;
    limit?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  interface RegisterDto {
    email: string;
    password: string;
    confirmPassword?: string;
    role: string;
    idCard: string;
    realName: string;
    phone: string;
  }

  interface LoginDto {
    email: string;
    password?: string;
    code?: string;
  }

  interface TokenResult {
    access_token: string;
  }

  interface UserVO {
    userId: number;
    email: string;
    role: string;
    realName: string;
    idCard: string;
    phone: string;
  }

  interface IResponse<T> {
    code: number;
    message: string;
    data: T;
  }

  interface PageParams {
    page: number;
    limit: number;
  }

  type WithPageParams<T> = Partial<T> & PageParams;

  // 定义科室数据类型
  interface Department {
    id?: string;
    name: string;
    description: string;
  }

  // 定义医生数据类型
  interface Doctor {
    id: number;
    name: string;
    gender: '男' | '女';
    title: string;
    department: string;
    expertise: string;
    workingYears: number;
    phone: string;
    email: string;
    introduction: string;
    education: string[]; // 如果教育背景有更复杂的结构，可以进一步定义
    certificate: string[]; // 如果证书有更复杂的结构，可以进一步定义
    schedule: string[]; // 或者可以定义为更具体的类型，如 "1,3,5" | "2,4,6" 等
    auditStatus: string; // 如果状态有固定值，可以改为联合类型，如 "0" | "1" | "2" 等
  }

  // 定义药物数据类型
  interface Drug {
    id: number;
    name: string;
    stock: number;
    price: number;
    specification: string;
    purchasePrice: number;
    purchaseQuantity: number;
    createAt: string; // 或使用 Date 类型，具体取决于使用场景
    department: string; // 如果科室是固定值，可以改为联合类型如 "内科" | "外科" | "儿科" 等
  }

  interface Appointment {
    id: number; // 自增主键
    userId: string; // 患者ID
    patientName: string; // 患者姓名
    patientEmail: string; // 患者邮箱
    doctorId: string; // 医生ID
    doctorName: string; // 医生姓名
    doctorTitle: string; // 医生职位
    department: string; // 科室
    appointmentTime: string; // 预约时间
    patientDescription: string; // 病情描述
    diagnosticResult: string; // 诊断结果
    drug: {
      name: string;
      count: number;
      useMethod: string;
    }[]; // 用药信息
    doctorAdvice: string; // 医嘱
    status: string; // 预约状态
  }

  interface Evaluation {
    appointmentId: number; // Optional because it's auto-incremented
    patientId: number;
    patientName: string;
    doctorId: number;
    doctorName: string;
    ProfessionalMark: number;
    CommunicationMark: number;
    ServiceMark: number;
    EfficiencyMark: number;
    EthicsMark: number;
    tags?: string[]; // Optional as it's not marked NOT NULL in schema
    remark?: string; // Optional as it's not marked NOT NULL in schema
    evaluationDate: string; // Date format: YYYY-MM-DD
  }
}
