import { Col, Form, message, notification, Row } from 'antd';
import type { ICareer } from '../../../types/backend';
import { callCreateCareer, callUpdateCareer } from '../../../config/api';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICareer | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalCareer = (props: IProps) => {
    const { t } = useTranslation();
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    const submitCareer = async (valuesForm: any) => {
        const { name } = valuesForm;
        if (dataInit?.careerId) {
            const res = await callUpdateCareer(dataInit.careerId, name);
            if (res.data) {
                message.success('Cập nhật ngành nghề thành công');
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } else {
            const res = await callCreateCareer(name);
            if (res.data) {
                message.success('Thêm mới ngành nghề thành công');
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
                        {dataInit?.careerId
                            ? t('button.update') + ' ' + t('career').toLowerCase()
                            : t('button.create') + ' ' + t('career').toLowerCase()}
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
                    okText: <>{dataInit?.careerId ? t('button.update') : t('button.create')}</>,
                    cancelText: t('button.cancel'),
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitCareer}
                initialValues={dataInit?.careerId ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <ProFormText
                            label={t('name_career')}
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

export default ModalCareer;
