import { apiClient } from "@/api/client";
import { unwrapApiData } from "@/api/response";
import type {
  MyParticipation,
  MyParticipationResponse,
  MyProfile,
  UpdateNicknameRequest,
  UpdatePasswordRequest,
} from "@/types/user";

export async function getMyProfile() {
  const response = await apiClient.get<MyProfile | { data: MyProfile }>("/me");

  return unwrapApiData<MyProfile>(response);
}

export async function updateNickname(request: UpdateNicknameRequest) {
  const response = await apiClient.patch<MyProfile | { data: MyProfile }>(
    "/me/nickname",
    request,
  );

  return unwrapApiData<MyProfile>(response);
}

export async function updatePassword(request: UpdatePasswordRequest) {
  await apiClient.patch("/me/password", request);
}

export async function getMyParticipations() {
  const response = await apiClient.get<
    MyParticipationResponse[] | { data: MyParticipationResponse[] }
  >("/me/participations");
  const participations = unwrapApiData<MyParticipationResponse[]>(response);

  return participations.map(mapParticipationResponse);
}

function mapParticipationResponse(
  participation: MyParticipationResponse,
): MyParticipation {
  return {
    eventId: participation.eventId,
    eventName: participation.eventName,
    productName: participation.productName,
    result: participation.resultStatus,
    participatedAt: participation.participatedAt,
    startAt: participation.startAt,
    endAt: participation.endAt,
    gifticonAvailable: participation.gifticonAvailable,
  };
}
