import { Descriptions, Drawer } from 'antd';
import type { IPermission } from '../../../types/backend';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IPermission | null;
    setDataInit: (v: any) => void;
}

const ViewDetailPermission = (props: IProps) => {
    const { t } = useTranslation();
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title={t('information') + ' ' + t('permission').toLowerCase()}
                placement="right"
                onClose={() => {
                    onClose(false);
                    setDataInit(null);
                }}
                open={open}
                width={'40vw'}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label={t('name_permission')}>{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label={t('api')}>{dataInit?.apiPath}</Descriptions.Item>

                    <Descriptions.Item label={t('method')}>{dataInit?.method}</Descriptions.Item>
                    <Descriptions.Item label={t('module')}>{dataInit?.module}</Descriptions.Item>

                    <Descriptions.Item label={t('table.createdAt')}>
                        {dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('table.updatedAt')}>
                        {dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default ViewDetailPermission;
