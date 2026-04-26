"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button, Input, useToast } from "@/components/ui";
import {
  useAdminEventResults,
  useAdminParticipations,
  useAdminWinners,
  useCreateAdminEvent,
} from "@/hooks/use-admin";
import type { AdminEventResult, AdminParticipation } from "@/types/admin";

const participationResultLabel = {
  WIN: "당첨",
  LOSE: "미당첨",
};

export function AdminDashboard() {
  const { showToast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { data: eventResults = [], isLoading } = useAdminEventResults();
  const { data: participations = [] } =
    useAdminParticipations(selectedEventId);
  const { data: winners = [] } = useAdminWinners(selectedEventId);
  const createEventMutation = useCreateAdminEvent();
  const [form, setForm] = useState({
    image: null as File | null,
    title: "",
    productName: "",
    winnerLimit: 1,
    startAt: "",
    endAt: "",
  });

  function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createEventMutation.mutate(form, {
      onSuccess: () => {
        setForm({
          image: null,
          title: "",
          productName: "",
          winnerLimit: 1,
          startAt: "",
          endAt: "",
        });
        showToast({ message: "이벤트가 생성되었습니다.", tone: "success" });
      },
      onError: (error) => {
        showToast({
          message:
            error instanceof Error ? error.message : "이벤트 생성에 실패했습니다.",
          tone: "error",
        });
      },
    });
  }

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link className="text-sm font-bold text-beluga-sky-deep" href="/">
              Beluga
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
              관리자 대시보드
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              이벤트 생성, 결과 요약, 참여 이력과 당첨자 목록을 관리합니다.
            </p>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
            href="/mypage"
          >
            마이페이지
          </Link>
        </header>

        <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <form
            className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60"
            onSubmit={handleCreateEvent}
          >
            <h2 className="text-xl font-bold text-slate-950">이벤트 생성</h2>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  이미지
                </span>
                <input
                  accept="image/*"
                  className="block w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:text-sm file:font-semibold file:text-sky-700"
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      image: event.target.files?.[0] ?? null,
                    }))
                  }
                  type="file"
                />
              </label>
              <Input
                label="이벤트명"
                name="title"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    title: event.target.value,
                  }))
                }
                required
                value={form.title}
              />
              <Input
                label="상품명"
                name="productName"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    productName: event.target.value,
                  }))
                }
                required
                value={form.productName}
              />
              <Input
                label="당첨 인원"
                min={1}
                name="winnerLimit"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    winnerLimit: Number(event.target.value),
                  }))
                }
                required
                type="number"
                value={form.winnerLimit}
              />
              <Input
                label="시작 일시"
                name="startAt"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    startAt: event.target.value,
                  }))
                }
                required
                type="datetime-local"
                value={form.startAt}
              />
              <Input
                label="종료 일시"
                name="endAt"
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    endAt: event.target.value,
                  }))
                }
                required
                type="datetime-local"
                value={form.endAt}
              />
            </div>
            <Button
              className="mt-5 w-full"
              isLoading={createEventMutation.isPending}
              type="submit"
            >
              이벤트 생성
            </Button>
          </form>

          <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-bold text-slate-950">
              이벤트 결과 목록
            </h2>
            <div className="mt-5 grid gap-3">
              {isLoading ? (
                <div className="text-sm font-semibold text-slate-600">
                  결과를 불러오는 중입니다.
                </div>
              ) : eventResults.length > 0 ? (
                eventResults.map((event) => (
                  <AdminEventResultCard
                    event={event}
                    isSelected={selectedEventId === event.eventId}
                    key={event.eventId}
                    onSelect={() => setSelectedEventId(event.eventId)}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm font-medium text-slate-500">
                  생성된 이벤트 결과가 없습니다.
                </div>
              )}
            </div>
          </section>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ParticipationTable
            emptyMessage="이벤트를 선택하면 참여 이력이 표시됩니다."
            participations={participations}
            title="상세 참여 이력"
          />
          <ParticipationTable
            emptyMessage="이벤트를 선택하면 당첨자 목록이 표시됩니다."
            participations={winners}
            title="당첨자 목록"
          />
        </section>
      </div>
    </main>
  );
}

function AdminEventResultCard({
  event,
  isSelected,
  onSelect,
}: {
  event: AdminEventResult;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`rounded-xl border p-5 text-left transition ${
        isSelected
          ? "border-sky-300 bg-sky-50"
          : "border-border-subtle bg-white hover:bg-slate-50"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">
            {event.eventName}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{event.productName}</p>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {formatDate(event.startAt)} - {formatDate(event.endAt)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <Metric label="당첨" value={event.winnerCount} />
          <Metric label="참여" value={event.participantCount} />
          <Metric label="정원" value={event.winnerLimit} />
        </div>
      </div>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">
        {value.toLocaleString("ko-KR")}
      </p>
    </div>
  );
}

function ParticipationTable({
  emptyMessage,
  participations,
  title,
}: {
  emptyMessage: string;
  participations: AdminParticipation[];
  title: string;
}) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        {participations.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">순위</th>
                <th className="px-4 py-3 font-semibold">닉네임</th>
                <th className="px-4 py-3 font-semibold">결과</th>
                <th className="px-4 py-3 font-semibold">참여 일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {participations.map((participation) => (
                <tr key={participation.participantId}>
                  <td className="px-4 py-3 font-semibold text-slate-950">
                    {participation.rank}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {participation.nickname}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {participationResultLabel[participation.result]}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(participation.participatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-5 text-sm font-medium text-slate-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
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
