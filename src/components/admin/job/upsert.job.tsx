import { Breadcrumb, Col, ConfigProvider, Divider, Form, message, notification, Row } from 'antd';
import styles from '../../../styles/admin.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { IJob, IRecruiter, ISkill } from '../../../types/backend';
import viVN from 'antd/lib/locale/vi_VN';
import {
    FooterToolbar,
    ProForm,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
} from '@ant-design/pro-components';
import { CheckSquareOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from '../../../config/utils';
import { DebounceSelect } from '../debounce.select';
import {
    callCreateJob,
    callFetchAllSkill,
    callFetchJobById,
    callFetchRecruiter,
    callUpdateJob,
} from '../../../config/api';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';

interface ISelect {
    label: string;
    value: string;
    key?: string;
}

const ViewUpsertJob = () => {
    const navigate = useNavigate();
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const jobId = params?.get('id');

    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [recruiters, setRecruiters] = useState<ISelect[]>([]);
    const [skills, setSkills] = useState<ISelect[]>([]);
    const [description, setDescription] = useState<string>('');

    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            const temp = await fetchSkillList();
            setSkills(temp);

            if (jobId) {
                const res = await callFetchJobById(jobId);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setDescription(res.data.description);
                    setRecruiters([
                        {
                            label: res.data.recruiter?.fullName as string,
                            value: `${res.data.recruiter?.userId}@#$${res.data.recruiter?.logo}` as string,
                            key: res.data.recruiter?.userId,
                        },
                    ]);

                    const temp: any = res.data?.skills?.map((item: ISkill) => {
                        return {
                            label: item.name,
                            value: item.skillId,
                            key: item.skillId,
                        };
                    });
                    form.setFieldsValue({
                        ...res.data,
                        recruiter: {
                            label: res.data.recruiter?.fullName as string,
                            value: `${res.data.recruiter?.userId}@#$${res.data.recruiter?.logo}` as string,
                            key: res.data.recruiter?.userId,
                        },
                        skills: temp,
                    });
                }
            }
        };

        init();
        return () => form.resetFields();
    }, [jobId]);

    const onFinish = async (values: any) => {
        if (dataUpdate?.jobId) {
            let cp = [];
            if (typeof values?.recruiter === 'object') {
                cp = values?.recruiter?.value.split('@#$');
            } else {
                cp = values?.recruiter?.split('@#$');
            }

            let arrSkills = [];
            if (typeof values?.skills?.[0] === 'object') {
                arrSkills = values?.skills?.map((item: any) => {
                    return { skillId: item.value };
                });
            } else {
                arrSkills = values?.skills?.map((item: any) => {
                    return { skillId: +item };
                });
            }
            const job = {
                title: values.title,
                skills: arrSkills,
                recruiter: {
                    userId: cp && cp.length > 0 ? cp[0] : '',
                    fullName: values.recruiter.label,
                    logo: cp && cp.length > 1 ? cp[1] : '',
                    type: 'recruiter',
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: description,
                startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate)
                    ? dayjs(values.startDate, 'DD/MM/YYYY').toDate()
                    : values.startDate,
                endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate)
                    ? dayjs(values.endDate, 'DD/MM/YYYY').toDate()
                    : values.endDate,
                active: values.active ? true : false,
                workingType: values.workingType,
            };
            const res = await callUpdateJob(job, dataUpdate.jobId);
            if (res.data) {
                message.success('Cập nhật tin thành công');
                navigate('/admin/job');
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } else {
            const cp = values?.recruiter?.split('@#$');
            const arrSkills = values?.skills?.map((item: string) => {
                return { skillId: +item };
            });
            const job = {
                title: values.title,
                skills: arrSkills,
                recruiter: {
                    userId: cp && cp.length > 0 ? cp[0] : '',
                    fullName: values.recruiter.label,
                    logo: cp && cp.length > 1 ? cp[1] : '',
                    type: 'recruiter',
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: description,
                startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
                endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
                active: values.active ? true : false,
                workingType: values.workingType,
            };
            console.log(job);
            const res = await callCreateJob(job);
            if (res.data) {
                message.success('Tạo mới tin thành công');
                navigate('/admin/job');
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        }
    };

    async function fetchSkillList(): Promise<ISelect[]> {
        const res = await callFetchAllSkill(`page=1&size=100`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map((item) => {
                return {
                    label: item.name as string,
                    value: `${item.skillId}` as string,
                };
            });
            return temp;
        } else return [];
    }

    async function fetchRecruiterList(name: string): Promise<ISelect[]> {
        const q: any = {
            page: 1,
            size: 100,
            filter: '',
        };
        q.filter = `${sfLike('fullName', name)}`;
        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);
        const res = await callFetchRecruiter(temp);

        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map((item) => {
                return {
                    label: item.fullName as string,
                    value: `${item.userId}@#$${item.logo}` as string,
                };
            });
            return temp;
        } else return [];
    }

    return (
        <div className={styles['upsert-job-container']}>
            <div className={styles['title']}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/job">Tin tuyển dụng</Link>,
                        },
                        {
                            title: `${dataUpdate?.jobId ? 'Cập nhật tin' : 'Tạo mới tin'}`,
                        },
                    ]}
                />
            </div>
            <div>
                <ConfigProvider locale={viVN}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={{
                            searchConfig: {
                                resetText: 'Hủy',
                                submitText: <>{dataUpdate?.jobId ? 'Cập nhật tin' : 'Tạo mới tin'}</>,
                            },
                            onReset: () => navigate('/admin/job'),
                            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />,
                            },
                        }}
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Tiêu đề"
                                    name="title"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập tên tiêu đề"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="skills"
                                    label="Kỹ năng yêu cầu"
                                    options={skills}
                                    placeholder="Chọn ít nhất 1 kỹ năng"
                                    rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
                                    allowClear
                                    mode="multiple"
                                    fieldProps={{
                                        suffixIcon: null,
                                        maxTagCount: 2,
                                        maxTagPlaceholder: (omittedValues) => `+${omittedValues.length}`,
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    showSearch
                                    name="location"
                                    label="Địa điểm"
                                    options={LOCATION_LIST.filter((item) => item.value !== 'ALL')}
                                    placeholder="Chọn địa điểm"
                                    rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Mức lương"
                                    name="salary"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập mức lương"
                                    fieldProps={{
                                        addonAfter: ' đ',
                                        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                        parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, ''),
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Số lượng"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập số lượng"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="level"
                                    label="Trình độ"
                                    valueEnum={{
                                        FRESHER: 'Fresher',
                                        JUNIOR: 'Junior',
                                        SENIOR: 'Senior',
                                        INTERN: 'Intern',
                                        MIDDLE: 'Middle',
                                    }}
                                    placeholder="Chọn trình độ"
                                    rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
                                />
                            </Col>
                            {(dataUpdate?.jobId || !jobId) && (
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="recruiter"
                                        label="Thuộc nhà tuyển dụng"
                                        rules={[{ required: true, message: 'Vui lòng chọn nhà tuyển dụng!' }]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            value={recruiters}
                                            placeholder="Chọn nhà tuyển dụng"
                                            fetchOptions={fetchRecruiterList}
                                            onChange={(newValue: any) => {
                                                setRecruiters(newValue as ISelect[]);
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>
                                </Col>
                            )}
                        </Row>
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày bắt đầu"
                                    name="startDate"
                                    normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',
                                    }}
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn ngày bắt đầu' },
                                        {
                                            validator: async (_, value, callback) => {
                                                const endDate = form.getFieldValue('endDate');
                                                if (endDate && value && !dayjs(value).isBefore(dayjs(endDate))) {
                                                    return Promise.reject(
                                                        new Error('Ngày bắt đầu phải trước ngày kết thúc'),
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày kết thúc"
                                    name="endDate"
                                    normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',
                                    }}
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                                        {
                                            validator: async (_, value, callback) => {
                                                const startDate = form.getFieldValue('startDate');
                                                if (startDate && value && !dayjs(value).isAfter(dayjs(startDate))) {
                                                    return Promise.reject(
                                                        new Error('Ngày kết thúc phải sau ngày bắt đầu'),
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="active"
                                    checkedChildren="Bật"
                                    unCheckedChildren="Tắt"
                                    initialValue={dataUpdate?.active}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="workingType"
                                    label="Hình thức"
                                    valueEnum={{
                                        FULLTIME: 'Full time',
                                        PARTTIME: 'Part time',
                                        ONLINE: 'Online',
                                        OFFLINE: 'Offline',
                                    }}
                                    placeholder="Chọn hình thức"
                                    rules={[{ required: true, message: 'Vui lòng chọn hình thức!' }]}
                                />
                            </Col>
                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Miêu tả tin"
                                    rules={[{ required: true, message: 'Vui lòng nhập miêu tả tin!' }]}
                                >
                                    <ReactQuill theme="snow" value={description} onChange={setDescription} />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                    </ProForm>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default ViewUpsertJob;
