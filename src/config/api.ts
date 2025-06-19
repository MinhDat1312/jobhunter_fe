import dayjs from 'dayjs';
import type {
    Contact,
    IAccount,
    IApplicant,
    IApplication,
    IBackendRes,
    ICareer,
    IGetAccount,
    IJob,
    IModelPaginate,
    IPermission,
    IRecruiter,
    IRole,
    ISkill,
    IUser,
} from '../types/backend';
import axios from './axios-customize';

/***
Module Auth
***/
export const callRegister = (
    fullName: string,
    contact: Contact,
    address: string,
    password: string,
    username: string,
    type: string,
    dob?: Date,
    gender?: string,
) => {
    if (type === 'recruiter') {
        return axios.post<IBackendRes<IRecruiter>>('/api/v1/auth/register/recruiter', {
            fullName,
            contact,
            address,
            password,
            username,
            type,
        });
    } else if (type === 'applicant') {
        return axios.post<IBackendRes<IRecruiter>>('/api/v1/auth/register/applicant', {
            fullName,
            contact,
            address,
            password,
            username,
            type,
            dob: dob ? dayjs(dob).format('YYYY-MM-DD') : undefined,
            gender,
        });
    }
};

export const callLogin = (email: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { email, password });
};

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account');
};

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh');
};

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout');
};

/***
Module User
***/
export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
};

/***
Module Recruiter
***/
export const callCreateRecruiter = (
    fullName: string,
    password: string,
    username: string,
    contact: Contact,
    address: string,
    description?: string,
    logo?: string,
    role?: { roleId: string; name: string },
    website?: string,
) => {
    return axios.post<IBackendRes<IRecruiter>>('/api/v1/recruiters', {
        fullName,
        password,
        username,
        contact,
        address,
        description,
        logo,
        role,
        website,
        type: 'recruiter',
    });
};

export const callUpdateRecruiter = (
    recruiterId: string,
    fullName: string,
    password: string,
    username: string,
    contact: Contact,
    address: string,
    description?: string,
    logo?: string,
    role?: { roleId: string; name: string },
    website?: string,
) => {
    return axios.put<IBackendRes<IRecruiter>>(`/api/v1/recruiters`, {
        userId: recruiterId,
        fullName,
        password,
        username,
        contact,
        address,
        description,
        logo,
        role,
        website,
        type: 'recruiter',
    });
};

export const callDeleteRecruiter = (recruiterId: string) => {
    return axios.delete<IBackendRes<IRecruiter>>(`/api/v1/recruiters/${recruiterId}`);
};

export const callFetchRecruiter = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRecruiter>>>(`/api/v1/recruiters?${query}`);
};

export const callFetchRecruiterById = (recruiterId: string) => {
    return axios.get<IBackendRes<IRecruiter>>(`/api/v1/recruiters/${recruiterId}`);
};

/***
Module Applicant
***/
export const callCreateApplicant = (
    fullName: string,
    address: string,
    contact: Contact,
    dob: Date,
    gender: string,
    password: string,
    username: string,
    availableStatus: boolean,
    education?: string,
    level?: string,
    role?: { roleId: string; name: string },
    resumeUrl?: string,
) => {
    return axios.post<IBackendRes<IApplicant>>('/api/v1/applicants', {
        fullName,
        address,
        contact,
        dob: dob ? dayjs(dob).format('YYYY-MM-DD') : undefined,
        gender,
        password,
        username,
        availableStatus,
        education,
        level,
        role,
        resumeUrl,
        type: 'applicant',
    });
};

export const callUpdateApplicant = (
    applicantId: string,
    fullName: string,
    address: string,
    contact: Contact,
    dob: Date,
    gender: string,
    password: string,
    username: string,
    availableStatus: boolean,
    education?: string,
    level?: string,
    role?: { roleId: string; name: string },
    resumeUrl?: string,
) => {
    return axios.put<IBackendRes<IApplicant>>(`/api/v1/applicants`, {
        userId: applicantId,
        fullName,
        address,
        contact,
        dob: dob ? dayjs(dob).format('YYYY-MM-DD') : undefined,
        gender,
        password,
        username,
        availableStatus,
        education,
        level,
        role,
        resumeUrl,
        type: 'applicant',
    });
};

