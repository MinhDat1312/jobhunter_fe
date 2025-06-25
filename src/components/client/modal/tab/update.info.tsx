import { ConfigProvider, Form, Modal, type UploadFile } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Access from '../../../share/access';
import { ALL_PERMISSIONS } from '../../../../config/permissions';
import { useEffect } from 'react';
import { ROLE_LIST } from '../../../../config/utils';
import { callUploadSingleFile } from '../../../../config/api';
import type { IFullUser } from '../../../../types/backend';
import '../../../../styles/reset.scss';
import ApplicantForm from '../../form/applicant.form';
import RecruiterForm from '../../form/recruiter.form';
import useUploadFile from '../../../../hooks/useUploadFile';

dayjs.locale('vi');

interface IProps {
    onClose?: (v: boolean) => void;
    dataInit: IFullUser | null;
}

const UpdateInfo = (props: IProps) => {
    const { onClose, dataInit } = props;
    const typeUser = dataInit?.role?.name;
    const [form] = Form.useForm();

    const {
        fileList,
        loadingUpload,
        previewImage,
        previewOpen,
        previewTitle,
        visibleUpload,
        setFileList,
        setPreviewOpen,
        handleRemoveFile,
        handlePreview,
        beforeUpload,
        handleChange,
        handleUploadFile,
    } = useUploadFile((file) =>
        callUploadSingleFile(file, typeUser === ROLE_LIST[2].value ? 'applicants' : 'recruiters'),
    );

    useEffect(() => {
        if (dataInit?.avatar) {
            const file: UploadFile = {
                uid: '-1',
                name: dataInit.fullName,
                status: 'done',
                url: dataInit.avatar,
            };
            setFileList([file]);
        } else {
            setFileList([]);
        }
    }, [dataInit]);

    return (
        <Access permission={[ALL_PERMISSIONS.APPLICANTS.UPDATE, ALL_PERMISSIONS.RECRUITERS.UPDATE]}>
            <ConfigProvider locale={viVN}>
                {typeUser === ROLE_LIST[2].value ? (
                    <ApplicantForm
                        form={form}
                        dataInit={dataInit}
                        onClose={onClose}
                        uploadFileLogo={handleUploadFile}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        removeFile={handleRemoveFile}
                        onPreview={handlePreview}
                        visibleUpload={visibleUpload}
                        loadingUpload={loadingUpload}
                        fileList={fileList}
                        onRole={false}
                    />
                ) : (
                    <RecruiterForm
                        form={form}
                        dataInit={dataInit}
                        onClose={onClose}
                        uploadFileLogo={handleUploadFile}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        removeFile={handleRemoveFile}
                        onPreview={handlePreview}
                        visibleUpload={visibleUpload}
                        loadingUpload={loadingUpload}
                        fileList={fileList}
                        onRole={false}
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
