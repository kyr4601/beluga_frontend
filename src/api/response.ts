import type { AxiosResponse } from "axios";

import type { ApiResponse } from "@/types/api";

export function unwrapApiData<T>(response: AxiosResponse<ApiResponse<T> | T>) {
  const responseData = response.data;

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as ApiResponse<T>).data;
  }

  return responseData as T;
}
