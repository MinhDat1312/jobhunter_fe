import { Col, Form, message, notification, Row } from 'antd';
import type { ISkill } from '../../../types/backend';
import { callCreateSkill, callUpdateSkill } from '../../../config/api';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ISkill | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalSkill = (props: IProps) => {
    const { t } = useTranslation();
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    const submitSkill = async (valuesForm: any) => {
        const { name } = valuesForm;
        if (dataInit?.skillId) {
            const res = await callUpdateSkill(dataInit.skillId, name);
            if (res.data) {
                message.success('Cập nhật kỹ năng thành công');
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } else {
            const res = await callCreateSkill(name);
            if (res.data) {
                message.success('Thêm mới kỹ năng thành công');
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        }
    };

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    return (
        <>
            <ModalForm
                title={
                    <>
                        {dataInit?.skillId
                            ? t('button.update') + ' ' + t('skill').toLowerCase()
                            : t('button.create') + ' ' + t('skill').toLowerCase()}
                    </>
                }
                open={openModal}
                modalProps={{
                    onCancel: () => {
                        handleReset();
                    },
                    afterClose: () => handleReset(),
                    destroyOnHidden: true,
                    width: isMobile ? '100%' : 600,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.skillId ? t('button.update') : t('button.create')}</>,
                    cancelText: t('button.cancel'),
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitSkill}
                initialValues={dataInit?.skillId ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <ProFormText
                            label={t('name_skill')}
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder={t('placeholder')}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    );
};

export default ModalSkill;