export const callDeleteApplicant = (applicantId: string) => {
    return axios.delete<IBackendRes<IApplicant>>(`/api/v1/applicants/${applicantId}`);
};

export const callFetchApplicant = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IApplicant>>>(`/api/v1/applicants?${query}`);
};

export const callFetchApplicantById = (applicantId: string) => {
    return axios.get<IBackendRes<IApplicant>>(`/api/v1/applicants/${applicantId}`);
};

/***
Module Skill
***/
export const callCreateSkill = (name: string) => {
    return axios.post<IBackendRes<ISkill>>('/api/v1/skills', { name });
};

export const callUpdateSkill = (skillId: string, name: string) => {
    return axios.put<IBackendRes<ISkill>>(`/api/v1/skills`, { skillId, name });
};

export const callDeleteSkill = (skillId: string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${skillId}`);
};

export const callFetchAllSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
};

/***
Module Career
***/
export const callCreateCareer = (name: string) => {
    return axios.post<IBackendRes<ICareer>>('/api/v1/careers', { name });
};

export const callUpdateCareer = (careerId: string, name: string) => {
    return axios.put<IBackendRes<ICareer>>(`/api/v1/careers`, { careerId, name });
};

export const callDeleteCareer = (careerId: string) => {
    return axios.delete<IBackendRes<ICareer>>(`/api/v1/careers/${careerId}`);
};

export const callFetchAllCareer = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICareer>>>(`/api/v1/careers?${query}`);
};

/***
Module Job
***/
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>('/api/v1/jobs', { ...job });
};

export const callUpdateJob = (job: IJob, jobId: string) => {
    return axios.put<IBackendRes<IJob>>(`/api/v1/jobs`, { jobId, ...job });
};

export const callDeleteJob = (jobId: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${jobId}`);
};

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
};

export const callFetchJobById = (jobId: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${jobId}`);
};

/***
Module Application
***/
export const callCreateApplication = (resumeUrl: string, email: string, jobId: any, userId: string | number) => {
    return axios.post<IBackendRes<IApplication>>('/api/v1/applications', {
        email,
        resumeUrl,
        status: 'PENDING',
        applicant: {
            userId,
            type: 'applicant',
        },
        job: {
            jobId,
        },
    });
};

export const callUpdateApplicationStatus = (applicationId: any, status: string) => {
    return axios.put<IBackendRes<IApplication>>(`/api/v1/applications`, { applicationId, status });
};

export const callDeleteApplication = (applicationId: string) => {
    return axios.delete<IBackendRes<IApplication>>(`/api/v1/applications/${applicationId}`);
};

export const callFetchApplication = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IApplication>>>(`/api/v1/applications?${query}`);
};

export const callFetchApplicationById = (applicationId: string) => {
    return axios.get<IBackendRes<IApplication>>(`/api/v1/applications/${applicationId}`);
};

export const callFetchApplicationByApplicant = () => {
    return axios.get<IBackendRes<IModelPaginate<IApplication>>>(`/api/v1/applications/by-applicant`);
};

/***
Module Permission
***/
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission });
};

export const callUpdatePermission = (permission: IPermission, permissionId: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { permissionId, ...permission });
};

export const callDeletePermission = (permissionId: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${permissionId}`);
};

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
};

export const callFetchPermissionById = (permissionId: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${permissionId}`);
};

/***
Module Role
***/
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role });
};

export const callUpdateRole = (role: IRole, roleId: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { roleId, ...role });
};

export const callDeleteRole = (roleId: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${roleId}`);
};

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
};

export const callFetchRoleById = (roleId: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${roleId}`);
};

/***
Upload single file
***/
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
