import { apiClient } from '@/api/client';
import { unwrapApiData } from '@/api/response';
import type {
  AdminEventResult,
  AdminParticipation,
  CreateAdminEventRequest,
  UpdateAdminEventRequest,
  UploadGifticonImageRequest,
} from '@/types/admin';

export async function createAdminEvent(request: CreateAdminEventRequest) {
  const formData = new FormData();

  if (request.image) {
    formData.append('image', request.image);
  }

  formData.append('eventName', request.eventName);
  formData.append('productName', request.productName);
  formData.append('winnerLimit', String(request.winnerLimit));
  formData.append('startAt', request.startAt);
  formData.append('endAt', request.endAt);

  await apiClient.post('/admin/events', formData);
}

export async function updateAdminEvent(request: UpdateAdminEventRequest) {
  const formData = new FormData();

  if (request.image) {
    formData.append('image', request.image);
  }

  formData.append('eventName', request.eventName);
  formData.append('productName', request.productName);
  formData.append('winnerLimit', String(request.winnerLimit));
  formData.append('startAt', request.startAt);
  formData.append('endAt', request.endAt);

  await apiClient.put(`/admin/events/${request.eventId}`, formData);
}

export async function uploadGifticonImage(request: UploadGifticonImageRequest) {
  const formData = new FormData();

  formData.append('image', request.image);

  await apiClient.post(
    `/admin/participations/${request.participantId}/gifticon`,
    formData,
  );
}

export async function getAdminEventResults() {
  const response = await apiClient.get<
    | AdminEventResult[]
    | { data: AdminEventResult[] }
    | { events: AdminEventResult[] }
    | { results: AdminEventResult[] }
  >('/admin/events/results');
  const responseData = response.data;

  if (Array.isArray(responseData)) {
    return responseData;
  }

  if ('events' in responseData) {
    return responseData.events;
  }

  if ('results' in responseData) {
    return responseData.results;
  }

  if ('data' in responseData) {
    return responseData.data;
  }

  return [];
}

export async function getAdminParticipations(eventId: number) {
  const response = await apiClient.get<
    AdminParticipation[] | { data: AdminParticipation[] }
  >(`/admin/events/${eventId}/participations`);

  return unwrapApiData<AdminParticipation[]>(response);
}

export async function getAdminWinners(eventId: number) {
  const response = await apiClient.get<
    AdminParticipation[] | { data: AdminParticipation[] }
  >(`/admin/events/${eventId}/winners`);

  return unwrapApiData<AdminParticipation[]>(response);
}
