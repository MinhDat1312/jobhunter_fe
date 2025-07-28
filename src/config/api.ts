import dayjs from 'dayjs';
import type {
    Contact,
    IAccount,
    IApplicant,
    IApplication,
    IBackendRes,
    IBlog,
    ICareer,
    IFullUser,
    IGetAccount,
    IJob,
    IModelPaginate,
    IPermission,
    IRecruiter,
    IRole,
    ISkill,
    ISubscriber,
    IUser,
} from '../types/backend';
import axios from './axios-customize';

/***
Module Auth
***/
export const callRegister = (
    contact: Contact,
    password: string,
    type: string,
    username?: string,
    address?: string,
    fullName?: string,
) => {
    if (type === 'recruiter') {
        return axios.post<IBackendRes<IRecruiter>>('/api/v1/auth/register/recruiter', {
            contact,
            password,
            type,
            username,
            address,
            fullName,
        });
    } else if (type === 'applicant') {
        return axios.post<IBackendRes<IRecruiter>>('/api/v1/auth/register/applicant', {
            contact,
            password,
            type,
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

export const callFetchUserByEmail = () => {
    return axios.post<IBackendRes<IFullUser>>('/api/v1/users');
};

export const callUpdatePassword = (currentPassword: string, newPassword: string, rePassword: string) => {
    return axios.put<IBackendRes<IAccount>>('/api/v1/users/update-password', {
        currentPassword,
        newPassword,
        rePassword,
    });
};

export const callSaveJobs = (userId: number, savedJobs: { jobId: number }[]) => {
    return axios.put<IBackendRes<IUser>>('/api/v1/users/saved-jobs', {
        userId,
        savedJobs,
    });
};

export const callFollowRecruiters = (userId: number, followedRecruiters: { userId: number }[]) => {
    const payload = followedRecruiters.map((fr) => {
        return { userId: fr.userId, type: 'recruiter' };
    });
    return axios.put<IBackendRes<IUser>>('/api/v1/users/followed-recruiters', {
        userId,
        followedRecruiters: payload,
    });
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
    avatar?: string,
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
        role,
        website,
        avatar,
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
    avatar?: string,
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
        role,
        website,
        avatar,
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
    avatar?: string,
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
        avatar,
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
    avatar?: string,
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
        avatar,
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

export const callCountJobByRecruiter = () => {
    return axios.get<IBackendRes<any>>('/api/v1/jobs/recruiters');
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

export const callUpdateApplicationStatus = (applicationId: any, status: string, resumeUrl: string) => {
    return axios.put<IBackendRes<IApplication>>(`/api/v1/applications`, { applicationId, status, resumeUrl });
};

export const callDeleteApplication = (applicationId: string) => {
    return axios.delete<IBackendRes<IApplication>>(`/api/v1/applications/${applicationId}`);
};

export const callFetchApplicationById = (applicationId: string) => {
    return axios.get<IBackendRes<IApplication>>(`/api/v1/applications/${applicationId}`);
};

export const callFetchApplication = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IApplication>>>(`/api/v1/all-applications?${query}`);
};

export const callFetchApplicationByRecruiter = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IApplication>>>(`/api/v1/applications?${query}`);
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
Module Subscriber
***/
export const callCreateSubscriber = (subs: ISubscriber) => {
    return axios.post<IBackendRes<ISubscriber>>('/api/v1/subscribers', { ...subs });
};

export const callUpdateSubscriber = (subs: ISubscriber) => {
    return axios.put<IBackendRes<ISubscriber>>(`/api/v1/subscribers`, { ...subs });
};

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscriber>>(`/api/v1/subscribers/${id}`);
};

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscriber>>(`/api/v1/subscribers/${id}`);
};

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscriber>>>(`/api/v1/subscribers?${query}`);
};

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscriber>>('/api/v1/subscribers/skills');
};

/***
Module Dashboard
***/
export const callStatisticsUser = () => {
    return axios.get<IBackendRes<Record<string, number>>>('/api/v1/dashboard/users');
};

export const callStatisticsJob = (query: string) => {
    return axios.get<IBackendRes<Record<string, number>>>(`/api/v1/dashboard/jobs?${query}`);
};

export const callStatisticsApplication = (query: string) => {
    return axios.get<IBackendRes<Record<string, number>>>(`/api/v1/dashboard/applications?${query}`);
};

export const callStatisticsApplicationByYear = (year: number, query: string) => {
    return axios.get<IBackendRes<Record<number, number>>>(`/api/v1/dashboard/applications-year?year=${year}&${query}`);
};

/***
Module Blog
***/
export const callCreateBlog = (blog: IBlog) => {
    return axios.post<IBackendRes<IBlog>>('/api/v1/blogs', { ...blog });
};

export const callUpdateBlog = (blog: IBlog, blogId: string) => {
    return axios.put<IBackendRes<IBlog>>(`/api/v1/blogs`, { blogId, ...blog });
};

export const callDeleteBlog = (blogId: string) => {
    return axios.delete<IBackendRes<IBlog>>(`/api/v1/blogs/${blogId}`);
};

export const callFetchBlog = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IBlog>>>(`/api/v1/blogs?${query}`);
};

export const callFetchBlogById = (blogId: string) => {
    return axios.get<IBackendRes<IBlog>>(`/api/v1/blogs/${blogId}`);
};

export const callLikeBlogs = (blog: IBlog, liked: boolean) => {
    return axios.put<IBackendRes<IBlog>>(`/api/v1/blogs/liked-blogs`, { ...blog, liked });
};

/***
Upload single file
***/
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folderType);

    return axios<IBackendRes<{ publicId: string; url: string }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
