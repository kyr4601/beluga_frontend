"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export function Modal({
  cancelLabel = "닫기",
  children,
  confirmLabel,
  description,
  onClose,
  onConfirm,
  open,
  title,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl shadow-slate-900/10">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
          {description ? (
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>
        {children ? <div className="mt-5">{children}</div> : null}
        <div
          className={cn(
            "mt-6 flex gap-2",
            onConfirm ? "justify-end" : "justify-stretch",
          )}
        >
          <Button
            className={cn(!onConfirm && "w-full")}
            onClick={onClose}
            variant="secondary"
          >
            {cancelLabel}
          </Button>
          {onConfirm ? (
            <Button onClick={onConfirm}>{confirmLabel ?? "확인"}</Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
