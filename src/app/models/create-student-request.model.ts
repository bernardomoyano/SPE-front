export interface CreateStudentRequest {
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  heightCm: number;
  weightKg: number;
  trainingLevel: string;
  phone: string;
  country: string;
  coachId: number;
}