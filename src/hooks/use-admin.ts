import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAdminEvent,
  getAdminEventResults,
  getAdminParticipations,
  getAdminWinners,
} from "@/api/admin";

export const adminQueryKeys = {
  all: ["admin"] as const,
  eventResults: () => [...adminQueryKeys.all, "event-results"] as const,
  participations: (eventId: number) =>
    [...adminQueryKeys.all, "events", eventId, "participations"] as const,
  winners: (eventId: number) =>
    [...adminQueryKeys.all, "events", eventId, "winners"] as const,
};

export function useAdminEventResults() {
  return useQuery({
    queryKey: adminQueryKeys.eventResults(),
    queryFn: getAdminEventResults,
  });
}

export function useCreateAdminEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.eventResults(),
      });
    },
  });
}

export function useAdminParticipations(eventId: number | null) {
  return useQuery({
    queryKey: adminQueryKeys.participations(eventId ?? 0),
    queryFn: () => getAdminParticipations(eventId ?? 0),
    enabled: eventId !== null,
  });
}

export function useAdminWinners(eventId: number | null) {
  return useQuery({
    queryKey: adminQueryKeys.winners(eventId ?? 0),
    queryFn: () => getAdminWinners(eventId ?? 0),
    enabled: eventId !== null,
  });
}
