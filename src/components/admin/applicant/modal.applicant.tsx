import type { IApplicant } from '../../../types/backend';
import { ConfigProvider, Form, Modal, type UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { callUploadSingleFile } from '../../../config/api';
import viVN from 'antd/es/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import ApplicantForm from '../../client/form/applicant.form';
import useUploadFile from '../../../hooks/useUploadFile';
import styles from '../../../styles/admin.module.scss';

dayjs.locale('vi');

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit: IApplicant | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalApplicant = (props: IProps) => {
    const { openModal, setOpenModal, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();
    const [animation, setAnimation] = useState<string>('open');

    const {
        fileList,
        loadingUpload,
        previewImage,
        previewOpen,
        previewTitle,
        visibleUpload,
        setVisibleUpload,
        setFileList,
        setPreviewOpen,
        handleRemoveFile,
        handlePreview,
        beforeUpload,
        handleChange,
        handleUploadFile,
    } = useUploadFile((file) => callUploadSingleFile(file, 'applicants'));

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

    const handleReset = async () => {
        setDataInit(null);

        setAnimation('close');
        await new Promise((r) => setTimeout(r, 400));
        setOpenModal(false);
        setAnimation('open');
    };

    return (
        <>
            {openModal && (
                <ConfigProvider locale={viVN}>
                    <Modal
                        open={openModal}
                        onCancel={() => handleReset()}
                        afterClose={() => handleReset()}
                        destroyOnHidden={true}
                        width={isMobile ? '100%' : 900}
                        footer={null}
                        keyboard={false}
                        maskClosable={false}
                        className={`${styles.modalUser} ${styles[animation]}`}
                        title={<>{dataInit?.userId ? 'Cập nhật ứng viên' : 'Tạo mới ứng viên'}</>}
                    >
                        <ApplicantForm
                            form={form}
                            dataInit={dataInit}
                            setDataInit={setDataInit}
                            onClose={setOpenModal}
                            uploadFileLogo={handleUploadFile}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            removeFile={handleRemoveFile}
                            onPreview={handlePreview}
                            visibleUpload={visibleUpload}
                            loadingUpload={loadingUpload}
                            fileList={fileList}
                            setFileList={setFileList}
                            onRole={true}
                            reloadTable={reloadTable}
                            setVisibleUpload={setVisibleUpload}
                        />
                    </Modal>
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
            )}
        </>
    );
};

export default ModalApplicant;
