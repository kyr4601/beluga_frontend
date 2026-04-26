"use client";

import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui";
import { useEvents } from "@/hooks/use-events";
import type { EventStatus, GifticonEvent } from "@/types/event";

const COPY = {
  loading: "이벤트를 불러오는 중입니다.",
  errorTitle: "이벤트를 불러오지 못했습니다",
  retry: "다시 시도",
  active: "진행 중인 이벤트",
  scheduled: "예정된 이벤트",
  empty: "표시할 이벤트가 없습니다.",
  activeEmpty: "현재 진행 중인 이벤트가 없습니다.",
  scheduledEmpty: "예정된 이벤트가 없습니다.",
};

export function EventList() {
  const { data: events = [], isError, isLoading, refetch } = useEvents();
  const activeEvents = filterEvents(events, "ACTIVE");
  const scheduledEvents = filterEvents(events, "SCHEDULED");

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface p-6 text-sm font-semibold text-slate-600">
        {COPY.loading}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6">
        <p className="text-sm font-bold text-red-700">{COPY.errorTitle}</p>
        <Button className="mt-4" onClick={() => refetch()} variant="danger">
          {COPY.retry}
        </Button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface p-6 text-sm font-semibold text-slate-600">
        {COPY.empty}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <EventSection
        emptyMessage={COPY.activeEmpty}
        events={activeEvents}
        title={COPY.active}
      />
      <EventSection
        emptyMessage={COPY.scheduledEmpty}
        events={scheduledEvents}
        title={COPY.scheduled}
      />
    </div>
  );
}

function EventSection({
  emptyMessage,
  events,
  title,
}: {
  emptyMessage: string;
  events: GifticonEvent[];
  title: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4 grid gap-3">
        {events.length > 0 ? (
          events.map((event) => <EventCard event={event} key={event.id} />)
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm font-medium text-slate-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

function filterEvents(events: GifticonEvent[], status: EventStatus) {
  return events
    .filter((event) => event.status === status)
    .sort(
      (firstEvent, secondEvent) =>
        new Date(firstEvent.startAt).getTime() -
        new Date(secondEvent.startAt).getTime(),
    );
}
