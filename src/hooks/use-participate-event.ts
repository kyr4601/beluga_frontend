import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AppApiError } from "@/api/errors";
import { participateEvent } from "@/api/events";
import { useToast } from "@/components/ui";
import { eventQueryKeys } from "@/hooks/use-events";
import type { ParticipationResult } from "@/types/event";

const participationResults: ParticipationResult[] = [
  "WIN",
  "LOSE",
  "DUPLICATE",
  "BEFORE_START",
  "ENDED",
  "INVALID_REQUEST",
  "NOT_FOUND",
  "SYSTEM_ERROR",
];

export function useParticipateEvent(eventId: number) {
  const queryClient = useQueryClient();
  const { showParticipationToast, showToast } = useToast();

  return useMutation({
    mutationKey: ["events", eventId, "participate"],
    mutationFn: () => participateEvent(eventId),
    onSuccess: (response) => {
      showParticipationToast(response.result);
    },
    onError: (error) => {
      if (
        error instanceof AppApiError &&
        isParticipationResult(error.code)
      ) {
        showParticipationToast(error.code);
        return;
      }

      showToast({
        message:
          error instanceof Error
            ? error.message
            : "이벤트 참여 요청에 실패했습니다.",
        tone: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.lists() });
    },
  });
}

function isParticipationResult(code: string): code is ParticipationResult {
  return participationResults.includes(code as ParticipationResult);
}
