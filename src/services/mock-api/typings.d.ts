declare namespace MockApi {
  interface MockListApi {
    data: MockList;
    msg: string;
  }

  interface MockList {
    page?: number;
    pageSize?: number;
    total?: number;
    list?: Array<MockInfo>;
  }

  interface MockInfo {
    id?: number;
    name?: string;
    code?: string;
    http_status?: number;
    response?: string;
    created_at?: string;
  }

  interface MockInfoApi {
    data: MockInfo;
    msg: string;
  }
}
