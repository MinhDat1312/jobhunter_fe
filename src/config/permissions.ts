export const ALL_PERMISSIONS = {
    USERS: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/users', module: 'USERS' },
    },
    RECRUITERS: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/recruiters', module: 'RECRUITERS' },
        CREATE: { method: 'POST', apiPath: '/api/v1/recruiters', module: 'RECRUITERS' },
        UPDATE: { method: 'PUT', apiPath: '/api/v1/recruiters', module: 'RECRUITERS' },
        DELETE: { method: 'DELETE', apiPath: '/api/v1/recruiters/{id}', module: 'RECRUITERS' },
    },
    JOBS: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/jobs', module: 'JOBS' },
        CREATE: { method: 'POST', apiPath: '/api/v1/jobs', module: 'JOBS' },
        UPDATE: { method: 'PUT', apiPath: '/api/v1/jobs', module: 'JOBS' },
        DELETE: { method: 'DELETE', apiPath: '/api/v1/jobs/{id}', module: 'JOBS' },
    },
    SKILLS: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/skills', module: 'SKILLS' },
        CREATE: { method: 'POST', apiPath: '/api/v1/skills', module: 'SKILLS' },
        UPDATE: { method: 'PUT', apiPath: '/api/v1/skills', module: 'SKILLS' },
        DELETE: { method: 'DELETE', apiPath: '/api/v1/skills/{id}', module: 'SKILLS' },
    },
    PERMISSIONS: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/permissions', module: 'PERMISSIONS' },
        CREATE: { method: 'POST', apiPath: '/api/v1/permissions', module: 'PERMISSIONS' },
        UPDATE: { method: 'PUT', apiPath: '/api/v1/permissions', module: 'PERMISSIONS' },
        DELETE: { method: 'DELETE', apiPath: '/api/v1/permissions/{id}', module: 'PERMISSIONS' },
    },
    APPLICATIONS: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/applications', module: 'APPLICATIONS' },
        CREATE: { method: 'POST', apiPath: '/api/v1/applications', module: 'APPLICATIONS' },
        UPDATE: { method: 'PUT', apiPath: '/api/v1/applications', module: 'APPLICATIONS' },
        DELETE: { method: 'DELETE', apiPath: '/api/v1/applications/{id}', module: 'APPLICATIONS' },
    },
    ROLES: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/roles', module: 'ROLES' },
        CREATE: { method: 'POST', apiPath: '/api/v1/roles', module: 'ROLES' },
        UPDATE: { method: 'PUT', apiPath: '/api/v1/roles', module: 'ROLES' },
        DELETE: { method: 'DELETE', apiPath: '/api/v1/roles/{id}', module: 'ROLES' },
    },
    APPLICANTS: {
        GET_PAGINATE: { method: 'GET', apiPath: '/api/v1/applicants', module: 'APPLICANTS' },
        CREATE: { method: 'POST', apiPath: '/api/v1/applicants', module: 'APPLICANTS' },
        UPDATE: { method: 'PUT', apiPath: '/api/v1/applicants', module: 'APPLICANTS' },
        DELETE: { method: 'DELETE', apiPath: '/api/v1/applicants/{id}', module: 'APPLICANTS' },
    },
};

export const ALL_MODULES = {
    RECRUITERS: 'RECRUITERS',
    FILES: 'FILES',
    JOBS: 'JOBS',
    PERMISSIONS: 'PERMISSIONS',
    APPLICATIONS: 'APPLICATIONS',
    ROLES: 'ROLES',
    APPLICANTS: 'APPLICANTS',
    USERS: 'USERS',
};
