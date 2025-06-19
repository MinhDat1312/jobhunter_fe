export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: T[];
}

export interface IAccount {
    access_token: string;
    user: {
        userId: string;
        email: string;
        fullName: string;
        role: {
            roleId: string;
            name: string;
            permissions: {
                permissionId: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[];
        };
    };
}

export interface IGetAccount extends Omit<IAccount, 'access_token'> {}

export interface IUser {
    userId?: string;
    fullName: string;
    address?: string;
    contact: Contact;
    dob?: Date;
    gender?: string;
    password: string;
    username: string;

    role?: {
        roleId: string;
        name: string;
    };

    createdAt?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    updatedAt?: string;
}

export interface IRecruiter extends IUser {
    description?: string;
    logo?: string;
    website?: string;
}

export interface IApplicant extends IUser {
    availableStatus: boolean;
    education?: string;
    level?: string;
    resumeUrl?: string;
}

export interface ISkill {
    skillId?: string;
    name?: string;

    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
}

export interface IJob {
    jobId?: string;
    description: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
    level: string;
    quantity: number;
    salary: number;
    title: string;
    workingType?: string;
    location?: string;

    recruiter?: {
        userId: string;
        fullName: string;
        logo?: string;
        type?: string;
    };
    skills: ISkill[];

    createdAt?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    updatedAt?: string;
}

export interface IApplication {
    applicationId?: string;
    email: string;
    resumeUrl: string;
    status: string;

    user: string | { userId: string; fullName: string };
    recruiterName: string;
    job: string | { jobId: string; title: string };
    history?: {
        status: string;
        updatedAt: Date;
        updatedBy: { id: string; email: string };
    }[];

    createdAt?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    updatedAt?: string;
}

export interface IPermission {
    permissionId?: string;
    apiPath?: string;
    method?: string;
    module?: string;
    name?: string;

    createdAt?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    updatedAt?: string;
}

export interface IRole {
    roleId?: string;
    description: string;
    active: boolean;
    name: string;

    permissions: IPermission[] | string[];

    createdAt?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    updatedAt?: string;
}

export interface Contact {
    phone?: string;
    email?: string;
}

// export interface ISubscribers {
//     id?: string;
//     name?: string;
//     email?: string;
//     skills: string[];
//     createdBy?: string;
//     isDeleted?: boolean;
//     deletedAt?: boolean | null;
//     createdAt?: string;
//     updatedAt?: string;
// }
