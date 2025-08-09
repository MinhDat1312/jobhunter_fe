import { CloseOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';

interface IProps {
    value: string;
    index?: number;
    onChange: ((index: number, value: string) => void) | ((value: string) => void);
    onRemove?: (index: number) => void;
    readonly?: boolean;
}

const QuillCustom = (props: IProps) => {
    const { value, index = -1, onChange, onRemove = null, readonly = false } = props;
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
            ],
        },
    };

    return (
        <div style={{ position: 'relative', marginBottom: 12 }}>
            {onRemove && (
                <CloseOutlined
                    onClick={() => onRemove(index)}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 10,
                        zIndex: 10,
                        fontSize: '1rem',
                        color: '#ff4d4f',
                        cursor: 'pointer',
                    }}
                />
            )}
            <ReactQuill
                value={value}
                onChange={(val) => {
                    if (onChange.length === 2) {
                        (onChange as (index: number, value: string) => void)(index, val);
                    } else {
                        (onChange as (value: string) => void)(val);
                    }
                }}
                modules={modules}
                theme="snow"
                readOnly={readonly}
            />
        </div>
    );
};

export default QuillCustom;
