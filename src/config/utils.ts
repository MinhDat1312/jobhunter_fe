import { grey, green, blue, red, orange } from '@ant-design/colors';
import type { IPermission, ISelect } from '../types/backend';
import { groupBy, map } from 'lodash';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { callFetchRole } from './api';
import type { TFunction } from 'i18next';

export const ROLE_LIST = [
    { label: 'Admin', value: 'SUPER_ADMIN' },
    { label: 'HR', value: 'HR' },
    { label: 'Ứng viên', value: 'APPLICANT' },
];

export const LOCATION_LIST = [
    { label: 'Hà Nội', value: 'Hà Nội' },
    { label: 'Hải Phòng', value: 'Hải Phòng' },
    { label: 'Huế', value: 'Huế' },
    { label: 'Đà Nẵng', value: 'Đà Nẵng' },
    { label: 'Cần Thơ', value: 'Cần Thơ' },
    { label: 'Hồ Chí Minh', value: 'Hồ Chí Minh' },
    { label: 'Lai Châu', value: 'Lai Châu' },
    { label: 'Điện Biên', value: 'Điện Biên' },
    { label: 'Sơn La', value: 'Sơn La' },
    { label: 'Lạng Sơn', value: 'Lạng Sơn' },
    { label: 'Cao Bằng', value: 'Cao Bằng' },
    { label: 'Tuyên Quang', value: 'Tuyên Quang' },
    { label: 'Lào Cai', value: 'Lào Cai' },
    { label: 'Thái Nguyên', value: 'Thái Nguyên' },
    { label: 'Phú Thọ', value: 'Phú Thọ' },
    { label: 'Bắc Ninh', value: 'Bắc Ninh' },
    { label: 'Hưng Yên', value: 'Hưng Yên' },
    { label: 'Ninh Bình', value: 'Ninh Bình' },
    { label: 'Quảng Ninh', value: 'Quảng Ninh' },
    { label: 'Thanh Hóa', value: 'Thanh Hóa' },
    { label: 'Nghệ An', value: 'Nghệ An' },
    { label: 'Hà Tĩnh', value: 'Hà Tĩnh' },
    { label: 'Quảng Trị', value: 'Quảng Trị' },
    { label: 'Quảng Ngãi', value: 'Quảng Ngãi' },
    { label: 'Gia Lai', value: 'Gia Lai' },
    { label: 'Khánh Hòa', value: 'Khánh Hòa' },
    { label: 'Lâm Đồng', value: 'Lâm Đồng' },
    { label: 'Đắk Lắk', value: 'Đắk Lắk' },
    { label: 'Đồng Nai', value: 'Đồng Nai' },
    { label: 'Tây Ninh', value: 'Tây Ninh' },
    { label: 'Vĩnh Long', value: 'Vĩnh Long' },
    { label: 'Đồng Tháp', value: 'Đồng Tháp' },
    { label: 'Cà Mau', value: 'Cà Mau' },
    { label: 'An Giang', value: 'An Giang' },
];

export const EDUCATION_LIST = [
    { label: 'Cao đẳng', value: 'COLLEGE' },
    { label: 'Đại học', value: 'UNIVERSITY' },
    { label: 'THPT', value: 'SCHOOL' },
    { label: 'Kỹ sư', value: 'ENGINEER' },
];

export const LEVEL_LIST = [
    { label: 'Fresher', value: 'FRESHER' },
    { label: 'Junior', value: 'JUNIOR' },
    { label: 'Senior', value: 'SENIOR' },
    { label: 'Intern', value: 'INTERN' },
    { label: 'Middle', value: 'MIDDLE' },
];

export const nonAccentVietnamese = (str: string) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/đ/g, 'd');

    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư

    return str;
};

export const convertSlug = (str: string) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();

    const from =
        'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to =
        'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    return str;
};

export const getLocationName = (value?: string) => {
    const locationFilter = LOCATION_LIST.filter((item) => item.value === value);
    if (locationFilter.length) return locationFilter[0].label;
    return 'unknown';
};

export const getLocationValue = (label?: string) => {
    const locationFilter = LOCATION_LIST.filter((item) => item.label === label);
    if (locationFilter.length) return locationFilter[0].value;
    return 'UNKNOWN';
};

export function colorMethod(method: 'POST' | 'PUT' | 'GET' | 'DELETE' | string) {
    switch (method) {
        case 'POST':
            return green[6];
        case 'PUT':
            return orange[6];
        case 'GET':
            return blue[6];
        case 'DELETE':
            return red[6];
        default:
            return grey[10];
    }
}

export function colorStatus(
    status: 'ACCEPTED' | 'PENDING' | 'REJECTED' | string,
    t?: TFunction<'translation', undefined>,
) {
    switch (status) {
        case 'ACCEPTED':
            return { color: green[6], label: t ? t('status_application.accepted') : 'Accepted' };
        case 'PENDING':
            return { color: orange[6], label: t ? t('status_application.pending') : 'Pending' };
        case 'REJECTED':
            return { color: red[6], label: t ? t('status_application.rejected') : 'Rejected' };
        default:
            return { color: grey[6], label: t ? t('status_application.error') : 'Error' };
    }
}

export const groupByPermission = (data: any[]): { module: string; permissions: IPermission[] }[] => {
    const groupedData = groupBy(data, (x) => x.module);
    return map(groupedData, (value, key) => {
        return { module: key, permissions: value as IPermission[] };
    });
};

export const getRoleName = (value?: string) => {
    const roleFilter = ROLE_LIST.filter((x) => x.value === value);
    if (roleFilter.length) return roleFilter[0].label;
    return 'unknown';
};

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export async function fetchRoleList(name: string): Promise<ISelect[]> {
    const q: any = {
        page: 1,
        size: 100,
        filter: '',
    };
    q.filter = `${sfLike('name', name)}`;
    if (!q.filter) delete q.filter;
    let temp = queryString.stringify(q);

    const res = await callFetchRole(temp);
    if (res && res.data) {
        const list = res.data.result;
        const temp = list.map((item) => {
            return {
                label: getRoleName(item.name),
                value: item.roleId as string,
            };
        });
        return temp;
    } else return [];
}
