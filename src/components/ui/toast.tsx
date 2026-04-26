"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";
import type { ParticipationResult } from "@/types/event";

type ToastTone = "success" | "info" | "warning" | "error";

interface ToastItem {
  id: number;
  message: string;
  title?: string;
  tone?: ToastTone;
}

interface ShowToastOptions extends Omit<ToastItem, "id"> {
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: ShowToastOptions) => void;
  showParticipationToast: (result: ParticipationResult) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const CLOSE_LABEL = "알림 닫기";

const toneClasses: Record<ToastTone, string> = {
  success: "border-sky-200 bg-sky-50 text-sky-950",
  info: "border-slate-200 bg-white text-slate-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-red-200 bg-red-50 text-red-950",
};

const participationMessages: Record<
  ParticipationResult,
  Omit<ToastItem, "id">
> = {
  WIN: {
    title: "당첨되었습니다",
    message: "마이페이지에서 기프티콘을 확인할 수 있어요.",
    tone: "success",
  },
  LOSE: {
    title: "아쉽게도 마감되었습니다",
    message: "다음 이벤트를 기다려 주세요.",
    tone: "info",
  },
  DUPLICATE: {
    title: "이미 참여한 이벤트입니다",
    message: "중복 참여는 한 번만 안내됩니다.",
    tone: "warning",
  },
  BEFORE_START: {
    title: "아직 시작 전입니다",
    message: "이벤트 시작 시간에 다시 참여해 주세요.",
    tone: "warning",
  },
  ENDED: {
    title: "종료된 이벤트입니다",
    message: "참여 가능한 이벤트를 확인해 주세요.",
    tone: "info",
  },
  INVALID_REQUEST: {
    title: "요청을 확인해 주세요",
    message: "입력값 또는 참여 조건이 올바르지 않습니다.",
    tone: "error",
  },
  NOT_FOUND: {
    title: "이벤트를 찾을 수 없습니다",
    message: "목록을 새로고침한 뒤 다시 시도해 주세요.",
    tone: "error",
  },
  SYSTEM_ERROR: {
    title: "잠시 후 다시 시도해 주세요",
    message: "일시적인 오류가 발생했습니다.",
    tone: "error",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    ({ duration = 3000, ...toast }: ShowToastOptions) => {
      const id = Date.now();

      setToasts((currentToasts) => [...currentToasts, { ...toast, id }]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const showParticipationToast = useCallback(
    (result: ParticipationResult) => {
      showToast(participationMessages[result]);
    },
    [showToast],
  );

  const value = useMemo(
    () => ({ showParticipationToast, showToast }),
    [showParticipationToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport onClose={removeToast} toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

function ToastViewport({
  onClose,
  toasts,
}: {
  onClose: (id: number) => void;
  toasts: ToastItem[];
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 shadow-lg shadow-slate-900/10",
            toneClasses[toast.tone ?? "info"],
          )}
          key={toast.id}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              {toast.title ? (
                <p className="text-sm font-bold">{toast.title}</p>
              ) : null}
              <p className="mt-1 text-sm leading-5">{toast.message}</p>
            </div>
            <button
              aria-label={CLOSE_LABEL}
              className="rounded-md px-1 text-lg leading-none opacity-60 transition hover:opacity-100"
              onClick={() => onClose(toast.id)}
              type="button"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
