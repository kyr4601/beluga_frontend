export type EventStatus = "ACTIVE" | "SCHEDULED" | "ENDED";

export type ParticipationResult =
  | "WIN"
  | "LOSE"
  | "DUPLICATE"
  | "BEFORE_START"
  | "ENDED"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "SYSTEM_ERROR";

export interface GifticonEvent {
  id: number;
  title: string;
  productName: string;
  winnerLimit: number;
  winnerCount: number;
  participantCount: number;
  startAt: string;
  endAt: string;
  status: EventStatus;
}

export interface GifticonEventResponse {
  eventId: number;
  eventName: string;
  productName: string;
  winnerLimit: number;
  winnerCount: number;
  participantCount: number;
  startAt: string;
  endAt: string;
  status: EventStatus;
}

export interface EventListResponse {
  activeEvents: GifticonEventResponse[];
  scheduledEvents: GifticonEventResponse[];
  endedEvents?: GifticonEventResponse[];
}

export interface ParticipationResultResponse {
  eventId: number;
  result: ParticipationResult;
  message: string;
  gifticonImageUrl?: string;
}

export interface ParticipationResultApiResponse {
  eventId?: number;
  result?: ParticipationResult;
  status?: ParticipationResult;
  message?: string;
  gifticonImageUrl?: string;
}
