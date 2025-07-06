import { Form, Modal, type UploadFile } from 'antd';
import '../../../styles/reset.scss';
import { isMobile } from 'react-device-detect';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { callUploadSingleFile } from '../../../config/api';
import type { IRecruiter } from '../../../types/backend';
import useUploadFile from '../../../hooks/useUploadFile';
import RecruiterForm from '../../client/form/recruiter.form';
import styles from '../../../styles/admin.module.scss';
import { useTranslation } from 'react-i18next';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit: IRecruiter | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalRecruiter = (props: IProps) => {
    const { t } = useTranslation();
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
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
    } = useUploadFile((file) => callUploadSingleFile(file, 'recruiters'));

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
                                    ? t('button.update') + ' ' + t('recruiter').toLowerCase()
                                    : t('button.create') + ' ' + t('recruiter').toLowerCase()}
                            </>
                        }
                    >
                        <RecruiterForm
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
                            setVisibleUpload={setVisibleUpload}
                            setLoadingUpload={setLoadingUpload}
                            onRole={true}
                            reloadTable={reloadTable}
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

export default ModalRecruiter;
