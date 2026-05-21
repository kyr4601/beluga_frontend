import type { EventStatus } from "@/types/event";

export interface CreateAdminEventRequest {
  image: File | null;
  eventName: string;
  productName: string;
  winnerLimit: number;
  startAt: string;
  endAt: string;
}

export interface UpdateAdminEventRequest extends CreateAdminEventRequest {
  eventId: number;
}

export interface UploadGifticonImageRequest {
  participantId: number;
  image: File;
}

export interface AdminEventResult {
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

export interface AdminParticipation {
  participantId: number;
  eventId: number;
  userId: number;
  nickname: string;
  email: string;
  requestSequence: number;
  resultStatus: "WIN" | "LOSE";
  participatedAt: string;
}
