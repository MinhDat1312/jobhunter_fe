import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hook';
import { Result } from 'antd';

interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: { method: string; apiPath: string; module: string };
}

const Access = (props: IProps) => {
    const { hideChildren = false, permission } = props;
    const [allow, setAllow] = useState<boolean>(true);
    const permissions = useAppSelector((state) => state.account.user.role.permissions);

    useEffect(() => {
        if (permissions?.length) {
            const check = permissions.find(
                (item) =>
                    item.apiPath === permission.apiPath &&
                    item.method === permission.method &&
                    item.module === permission.module,
            );
            if (check) {
                setAllow(true);
            } else setAllow(false);
        }
    }, [permissions]);

    return (
        <>
            {allow === true || import.meta.env.VITE_ACL_ENABLE === 'false' ? (
                <>{props.children}</>
            ) : (
                <>
                    {hideChildren === false ? (
                        <Result
                            status="403"
                            title="Truy cập bị từ chối"
                            subTitle="Xin lỗi, bạn không có quyền hạn truy cập thông tin này."
                        />
                    ) : (
                        <></>
                    )}
                </>
            )}
        </>
    );
};

export default Access;
