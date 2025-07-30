import { message, type UploadFile } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useUploadFile = (uploadFile: (file: File) => Promise<any>) => {
    const { t } = useTranslation();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [visibleUpload, setVisibleUpload] = useState(true);

    const handleRemoveFile = (_file: any) => {
        setFileList([]);
        setVisibleUpload(true);
        setLoadingUpload(false);
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
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setVisibleUpload(true);
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setVisibleUpload(false);
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setVisibleUpload(true);
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? t('notify.error'));
        }
    };

    const handleUploadFile = async ({ file, onSuccess, onError }: any) => {
        const res = await uploadFile(file);
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

    return {
        fileList,
        loadingUpload,
        previewImage,
        previewOpen,
        previewTitle,
        visibleUpload,
        setFileList,
        setLoadingUpload,
        setPreviewImage,
        setPreviewOpen,
        setPreviewTitle,
        setVisibleUpload,
        handleRemoveFile,
        handlePreview,
        beforeUpload,
        handleChange,
        handleUploadFile,
    };
};

export default useUploadFile;
