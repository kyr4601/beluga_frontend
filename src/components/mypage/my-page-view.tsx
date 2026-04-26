"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button, Input, useToast } from "@/components/ui";
import {
  useMyParticipations,
  useMyProfile,
  useUpdateNickname,
  useUpdatePassword,
} from "@/hooks/use-my-page";
import type { ParticipationResult } from "@/types/event";
import type { MyParticipation } from "@/types/user";

const resultLabels: Record<ParticipationResult, string> = {
  WIN: "당첨",
  LOSE: "미당첨",
  DUPLICATE: "중복 참여",
  BEFORE_START: "시작 전",
  ENDED: "종료",
  INVALID_REQUEST: "요청 오류",
  NOT_FOUND: "이벤트 없음",
  SYSTEM_ERROR: "시스템 오류",
};

export function MyPageView() {
  const { showToast } = useToast();
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { data: participations = [], isLoading: isParticipationLoading } =
    useMyParticipations();
  const updateNicknameMutation = useUpdateNickname();
  const updatePasswordMutation = useUpdatePassword();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  function handleNicknameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nickname = String(formData.get("nickname") ?? "").trim();

    updateNicknameMutation.mutate(
      { nickname },
      {
        onSuccess: () => {
          showToast({ message: "닉네임이 수정되었습니다.", tone: "success" });
        },
        onError: (error) => {
          showToast({
            message:
              error instanceof Error
                ? error.message
                : "닉네임 수정에 실패했습니다.",
            tone: "error",
          });
        },
      },
    );
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updatePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        setPasswordForm({ currentPassword: "", newPassword: "" });
        showToast({ message: "비밀번호가 수정되었습니다.", tone: "success" });
      },
      onError: (error) => {
        showToast({
          message:
            error instanceof Error
              ? error.message
              : "비밀번호 수정에 실패했습니다.",
          tone: "error",
        });
      },
    });
  }

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link className="text-sm font-bold text-beluga-sky-deep" href="/">
              Beluga
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
              마이페이지
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              회원 정보와 참여한 이벤트 결과를 확인합니다.
            </p>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
            href="/"
          >
            이벤트 목록
          </Link>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          <form
            className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60"
            onSubmit={handleNicknameSubmit}
          >
            <h2 className="text-xl font-bold text-slate-950">닉네임 수정</h2>
            <p className="mt-2 text-sm text-slate-600">
              {isProfileLoading
                ? "회원 정보를 불러오는 중입니다."
                : `이메일: ${profile?.email ?? "-"}`}
            </p>
            <div className="mt-5">
              <Input
                label="닉네임"
                name="nickname"
                defaultValue={profile?.nickname ?? ""}
                required
              />
            </div>
            <Button
              className="mt-5 w-full"
              isLoading={updateNicknameMutation.isPending}
              type="submit"
            >
              닉네임 저장
            </Button>
          </form>

          <form
            className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60"
            onSubmit={handlePasswordSubmit}
          >
            <h2 className="text-xl font-bold text-slate-950">
              비밀번호 수정
            </h2>
            <div className="mt-5 space-y-4">
              <Input
                autoComplete="current-password"
                label="현재 비밀번호"
                name="currentPassword"
                onChange={(event) =>
                  setPasswordForm((currentForm) => ({
                    ...currentForm,
                    currentPassword: event.target.value,
                  }))
                }
                required
                type="password"
                value={passwordForm.currentPassword}
              />
              <Input
                autoComplete="new-password"
                label="새 비밀번호"
                minLength={8}
                name="newPassword"
                onChange={(event) =>
                  setPasswordForm((currentForm) => ({
                    ...currentForm,
                    newPassword: event.target.value,
                  }))
                }
                required
                type="password"
                value={passwordForm.newPassword}
              />
            </div>
            <Button
              className="mt-5 w-full"
              isLoading={updatePasswordMutation.isPending}
              type="submit"
            >
              비밀번호 저장
            </Button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950">
            참여한 이벤트
          </h2>
          <div className="mt-4 grid gap-3">
            {isParticipationLoading ? (
              <div className="rounded-xl border border-border-subtle bg-surface p-6 text-sm font-semibold text-slate-600">
                참여 이력을 불러오는 중입니다.
              </div>
            ) : participations.length > 0 ? (
              participations.map((participation) => (
                <ParticipationCard
                  key={`${participation.eventId}-${participation.participatedAt}`}
                  participation={participation}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm font-medium text-slate-500">
                아직 참여한 이벤트가 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ParticipationCard({
  participation,
}: {
  participation: MyParticipation;
}) {
  const isWinner = participation.result === "WIN";

  return (
    <article className="rounded-xl border border-border-subtle bg-surface p-5 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-beluga-sky-deep">
            {resultLabels[participation.result]}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">
            {participation.eventName}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {participation.productName}
          </p>
          {participation.participatedAt ? (
            <p className="mt-1 text-xs font-medium text-slate-400">
              참여 일시: {formatDate(participation.participatedAt)}
            </p>
          ) : null}
        </div>

        {isWinner && participation.gifticonImageUrl ? (
          <div className="w-full max-w-xs">
            {/* Remote gifticon domains are backend-defined, so native img avoids Next image host config drift. */}
            <img
              alt={`${participation.productName} 기프티콘`}
              className="aspect-video w-full rounded-lg border border-slate-200 object-cover"
              src={participation.gifticonImageUrl}
            />
            <a
              className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-lg bg-sky-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
              download
              href={participation.gifticonImageUrl}
            >
              기프티콘 다운로드
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}
