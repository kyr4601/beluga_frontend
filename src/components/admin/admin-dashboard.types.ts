import type { FormEvent } from "react";

import type { AdminEventResult, AdminParticipation } from "@/types/admin";
import type { EventStatus } from "@/types/event";

export type EventFormState = {
  image: File | null;
  eventName: string;
  productName: string;
  winnerLimit: number;
  startAt: string;
  endAt: string;
};

export type EventFormProps = {
  form: EventFormState;
  imageLabel?: string;
  imageRequired?: boolean;
  isLoading: boolean;
  onChange: (form: EventFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
};

export type EventResultListProps = {
  events: AdminEventResult[];
  isLoading: boolean;
  onEditEvent: (event: AdminEventResult) => void;
  onFilterChange: (status: EventStatus) => void;
  onSelectEvent: (eventId: number) => void;
  selectedEventId: number | null;
  statusFilter: EventStatus;
};

export type AdminEventResultCardProps = {
  event: AdminEventResult;
  isSelected: boolean;
  onEdit: () => void;
  onSelect: () => void;
};

export type ParticipationHistoryProps = {
  event: AdminEventResult | null;
  isFetching: boolean;
  onOpenGifticonModal: (participation: AdminParticipation) => void;
  participations: AdminParticipation[];
};
