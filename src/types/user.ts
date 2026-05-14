import type { ParticipationResult } from "@/types/event";

export interface MyProfile {
  id: number;
  email: string;
  nickname: string;
}

export interface MyParticipation {
  eventId: number;
  eventName: string;
  productName: string;
  result: ParticipationResult;
  participatedAt: string;
  startAt: string;
  endAt: string;
  gifticonAvailable: boolean;
}

export interface MyParticipationResponse {
  eventId: number;
  eventName: string;
  productName: string;
  resultStatus: ParticipationResult;
  participatedAt: string;
  startAt: string;
  endAt: string;
  gifticonAvailable: boolean;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
