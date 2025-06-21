import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface IProps {
    onClose?: (v: boolean) => void;
}

const NotPermitted = (props: IProps) => {
    const { onClose } = props;
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền hạn truy cập thông tin này."
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
                    Back Home
                </Button>
            }
        />
    );
};

export default NotPermitted;
