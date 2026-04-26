import { useQuery } from "@tanstack/react-query";

import { getEvents } from "@/api/events";

export const eventQueryKeys = {
  all: ["events"] as const,
  lists: () => [...eventQueryKeys.all, "list"] as const,
};

export function useEvents() {
  return useQuery({
    queryKey: eventQueryKeys.lists(),
    queryFn: getEvents,
    staleTime: 10 * 1000,
  });
}
