import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/hook';
import { Result } from 'antd';
import { useTranslation } from 'react-i18next';

interface IPermission {
    method: string;
    apiPath: string;
    module: string;
}

interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: IPermission | IPermission[];
}

const Access = (props: IProps) => {
    const { t } = useTranslation();
    const { hideChildren = false, permission } = props;
    const [allow, setAllow] = useState<boolean>(true);
    const permissions = useAppSelector((state) => state.account.user.role.permissions);

    const permissionList = Array.isArray(permission) ? permission : [permission];

    useEffect(() => {
        if (permissions?.length) {
            const check = permissions.some((item) =>
                permissionList.some(
                    (perm) =>
                        item.apiPath === perm.apiPath && item.method === perm.method && item.module === perm.module,
                ),
            );
            if (check) {
                setAllow(true);
            } else setAllow(false);
        }
    }, [permissions, permission]);

    return (
        <>
            {allow === true || import.meta.env.VITE_ACL_ENABLE === 'false' ? (
                <>{props.children}</>
            ) : (
                <>
                    {hideChildren === false ? (
                        <Result
                            status="403"
                            title={t('page_error.result.title')}
                            subTitle={t('page_error.result.subTitle')}
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
