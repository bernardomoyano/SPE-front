export interface StudentDto {
  id: number;
  userName: string;
  email: string;
  dateOfBirth: Date;
  gender: string;
  heightCm?: number;
  weightKg?: number;
  trainingLevel: string;
  phone: string;
  country: string;
  coachId?: number;
  coachName?: string;
}