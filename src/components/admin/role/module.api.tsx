import { ProFormSwitch, type ProFormInstance } from '@ant-design/pro-components';
import type { IPermission, IRole } from '../../../types/backend';
import { Card, Col, Collapse, Row, Tooltip, type CollapseProps } from 'antd';
import '../../../styles/reset.scss';
import { colorMethod, groupByPermission } from '../../../config/utils';
import { grey } from '@ant-design/colors';
import { useEffect } from 'react';

interface IProps {
    onChange?: (data: any[]) => void;
    onReset?: () => void;
    form: ProFormInstance;
    listPermissions:
        | {
              module: string;
              permissions: IPermission[];
          }[]
        | null;

    singleRole: IRole | null;
    openModal: boolean;
}

const ModuleApi = (props: IProps) => {
    const { form, listPermissions, singleRole, openModal } = props;

    useEffect(() => {
        if (listPermissions?.length && singleRole?.roleId && openModal === true) {
            const userPermissions = groupByPermission(singleRole.permissions);

            let p: any = {};

            listPermissions.forEach((x) => {
                let allCheck = true;
                x.permissions?.forEach((y) => {
                    const temp = userPermissions.find((z) => z.module === x.module);

                    p[y.permissionId!] = false;

                    if (temp) {
                        const isExist = temp.permissions.find((k) => k.permissionId === y.permissionId);
                        if (isExist) {
                            p[y.permissionId!] = true;
                        } else allCheck = false;
                    } else {
                        allCheck = false;
                    }
                });

                p[x.module] = allCheck;
            });

            form.setFieldsValue({
                name: singleRole.name,
                active: singleRole.active,
                description: singleRole.description,
                permissions: p,
            });
        }
    }, [openModal]);

    const panels: CollapseProps['items'] = listPermissions?.map((item, index) => ({
        key: `${index}-parent`,
        label: <div>{item.module}</div>,
        forceRender: true,
        extra: (
            <div className="customize-form-item">
                <ProFormSwitch
                    name={['permissions', item.module]}
                    fieldProps={{
                        defaultChecked: false,
                        onClick: (_u, e) => {
                            e.stopPropagation();
                        },
                        onChange: (value) => handleSwitchAll(value, item.module),
                    }}
                />
            </div>
        ),
        children: (
            <Row gutter={[16, 16]}>
                {item.permissions?.map((value, i: number) => (
                    <Col lg={12} md={12} sm={24} key={`${i}-child-${item.module}`}>
                        <Card size="small">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ProFormSwitch
                                        name={['permissions', value.permissionId as string]}
                                        fieldProps={{
                                            defaultChecked: false,
                                            onChange: (v) =>
                                                handleSingleCheck(v, value.permissionId as string, item.module),
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                                    <Tooltip title={value?.name}>
                                        <p style={{ paddingLeft: 10, marginBottom: 3 }}>{value?.name || ''}</p>
                                        <div style={{ display: 'flex' }}>
                                            <p
                                                style={{
                                                    paddingLeft: 10,
                                                    fontWeight: 'bold',
                                                    marginBottom: 0,
                                                    color: colorMethod(value?.method as string),
                                                }}
                                            >
                                                {value?.method || ''}
                                            </p>
                                            <p style={{ paddingLeft: 10, marginBottom: 0, color: grey[5] }}>
                                                {value?.apiPath || ''}
                                            </p>
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        ),
    }));

    const handleSwitchAll = (value: boolean, name: string) => {
        const child = listPermissions?.find((item) => item.module === name);
        if (child) {
            child?.permissions?.forEach((item) => {
                if (item.permissionId) form.setFieldValue(['permissions', item.permissionId], value);
            });
        }
    };

    const handleSingleCheck = (value: boolean, child: string, parent: string) => {
        form.setFieldValue(['permissions', child], value);

        const temp = listPermissions?.find((item) => item.module === parent);
        if (temp?.module) {
            const restPermission = temp?.permissions?.filter((item) => item.permissionId !== child);
            if (restPermission && restPermission.length) {
                const allTrue = restPermission.every((item) =>
                    form.getFieldValue(['permissions', item.permissionId as string]),
                );
                form.setFieldValue(['permissions', parent], allTrue && value);
            }
        }
    };

    return (
        <Card size="small">
            <Collapse items={panels} />
        </Card>
    );
};

export default ModuleApi;
