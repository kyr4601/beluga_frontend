"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui";
import { useParticipateEvent } from "@/hooks/use-participate-event";
import type { GifticonEvent } from "@/types/event";

const COPY = {
  product: "상품",
  winners: "당첨 예정인원",
  period: "기간",
  join: "참여하기",
  preparing: "참여 준비 중",
  people: "명",
};

interface EventCardProps {
  event: GifticonEvent;
}

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function EventCard({ event }: EventCardProps) {
  const isLockedRef = useRef(false);
  const [isClickLocked, setIsClickLocked] = useState(false);
  const participateMutation = useParticipateEvent(event.id);
  const isJoinable = event.status === "ACTIVE";
  const isParticipating = participateMutation.isPending || isClickLocked;

  function handleParticipate() {
    if (!isJoinable || participateMutation.isPending || isLockedRef.current) {
      return;
    }

    isLockedRef.current = true;
    setIsClickLocked(true);
    participateMutation.mutate(undefined, {
      onSettled: () => {
        isLockedRef.current = false;
        setIsClickLocked(false);
      },
    });
  }

  return (
    <article className="rounded-xl border border-border-subtle bg-surface p-5 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-slate-950">
            {event.title}
          </h3>
          <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-500">{COPY.product}</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {event.productName}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">{COPY.winners}</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {event.winnerLimit.toLocaleString("ko-KR")}
                {COPY.people}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold text-slate-500">{COPY.period}</dt>
              <dd className="mt-1 font-medium text-slate-900">
                {formatDate(event.startAt)} - {formatDate(event.endAt)}
              </dd>
            </div>
          </dl>
        </div>
        <Button
          disabled={!isJoinable}
          isLoading={isParticipating}
          onClick={handleParticipate}
          size="lg"
        >
          {isJoinable ? COPY.join : COPY.preparing}
        </Button>
      </div>
    </article>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return dateFormatter.format(parsedDate);
}
