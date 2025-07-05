import { CloseOutlined } from '@ant-design/icons';
import { Drawer, Menu } from 'antd';

interface IProps {
    placement: 'left' | 'right';
    open: boolean;
    onClose: () => void;
    onMenuClick: (e: any) => void;
    selectedKey: string;
    menuItems: any[];
    titleText?: string;
    showUsername?: boolean;
    username?: string;
}

const DrawerCustom = (props: IProps) => {
    const { placement, open, onClose, onMenuClick, selectedKey, menuItems, titleText, showUsername, username } = props;
    const isLeft = placement === 'left';

    return (
        <Drawer
            title={
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                    }}
                    onClick={onClose}
                >
                    {isLeft ? (
                        <span style={{ marginLeft: 'auto', marginRight: '12px' }}>{titleText}</span>
                    ) : (
                        <>
                            <CloseOutlined style={{ fontSize: 20, cursor: 'pointer', color: '#00b452' }} />
                            <span style={{ marginLeft: 12 }}>{showUsername ? `Welcome ${username}` : titleText}</span>
                        </>
                    )}
                </div>
            }
            closeIcon={false}
            extra={
                isLeft && (
                    <CloseOutlined onClick={onClose} style={{ fontSize: 20, cursor: 'pointer', color: '#00b452' }} />
                )
            }
            placement={placement}
            onClose={onClose}
            open={open}
        >
            <Menu onClick={onMenuClick} selectedKeys={[selectedKey]} mode="vertical" items={menuItems} />
        </Drawer>
    );
};

export default DrawerCustom;
