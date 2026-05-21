import { Button } from "@/components/ui";

import { participationResultLabel } from "./admin-dashboard.constants";
import type { ParticipationHistoryProps } from "./admin-dashboard.types";
import { formatCount, formatDate } from "./admin-dashboard.utils";

export function ParticipationHistory({
  event,
  isFetching,
  onOpenGifticonModal,
  participations,
}: ParticipationHistoryProps) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-950">상세 참여 이력</h2>
        <p className="text-sm text-slate-500">
          {event
            ? `${event.eventName} 참여자 ${formatCount(event.participantCount)}명`
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
              const isWinner = participation.resultStatus === "WIN";

              return (
                <li
                  className="flex flex-col gap-3 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={participation.participantId}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-950">
                        #{participation.requestSequence}
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
                          {participationResultLabel[participation.resultStatus]}
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
