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
  userId?: number;
  result: ParticipationResult;
  existingResult?: ParticipationResult;
  requestSequence?: number;
  participatedAt?: string;
  requestId?: string;
  message: string;
}

export interface ParticipationResultApiResponse {
  eventId?: number;
  userId?: number;
  resultStatus?: ParticipationResult;
  existingResultStatus?: ParticipationResult;
  requestSequence?: number;
  participatedAt?: string;
  requestId?: string;
  result?: ParticipationResult;
  status?: ParticipationResult;
  message?: string;
}
