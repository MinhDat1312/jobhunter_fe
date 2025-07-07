import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <Result
                status="404"
                title={t('page_error.result_404.title')}
                subTitle={t('page_error.result_404.subTitle')}
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        {t('home')}
                    </Button>
                }
            />
        </>
    );
};

export default NotFound;
