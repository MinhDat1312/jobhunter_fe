import { Card, Form, Modal, type UploadFile } from 'antd';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { useEffect, useState } from 'react';
import { ROLE_LIST } from '../../../config/utils';
import { callFetchUserByEmail, callUploadSingleFile } from '../../../config/api';
import type { IFullUser } from '../../../types/backend';
import '../../../styles/reset.scss';
import ApplicantForm from '../form/applicant.form';
import RecruiterForm from '../form/recruiter.form';
import useUploadFile from '../../../hooks/useUploadFile';
import { Grid } from 'antd';
import { motion } from 'motion/react';

const { useBreakpoint } = Grid;

const UpdateInfo = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const [user, setUser] = useState<IFullUser | null>(null);
    const typeUser = user?.role?.name;
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
        const init = async () => {
            const res = await callFetchUserByEmail();
            if (res?.data && res?.data.userId) {
                setUser(res.data);
            }
        };

        init();
    }, []);

    useEffect(() => {
        if (user?.avatar) {
            const file: UploadFile = {
                uid: '-1',
                name: user.fullName,
                status: 'done',
                url: user.avatar,
            };
            setFileList([file]);
        } else {
            setFileList([]);
        }
    }, [user, setFileList]);

    return (
        <Access permission={[ALL_PERMISSIONS.APPLICANTS.UPDATE, ALL_PERMISSIONS.RECRUITERS.UPDATE]}>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <Card
                    style={{
                        marginBlock: '32px',
                        marginRight: isMobile || isTablet ? '0px' : '100px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {typeUser === ROLE_LIST[2].value ? (
                        <ApplicantForm
                            form={form}
                            dataInit={user ?? null}
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
                            dataInit={user ?? null}
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
                </Card>
            </motion.div>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                style={{ zIndex: 1500 }}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Access>
    );
};

export default UpdateInfo;
