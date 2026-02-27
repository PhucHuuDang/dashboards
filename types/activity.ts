export type ActivityType = "task" | "project" | "comment" | "system" | "status";

export type ActivityStatus = "created" | "updated" | "deleted" | "completed";

export interface ActivityUser {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
}

export interface ActivityEntity {
  name: string;
  href: string;
}

export interface ActivityComment {
  id: string;
  user: ActivityUser;
  content: string;
  timestamp: Date;
}

export interface ActivityPerformance {
  timeToComplete?: string; // e.g. "2h 15m"
  impactScore?: number; // 0-100
  linesOfCode?: number;
  rating?: "excellent" | "good" | "needs-improvement";
}

export interface Activity {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  user: ActivityUser;
  action: string;
  entity: ActivityEntity;
  timestamp: Date;
  description?: string;
  comments?: ActivityComment[];
  assignee?: ActivityUser;
  tags?: string[];
  performance?: ActivityPerformance;
}
