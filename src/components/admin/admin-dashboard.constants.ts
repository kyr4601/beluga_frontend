import type { AdminParticipation } from "@/types/admin";
import type { EventStatus } from "@/types/event";

import type { EventFormState } from "./admin-dashboard.types";

export const participationResultLabel: Record<
  AdminParticipation["result"],
  string
> = {
  WIN: "당첨",
  LOSE: "미당첨",
};

export const eventStatusLabel: Record<EventStatus, string> = {
  SCHEDULED: "예정",
  ACTIVE: "진행중",
  ENDED: "완료",
};

export const eventStatusFilters: EventStatus[] = [
  "SCHEDULED",
  "ACTIVE",
  "ENDED",
];

export const initialEventForm: EventFormState = {
  image: null,
  eventName: "",
  productName: "",
  winnerLimit: 1,
  startAt: "",
  endAt: "",
};
