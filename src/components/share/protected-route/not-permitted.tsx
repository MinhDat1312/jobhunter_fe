import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface IProps {
    onClose?: (v: boolean) => void;
}

const NotPermitted = (props: IProps) => {
    const { onClose } = props;
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Result
            status="403"
            title={t('page_error.result.title')}
            subTitle={t('page_error.result.subTitle')}
            extra={
                <Button
                    type="primary"
                    onClick={() => {
                        if (onClose) {
                            onClose(false);
                        }
                        navigate('/');
                    }}
                >
                    {t('home')}
                </Button>
            }
        />
    );
};

export default NotPermitted;
