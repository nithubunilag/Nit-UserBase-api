export type FarmPayload = {
    name: string;
    city: string;
    state: string;
};

export enum UserGender {
    Male = 'male',
    female = 'female',
}

export enum UserRole {
    STUDENT = 'STUDENT',
    INTERN = 'INTERN',
    EMPLOYEE = 'EMPLOYEE',
    VOLUNTEER = 'VOLUNTEER',
}

export enum ActivityTimelineType {
    ROLE_CHANGE = 'Role Change',
    DEPARTMENT_CHANGE = 'Department Change',
}

export enum EducationalLevel {
    HighSchool = 'High School',
    BSc = 'B.Sc.',
    Masters = 'Masters',
    PhD = 'Ph.D.',
    Diploma = 'Diploma',
    AssociateDegree = 'Associate Degree',
    Others = 'Others',
}

export interface UserPayload {
    fullName: string;
    emailAddress: string;
    roleId: string;
    gender: UserGender;

    departmentId?: string;
    dateOfBirth?: Date;
    phoneNumber?: string;
    emergencyContact?: string;
    currentAddress?: string;
    permanentAddress?: string;
    linkedinProfile?: string;
    educationLevel?: EducationalLevel;
}