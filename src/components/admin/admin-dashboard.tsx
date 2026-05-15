"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

import { Button, Input, Modal, useToast } from "@/components/ui";
import {
  useAdminEventResults,
  useAdminParticipations,
  useCreateAdminEvent,
  useUpdateAdminEvent,
  useUploadGifticonImage,
} from "@/hooks/use-admin";
import type { AdminEventResult, AdminParticipation } from "@/types/admin";
import type { EventStatus } from "@/types/event";

type EventFormState = {
  image: File | null;
  eventName: string;
  productName: string;
  winnerLimit: number;
  startAt: string;
  endAt: string;
};

const participationResultLabel = {
  WIN: "당첨",
  LOSE: "미당첨",
};

const eventStatusLabel: Record<EventStatus, string> = {
  SCHEDULED: "예정",
  ACTIVE: "진행중",
  ENDED: "완료",
};

const eventStatusFilters: EventStatus[] = ["SCHEDULED", "ACTIVE", "ENDED"];

const initialEventForm: EventFormState = {
  image: null,
  eventName: "",
  productName: "",
  winnerLimit: 1,
  startAt: "",
  endAt: "",
};

export function AdminDashboard() {
  const { showToast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<EventStatus>("ACTIVE");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEventResult | null>(
    null,
  );
  const [gifticonTarget, setGifticonTarget] =
    useState<AdminParticipation | null>(null);
  const [gifticonImage, setGifticonImage] = useState<File | null>(null);
  const [createForm, setCreateForm] = useState<EventFormState>(initialEventForm);
  const [editForm, setEditForm] = useState<EventFormState>(initialEventForm);
  const { data: eventResults = [], isLoading } = useAdminEventResults();
  const { data: participations = [], isFetching: isParticipationFetching } =
    useAdminParticipations(selectedEventId);
  const createEventMutation = useCreateAdminEvent();
  const updateEventMutation = useUpdateAdminEvent();
  const uploadGifticonMutation = useUploadGifticonImage();

  const filteredEvents = useMemo(
    () => eventResults.filter((event) => event.status === statusFilter),
    [eventResults, statusFilter],
  );
  const selectedEvent =
    eventResults.find((event) => event.eventId === selectedEventId) ?? null;
  const sortedParticipations = useMemo(
    () =>
      [...participations].sort((first, second) => {
        if (first.result !== second.result) {
          return first.result === "WIN" ? -1 : 1;
        }

        return first.rank - second.rank;
      }),
    [participations],
  );

  function handleFilterChange(nextStatus: EventStatus) {
    setStatusFilter(nextStatus);
    setSelectedEventId(null);
  }

  function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createEventMutation.mutate(createForm, {
      onSuccess: () => {
        setCreateForm(initialEventForm);
        setIsCreateModalOpen(false);
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

  function handleOpenEditModal(event: AdminEventResult) {
    setEditingEvent(event);
    setEditForm({
      image: null,
      eventName: event.eventName,
      productName: event.productName,
      winnerLimit: event.winnerLimit,
      startAt: toDateTimeLocalValue(event.startAt),
      endAt: toDateTimeLocalValue(event.endAt),
    });
  }

  function handleUpdateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingEvent) {
      return;
    }

    updateEventMutation.mutate(
      {
        eventId: editingEvent.eventId,
        ...editForm,
      },
      {
        onSuccess: () => {
          setEditingEvent(null);
          setEditForm(initialEventForm);
          showToast({ message: "이벤트 정보가 수정되었습니다.", tone: "success" });
        },
        onError: (error) => {
          showToast({
            message:
              error instanceof Error
                ? error.message
                : "이벤트 정보 수정에 실패했습니다.",
            tone: "error",
          });
        },
      },
    );
  }

  function handleUploadGifticon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!gifticonTarget || !gifticonImage) {
      return;
    }

    uploadGifticonMutation.mutate(
      {
        participantId: gifticonTarget.participantId,
        image: gifticonImage,
      },
      {
        onSuccess: () => {
          setGifticonTarget(null);
          setGifticonImage(null);
          showToast({
            message: "기프티콘 이미지가 등록되었습니다.",
            tone: "success",
          });
        },
        onError: (error) => {
          showToast({
            message:
              error instanceof Error
                ? error.message
                : "기프티콘 이미지 등록에 실패했습니다.",
            tone: "error",
          });
        },
      },
    );
  }

  function closeGifticonModal() {
    setGifticonTarget(null);
    setGifticonImage(null);
  }

  return (
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link className="text-sm font-bold text-beluga-sky-deep" href="/">
              Beluga
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
              관리자 대시보드
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              이벤트 결과와 참여 이력을 확인하고 당첨자 기프티콘을 등록합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              이벤트 생성
            </Button>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
              href="/mypage"
            >
              마이페이지
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <EventResultList
            events={filteredEvents}
            isLoading={isLoading}
            onEditEvent={handleOpenEditModal}
            onFilterChange={handleFilterChange}
            onSelectEvent={setSelectedEventId}
            selectedEventId={selectedEventId}
            statusFilter={statusFilter}
          />
          <ParticipationHistory
            event={selectedEvent}
            isFetching={isParticipationFetching}
            onOpenGifticonModal={(participation) => {
              setGifticonTarget(participation);
              setGifticonImage(null);
            }}
            participations={sortedParticipations}
          />
        </section>
      </div>

      <Modal
        cancelLabel="닫기"
        onClose={() => setIsCreateModalOpen(false)}
        open={isCreateModalOpen}
        title="이벤트 생성"
      >
        <EventForm
          form={createForm}
          imageRequired
          isLoading={createEventMutation.isPending}
          onChange={setCreateForm}
          onSubmit={handleCreateEvent}
          submitLabel="생성 완료"
        />
      </Modal>

      <Modal
        cancelLabel="닫기"
        description="예정 상태의 이벤트 정보만 수정할 수 있습니다."
        onClose={() => setEditingEvent(null)}
        open={editingEvent !== null}
        title="이벤트 정보 수정"
      >
        <EventForm
          form={editForm}
          imageLabel="대표 이미지 변경"
          isLoading={updateEventMutation.isPending}
          onChange={setEditForm}
          onSubmit={handleUpdateEvent}
          submitLabel="수정 완료"
        />
      </Modal>

      <Modal
        cancelLabel="닫기"
        description={
          gifticonTarget
            ? `${gifticonTarget.nickname} 당첨자에게 지급할 이미지를 등록합니다.`
            : undefined
        }
        onClose={closeGifticonModal}
        open={gifticonTarget !== null}
        title="기프티콘 이미지 등록"
      >
        <form className="space-y-5" onSubmit={handleUploadGifticon}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">
              기프티콘 이미지
            </span>
            <input
              accept="image/*"
              className="block w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:text-sm file:font-semibold file:text-sky-700"
              onChange={(event) =>
                setGifticonImage(event.target.files?.[0] ?? null)
              }
              required
              type="file"
            />
          </label>
          <Button
            className="w-full"
            disabled={!gifticonImage}
            isLoading={uploadGifticonMutation.isPending}
            type="submit"
          >
            등록 완료
          </Button>
        </form>
      </Modal>
    </main>
  );
}

