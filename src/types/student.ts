export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  parentContact: {
    fatherName?: string;
    fatherPhone?: string;
    fatherEmail?: string;
    motherName?: string;
    motherPhone?: string;
    motherEmail?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
  };
  academicInfo: {
    classId: string;
    className: string;
    level: string;
    section?: string;
    enrollmentDate: string;
    status: 'active' | 'inactive' | 'transferred' | 'graduated';
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    emergencyContact?: string;
    bloodType?: string;
    specialNeeds?: string;
  };
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  parentContact: {
    fatherName?: string;
    fatherPhone?: string;
    fatherEmail?: string;
    motherName?: string;
    motherPhone?: string;
    motherEmail?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
  };
  academicInfo: {
    classId: string;
    className: string;
    level: string;
    section?: string;
    enrollmentDate: string;
    status: 'active' | 'inactive' | 'transferred' | 'graduated';
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    emergencyContact?: string;
    bloodType?: string;
    specialNeeds?: string;
  };
}

export interface StudentLoginDto {
  email: string;
  password: string;
}

export interface StudentLoginResponse {
  success: boolean;
  user?: string;
  message?: string;
}

// export interface UpdateStudentDto extends Partial<CreateStudentDto> {}

export interface StudentListResponse {
  students: Student[];
  total: number;
  pages: number;
  currentPage: number;
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  byLevel: Record<string, number>;
  byGender: Record<string, number>;
}

export interface BulkImportResult {
  success: Student[];
  errors: {
    index: number;
    error: string;
    data: CreateStudentDto;
  }[];
} 