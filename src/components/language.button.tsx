import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

const LanguageButton = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const toggleLanguage = () => {
        const newLang = currentLang === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <Button onClick={toggleLanguage}>
            {currentLang === 'vi' ? 'EN' : 'VI'}
        </Button>
    );
};
export default LanguageButton;