function EventForm({
  form,
  imageLabel = "대표 이미지",
  imageRequired = false,
  isLoading,
  onChange,
  onSubmit,
  submitLabel,
}: {
  form: EventFormState;
  imageLabel?: string;
  imageRequired?: boolean;
  isLoading: boolean;
  onChange: (form: EventFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          {imageLabel}
        </span>
        <input
          accept="image/*"
          className="block w-full text-sm text-slate-600 file:mr-4 file:h-10 file:rounded-lg file:border-0 file:bg-sky-50 file:px-4 file:text-sm file:font-semibold file:text-sky-700"
          onChange={(event) =>
            onChange({
              ...form,
              image: event.target.files?.[0] ?? null,
            })
          }
          required={imageRequired}
          type="file"
        />
      </label>
      <Input
        label="이벤트명"
        name="eventName"
        onChange={(event) =>
          onChange({
            ...form,
            eventName: event.target.value,
          })
        }
        required
        value={form.eventName}
      />
      <Input
        label="상품명"
        name="productName"
        onChange={(event) =>
          onChange({
            ...form,
            productName: event.target.value,
          })
        }
        required
        value={form.productName}
      />
      <Input
        label="당첨 인원"
        min={1}
        name="winnerLimit"
        onChange={(event) =>
          onChange({
            ...form,
            winnerLimit: Number(event.target.value),
          })
        }
        required
        type="number"
        value={form.winnerLimit}
      />
      <Input
        label="시작 일시"
        name="startAt"
        onChange={(event) =>
          onChange({
            ...form,
            startAt: event.target.value,
          })
        }
        required
        type="datetime-local"
        value={form.startAt}
      />
      <Input
        label="종료 일시"
        name="endAt"
        onChange={(event) =>
          onChange({
            ...form,
            endAt: event.target.value,
          })
        }
        required
        type="datetime-local"
        value={form.endAt}
      />
      <Button className="w-full" isLoading={isLoading} type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}

function EventResultList({
  events,
  isLoading,
  onEditEvent,
  onFilterChange,
  onSelectEvent,
  selectedEventId,
  statusFilter,
}: {
  events: AdminEventResult[];
  isLoading: boolean;
  onEditEvent: (event: AdminEventResult) => void;
  onFilterChange: (status: EventStatus) => void;
  onSelectEvent: (eventId: number) => void;
  selectedEventId: number | null;
  statusFilter: EventStatus;
}) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-950">이벤트 관리</h2>
        <div className="grid grid-cols-3 gap-2">
          {eventStatusFilters.map((status) => (
            <button
              className={`h-10 rounded-lg text-sm font-bold transition ${
                statusFilter === status
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
              key={status}
              onClick={() => onFilterChange(status)}
              type="button"
            >
              {eventStatusLabel[status]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {isLoading ? (
          <div className="text-sm font-semibold text-slate-600">
            결과를 불러오는 중입니다.
          </div>
        ) : events.length > 0 ? (
          events.map((event) => (
            <AdminEventResultCard
              event={event}
              isSelected={selectedEventId === event.eventId}
              key={event.eventId}
              onEdit={() => onEditEvent(event)}
              onSelect={() => onSelectEvent(event.eventId)}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm font-medium text-slate-500">
            {eventStatusLabel[statusFilter]} 이벤트가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}

function AdminEventResultCard({
  event,
  isSelected,
  onEdit,
  onSelect,
}: {
  event: AdminEventResult;
  isSelected: boolean;
  onEdit: () => void;
  onSelect: () => void;
}) {
  const isScheduled = event.status === "SCHEDULED";

  return (
    <article
      className={`rounded-xl border p-5 transition ${
        isSelected
          ? "border-sky-300 bg-sky-50"
          : "border-border-subtle bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-950">
              {event.eventName}
            </h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {eventStatusLabel[event.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{event.productName}</p>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {formatDate(event.startAt)} - {formatDate(event.endAt)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <Metric label="당첨자" value={event.winnerCount} />
          <Metric label="참여자" value={event.participantCount} />
          <Metric label="정원" value={event.winnerLimit} />
        </div>
        <Button
          className="w-full"
          onClick={isScheduled ? onEdit : onSelect}
          variant={isSelected ? "primary" : "secondary"}
        >
          {isScheduled ? "이벤트 수정하기" : "참여 이력 보기"}
        </Button>
      </div>
    </article>
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

function ParticipationHistory({
  event,
  isFetching,
  onOpenGifticonModal,
  participations,
}: {
  event: AdminEventResult | null;
  isFetching: boolean;
  onOpenGifticonModal: (participation: AdminParticipation) => void;
  participations: AdminParticipation[];
}) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-950">상세 참여 이력</h2>
        <p className="text-sm text-slate-500">
          {event
            ? `${event.eventName} 참여자 ${event.participantCount.toLocaleString(
                "ko-KR",
              )}명`
            : "진행중 또는 완료 이벤트의 참여 이력 보기 버튼을 눌러주세요."}
        </p>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        {!event ? (
          <div className="p-5 text-sm font-medium text-slate-500">
            선택된 이벤트가 없습니다.
          </div>
        ) : isFetching ? (
          <div className="p-5 text-sm font-medium text-slate-500">
            참여 이력을 불러오는 중입니다.
          </div>
        ) : participations.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {participations.map((participation) => {
              const isWinner = participation.result === "WIN";

              return (
                <li
                  className="flex flex-col gap-3 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={participation.participantId}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-950">
                        #{participation.rank}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {participation.nickname}
                      </span>
                      {isWinner ? (
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700">
                          당첨
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                          {participationResultLabel[participation.result]}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {participation.email ? `${participation.email} · ` : ""}
                      {formatDate(participation.participatedAt)}
                    </p>
                  </div>
                  {isWinner ? (
                    <Button
                      onClick={() => onOpenGifticonModal(participation)}
                      size="sm"
                      variant="secondary"
                    >
                      기프티콘 이미지 등록
                    </Button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-5 text-sm font-medium text-slate-500">
            표시할 참여 이력이 없습니다.
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

function toDateTimeLocalValue(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const timezoneOffset = parsedDate.getTimezoneOffset() * 60_000;
  return new Date(parsedDate.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}
