import { apiClient } from "@/api/client";
import { unwrapApiData } from "@/api/response";
import type {
  EventListResponse,
  GifticonEvent,
  GifticonEventResponse,
  ParticipationResultApiResponse,
  ParticipationResultResponse,
} from "@/types/event";

export async function getEvents() {
  const response = await apiClient.get<
    EventListResponse | { data: EventListResponse }
  >("/events");
  const eventList = unwrapApiData<EventListResponse>(response);

  return [
    ...(eventList.activeEvents ?? []),
    ...(eventList.scheduledEvents ?? []),
    ...(eventList.endedEvents ?? []),
  ].map(mapEventResponse);
}

export async function participateEvent(eventId: number) {
  const response = await apiClient.post<
    ParticipationResultApiResponse | { data: ParticipationResultApiResponse }
  >(`/events/${eventId}/participate`);
  const result = unwrapApiData<ParticipationResultApiResponse>(response);

  return mapParticipationResponse(eventId, result);
}

function mapEventResponse(event: GifticonEventResponse): GifticonEvent {
  return {
    id: event.eventId,
    title: event.eventName,
    productName: event.productName,
    winnerLimit: event.winnerLimit,
    winnerCount: event.winnerCount,
    participantCount: event.participantCount,
    startAt: event.startAt,
    endAt: event.endAt,
    status: event.status,
  };
}

function mapParticipationResponse(
  eventId: number,
  response: ParticipationResultApiResponse,
): ParticipationResultResponse {
  const result = response.resultStatus ?? response.result ?? response.status;

  if (!result) {
    return {
      eventId,
      result: "SYSTEM_ERROR",
      message: response.message ?? "참여 결과를 확인하지 못했습니다.",
    };
  }

  return {
    eventId: response.eventId ?? eventId,
    userId: response.userId,
    result,
    existingResult: response.existingResultStatus,
    requestSequence: response.requestSequence,
    participatedAt: response.participatedAt,
    requestId: response.requestId,
    message: response.message ?? "",
  };
}
