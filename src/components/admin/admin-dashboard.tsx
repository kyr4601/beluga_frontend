"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

import { Button, Modal, useToast } from "@/components/ui";
import {
  useAdminEventResults,
  useAdminParticipations,
  useCreateAdminEvent,
  useUpdateAdminEvent,
  useUploadGifticonImage,
} from "@/hooks/use-admin";
import type { AdminEventResult, AdminParticipation } from "@/types/admin";
import type { EventStatus } from "@/types/event";

import { initialEventForm } from "./admin-dashboard.constants";
import type { EventFormState } from "./admin-dashboard.types";
import { toDateTimeLocalValue } from "./admin-dashboard.utils";
import { EventForm } from "./event-form";
import { EventResultList } from "./event-result-list";
import { ParticipationHistory } from "./participation-history";

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
  const { data: eventResults = [], isLoading } =
    useAdminEventResults(statusFilter);
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
        if (first.resultStatus !== second.resultStatus) {
          return first.resultStatus === "WIN" ? -1 : 1;
        }

        return first.requestSequence - second.requestSequence;
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
