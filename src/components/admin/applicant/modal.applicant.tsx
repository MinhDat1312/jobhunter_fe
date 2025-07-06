import type { IApplicant } from '../../../types/backend';
import { Form, Modal, type UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { callUploadSingleFile } from '../../../config/api';
import ApplicantForm from '../../client/form/applicant.form';
import useUploadFile from '../../../hooks/useUploadFile';
import styles from '../../../styles/admin.module.scss';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit: IApplicant | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalApplicant = (props: IProps) => {
    const { t, i18n } = useTranslation();
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
        setLoadingUpload,
        handleRemoveFile,
        handlePreview,
        beforeUpload,
        handleChange,
        handleUploadFile,
    } = useUploadFile((file) => callUploadSingleFile(file, 'applicants'));

    useEffect(() => {
        dayjs.locale(i18n.language);
    }, [i18n.language]);

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
                <>
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
                        title={
                            <>
                                {dataInit?.userId
                                    ? t('button.update') + ' ' + t('applicant').toLowerCase()
                                    : t('button.create') + ' ' + t('applicant').toLowerCase()}
                            </>
                        }
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
                            setLoadingUpload={setLoadingUpload}
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
                </>
            )}
        </>
    );
};

export default ModalApplicant;
