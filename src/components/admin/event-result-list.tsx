import { Button } from "@/components/ui";

import {
  eventStatusFilters,
  eventStatusLabel,
} from "./admin-dashboard.constants";
import type {
  AdminEventResultCardProps,
  EventResultListProps,
} from "./admin-dashboard.types";
import { formatCount, formatDate } from "./admin-dashboard.utils";

export function EventResultList({
  events,
  isLoading,
  onEditEvent,
  onFilterChange,
  onSelectEvent,
  selectedEventId,
  statusFilter,
}: EventResultListProps) {
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
}: AdminEventResultCardProps) {
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
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <Metric label="당첨자" value={event.winnerCount} />
          <Metric label="참여자" value={event.participantCount} />
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

function Metric({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{formatCount(value)}</p>
    </div>
  );
}
