import { AxiosError } from "axios";

import type { StandardErrorResponse } from "@/types/api";

const DEFAULT_ERROR: StandardErrorResponse = {
  code: "SYSTEM_ERROR",
  message: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  timestamp: new Date().toISOString(),
};

export class AppApiError extends Error {
  code: string;
  status?: number;
  timestamp: string;

  constructor(error: StandardErrorResponse, status?: number) {
    super(error.message);
    this.name = "AppApiError";
    this.code = error.code;
    this.status = status;
    this.timestamp = error.timestamp;
  }
}

export function normalizeApiError(error: unknown): AppApiError {
  if (!isAxiosError(error)) {
    return new AppApiError(DEFAULT_ERROR);
  }

  const responseData = error.response?.data;

  if (isStandardErrorResponse(responseData)) {
    return new AppApiError(responseData, error.response?.status);
  }

  return new AppApiError(
    {
      ...DEFAULT_ERROR,
      message: error.message || DEFAULT_ERROR.message,
    },
    error.response?.status,
  );
}

function isAxiosError(error: unknown): error is AxiosError {
  return Boolean(error && typeof error === "object" && "isAxiosError" in error);
}

function isStandardErrorResponse(
  value: unknown,
): value is StandardErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const error = value as Partial<StandardErrorResponse>;

  return (
    typeof error.code === "string" &&
    typeof error.message === "string" &&
    typeof error.timestamp === "string"
  );
}
