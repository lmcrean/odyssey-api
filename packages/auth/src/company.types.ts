export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  plan: SubscriptionPlan;
  maxUsers: number;
}

export enum SubscriptionPlan {
  Free = 'Free',
  Starter = 'Starter',
  Professional = 'Professional',
  Enterprise = 'Enterprise'
}