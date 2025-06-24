import { ConfigProvider, message, Modal } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Access from '../../../share/access';
import { ALL_PERMISSIONS } from '../../../../config/permissions';
import { useState } from 'react';
import { ROLE_LIST } from '../../../../config/utils';
import { callUploadSingleFile } from '../../../../config/api';
import type { IFullUser } from '../../../../types/backend';
import '../../../../styles/reset.scss';
import ApplicantForm from '../../form/applicant.form';
import RecruiterForm from '../../form/recruiter.form';

dayjs.locale('vi');

interface IProps {
    onClose?: (v: boolean) => void;
    dataInit: IFullUser | null;
}

const UpdateInfo = (props: IProps) => {
    const { onClose, dataInit } = props;
    const typeUser = dataInit?.role?.name;

    const [fileList, setFileList] = useState([
        ...(dataInit?.avatar
            ? [
                  {
                      uid: '-1',
                      name: dataInit.avatar,
                      status: 'done',
                      url: `${import.meta.env.VITE_BACKEND_URL}/storage/${
                          typeUser === ROLE_LIST[2].value ? 'applicants' : 'recruiters'
                      }/${dataInit.avatar}`,
                  },
              ]
            : []),
    ]);

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [visibleUpload, setVisibleUpload] = useState(true);

    const handleRemoveFile = (file: any) => {
        setFileList([]);
        setVisibleUpload(true);
    };

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
            setVisibleUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? 'Đã có lỗi xảy ra khi upload file.');
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, typeUser === ROLE_LIST[2].value ? 'applicants' : 'recruiters');
        if (res && res.data) {
            setFileList([
                {
                    uid: '-1',
                    name: res.data.url,
                    status: 'done',
                    url: `${res.data.url}`,
                },
            ]);
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) {
                setFileList([]);
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    return (
        <Access permission={[ALL_PERMISSIONS.APPLICANTS.UPDATE, ALL_PERMISSIONS.RECRUITERS.UPDATE]}>
            <ConfigProvider locale={viVN}>
                {typeUser === ROLE_LIST[2].value ? (
                    <ApplicantForm
                        dataInit={dataInit}
                        onClose={onClose}
                        uploadFileLogo={handleUploadFileLogo}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        removeFile={handleRemoveFile}
                        onPreview={handlePreview}
                        visibleUpload={visibleUpload}
                        loadingUpload={loadingUpload}
                        fileList={fileList}
                    />
                ) : (
                    <RecruiterForm
                        dataInit={dataInit}
                        onClose={onClose}
                        uploadFileLogo={handleUploadFileLogo}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        removeFile={handleRemoveFile}
                        onPreview={handlePreview}
                        visibleUpload={visibleUpload}
                        loadingUpload={loadingUpload}
                        fileList={fileList}
                    />
                )}
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                    style={{ zIndex: 1500 }}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </ConfigProvider>
        </Access>
    );
};

export default UpdateInfo;
