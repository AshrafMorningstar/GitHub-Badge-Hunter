export enum BadgeType {
  ACHIEVEMENT = 'Achievement',
  HIGHLIGHT = 'Highlight',
  RETIRED = 'Retired/Unreleased'
}

export interface BadgeTier {
  name: string;
  requirement: string;
  threshold?: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  howToEarn: string;
  type: BadgeType;
  tiers?: BadgeTier[];
  notes?: string;
}

export interface GuideStep {
  title: string;
  description: string;
}

export interface Guide {
  id: string;
  title: string;
  badgeId: string;
  steps: GuideStep[];
  tips: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface UserStats {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string;
  publicRepos: number;
  totalStars: number;
  maxStarCount: number;
  bestRepoName: string;
  mergedPRs: number;
  acceptedAnswers: number;
}