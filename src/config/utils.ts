import { grey, green, blue, red, orange } from '@ant-design/colors';
import type { IPermission } from '../types/backend';
import { groupBy, map } from 'lodash';

export const LOCATION_LIST = [
    { label: 'Hà Nội', value: 'HANOI' },
    { label: 'Hải Phòng', value: 'HAIPHONG' },
    { label: 'Huế', value: 'HUE' },
    { label: 'Đà Nẵng', value: 'DANANG' },
    { label: 'Cần Thơ', value: 'CANTHO' },
    { label: 'Hồ Chí Minh', value: 'HOCHIMINH' },
    { label: 'Lai Châu', value: 'LAICHAU' },
    { label: 'Điện Biên', value: 'DIENBIEN' },
    { label: 'Sơn La', value: 'SONLA' },
    { label: 'Lạng Sơn', value: 'LANGSON' },
    { label: 'Cao Bằng', value: 'CAOBANG' },
    { label: 'Tuyên Quang', value: 'TUYENQUANG' },
    { label: 'Lào Cai', value: 'LAOCAI' },
    { label: 'Thái Nguyên', value: 'THAINGUYEN' },
    { label: 'Phú Thọ', value: 'PHUTHO' },
    { label: 'Bắc Ninh', value: 'BACNINH' },
    { label: 'Hưng Yên', value: 'HUNGYEN' },
    { label: 'Ninh Bình', value: 'NINHBINH' },
    { label: 'Quảng Ninh', value: 'QUANGNINH' },
    { label: 'Thanh Hóa', value: 'THANHHOA' },
    { label: 'Nghệ An', value: 'NGHEAN' },
    { label: 'Hà Tĩnh', value: 'HATINH' },
    { label: 'Quảng Trị', value: 'QUANGTRI' },
    { label: 'Quảng Ngãi', value: 'QUANGNGAI' },
    { label: 'Gia Lai', value: 'GIALAI' },
    { label: 'Khánh Hòa', value: 'KHANHHOA' },
    { label: 'Lâm Đồng', value: 'LAMDONG' },
    { label: 'Đắk Lắk', value: 'DAKLAK' },
    { label: 'Đồng Nai', value: 'DONGNAI' },
    { label: 'Tây Ninh', value: 'TAYNINH' },
    { label: 'Vĩnh Long', value: 'VINHLONG' },
    { label: 'Đồng Tháp', value: 'DONGTHAP' },
    { label: 'Cà Mau', value: 'CAMAU' },
    { label: 'An Giang', value: 'ANGIANG' },
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

export function colorStatus(status: 'ACCEPTED' | 'PENDING' | 'REJECTED' | string) {
    switch (status) {
        case 'ACCEPTED':
            return { color: green[6], label: 'Chấp nhận' };
        case 'PENDING':
            return { color: orange[6], label: 'Đang xét' };
        case 'REJECTED':
            return { color: red[6], label: 'Từ chối' };
        default:
            return { color: grey[6], label: 'Có lỗi' };
    }
}

export const groupByPermission = (data: any[]): { module: string; permissions: IPermission[] }[] => {
    const groupedData = groupBy(data, (x) => x.module);
    return map(groupedData, (value, key) => {
        return { module: key, permissions: value as IPermission[] };
    });
};
