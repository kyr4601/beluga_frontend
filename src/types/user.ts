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
  gifticonImageUrl?: string;
}

export interface MyParticipationResponse {
  eventId: number;
  eventName?: string;
  title?: string;
  productName: string;
  result?: ParticipationResult;
  status?: ParticipationResult;
  participatedAt?: string;
  createdAt?: string;
  gifticonImageUrl?: string;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
