export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  companyId: string;
  company: Company;
  role: UserRole;
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  CompanyAdmin = 'CompanyAdmin', 
  Manager = 'Manager',
  Member = 'Member'
}

export interface RefreshToken {
  id: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  isRevoked: boolean;
  revokedReason?: string;
  userId: string;
}

import { Company } from './company.types';