export interface User {
  id: string;
  email: string;
  fullName: string;
  totalPoints?: number;
  level?: string;
  badges?: any[];
}