import { Breadcrumb, Col, ConfigProvider, Divider, Form, message, notification, Row } from 'antd';
import styles from '../../../styles/admin.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { ICareer, IJob, ISelect, ISkill } from '../../../types/backend';
import viVN from 'antd/lib/locale/vi_VN';
import {
    ProForm,
    ProFormDatePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
} from '@ant-design/pro-components';
import { CheckSquareOutlined } from '@ant-design/icons';
import { getLocationName, getLocationValue, LOCATION_LIST } from '../../../config/utils';
import { DebounceSelect } from '../debounce.select';
import {
    callCreateJob,
    callFetchAllCareer,
    callFetchAllSkill,
    callFetchJobById,
    callFetchRecruiter,
    callUpdateJob,
} from '../../../config/api';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import QuillCustom from '../../quill.custom';

const ViewUpsertJob = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const jobId = params?.get('id');

    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [recruiters, setRecruiters] = useState<ISelect[]>([]);
    const [skills, setSkills] = useState<ISelect[]>([]);
    const [careers, setCareers] = useState<ISelect[]>([]);
    const [description, setDescription] = useState<string>('');

    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            const temp = await fetchSkillList();
            setSkills(temp);

            const tmp = await fetchCareerList();
            setCareers(tmp);

            if (jobId) {
                const res = await callFetchJobById(jobId);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setDescription(res.data.description);
                    setRecruiters([
                        {
                            label: res.data.recruiter?.fullName as string,
                            value: `${res.data.recruiter?.userId}@#$${res.data.recruiter?.avatar}` as string,
                            key: res.data.recruiter?.userId,
                        },
                    ]);

                    const temp: ISelect[] = res.data?.skills?.map((item: ISkill) => {
                        return {
                            label: item.name,
                            value: item.skillId,
                            key: item.skillId,
                        };
                    });

                    const tmp: ISelect = {
                        label: res.data?.career?.name,
                        value: res.data?.career?.careerId,
                        key: res.data?.career?.careerId,
                    };

                    form.setFieldsValue({
                        ...res.data,
                        recruiter: {
                            label: res.data.recruiter?.fullName as string,
                            value: `${res.data.recruiter?.userId}@#$${res.data.recruiter?.avatar}` as string,
                            key: res.data.recruiter?.userId,
                        },
                        location: {
                            label: res.data?.location,
                            value: getLocationValue(res.data?.location),
                        },
                        skills: temp,
                        career: tmp,
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

            let career = null;
            if (typeof values?.career === 'object') {
                career = { careerId: values?.career?.value };
            } else {
                career = { careerId: +values?.career };
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
                location:
                    typeof values.location === 'object' ? values.location.label : getLocationName(values.location),
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
                career: career,
            };
            const res = await callUpdateJob(job, dataUpdate.jobId);
            if (res.data) {
                message.success(t('notify.success_update_job'));
                navigate('/admin/job');
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        } else {
            const cp = values?.recruiter?.split('@#$');
            const arrSkills = values?.skills?.map((item: string) => {
                return { skillId: +item };
            });
            const career = { careerId: values?.career };
            const job = {
                title: values.title as string,
                skills: arrSkills as ISkill[],
                recruiter: {
                    userId: cp && cp.length > 0 ? (cp[0] as string) : '',
                    fullName: values.recruiter.label as string,
                    logo: cp && cp.length > 1 ? (cp[1] as string) : '',
                    type: 'recruiter',
                },
                location:
                    typeof values.location === 'object'
                        ? (values.location.label as string)
                        : getLocationName(values.location),
                salary: values.salary as number,
                quantity: values.quantity as number,
                level: values.level as string,
                description: description as string,
                startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
                endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
                active: values.active ? true : false,
                workingType: values.workingType as string,
                career: career as ICareer,
            };
            const res = await callCreateJob(job);
            if (res.data) {
                message.success(t('notify.success_create_job'));
                navigate('/admin/job');
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        }
    };

    async function fetchSkillList(): Promise<ISelect[]> {
        const res = await callFetchAllSkill(`page=1&size=500`);
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

    async function fetchCareerList(): Promise<ISelect[]> {
        const res = await callFetchAllCareer(`page=1&size=500`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map((item) => {
                return {
                    label: item.name as string,
                    value: `${item.careerId}` as string,
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
                    value: `${item.userId}@#$${item.avatar}` as string,
                };
            });
            return temp;
        } else return [];
    }

    return (
        <motion.div initial={{ opacity: 0, y: 500 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Access permission={ALL_PERMISSIONS.JOBS.CREATE}>
                <div className={styles['upsert-job-container']}>
                    <div className={styles['title']}>
                        <Breadcrumb
                            separator=">"
                            items={[
                                {
                                    title: <Link to="/admin/job">{t('job')}</Link>,
                                },
                                {
                                    title: (
                                        <span style={{ color: '#00b452' }}>
                                            {dataUpdate?.jobId ? t('button.update') : t('button.create')}
                                        </span>
                                    ),
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
                                        resetText: t('button.cancel'),
                                        submitText: <>{dataUpdate?.jobId ? t('button.update') : t('button.create')}</>,
                                    },
                                    onReset: () => navigate('/admin/job'),
                                    render: (_: any, dom: any) => (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{dom}</div>
                                    ),
                                    submitButtonProps: {
                                        icon: <CheckSquareOutlined />,
                                    },
                                }}
                            >
                                <Row gutter={[20, 20]}>
                                    <Col span={24} md={6}>
                                        <ProFormSwitch
                                            label={t('status')}
                                            name="active"
                                            checkedChildren={t('button.active').toUpperCase()}
                                            unCheckedChildren={t('button.inactive').toUpperCase()}
                                            initialValue={dataUpdate?.active}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={[20, 20]}>
                                    <Col span={24} md={12}>
                                        <ProFormText
                                            label={t('table.job_table.title')}
                                            name="title"
                                            rules={[{ required: true, message: t('notify.required') }]}
                                            placeholder={t('placeholder')}
                                        />
                                    </Col>
                                    {(dataUpdate?.jobId || !jobId) && (
                                        <Col span={24} md={6}>
                                            <ProForm.Item
                                                name="recruiter"
                                                label={t('recruiter')}
                                                rules={[{ required: true, message: t('notify.required') }]}
                                            >
                                                <DebounceSelect
                                                    allowClear
                                                    showSearch
                                                    value={recruiters}
                                                    placeholder={t('choose')}
                                                    fetchOptions={fetchRecruiterList}
                                                    onChange={(newValue: any) => {
                                                        setRecruiters(newValue as ISelect[]);
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                            </ProForm.Item>
                                        </Col>
                                    )}
                                    <Col span={24} md={6}>
                                        <ProFormSelect
                                            showSearch
                                            name="location"
                                            label={t('address')}
                                            options={LOCATION_LIST.filter((item) => item.value !== 'ALL')}
                                            placeholder={t('choose')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={[20, 20]}>
                                    <Col span={24} md={6}>
                                        <ProFormDigit
                                            label={t('table.job_table.salary')}
                                            name="salary"
                                            rules={[{ required: true, message: t('notify.required') }]}
                                            placeholder={t('placeholder')}
                                            fieldProps={{
                                                addonAfter: ' đ',
                                                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                                parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, ''),
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormDigit
                                            label={t('table.job_table.quantity')}
                                            name="quantity"
                                            rules={[{ required: true, message: t('notify.required') }]}
                                            placeholder={t('placeholder')}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormSelect
                                            showSearch
                                            name="career"
                                            label={t('career')}
                                            options={careers}
                                            placeholder={t('choose')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                            allowClear
                                            fieldProps={{
                                                suffixIcon: null,
                                            }}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormSelect
                                            name="skills"
                                            label={t('skill')}
                                            options={skills}
                                            placeholder={t('choose')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                            allowClear
                                            mode="multiple"
                                            fieldProps={{
                                                suffixIcon: null,
                                                maxTagCount: 1,
                                                maxTagPlaceholder: (omittedValues) => `+${omittedValues.length}`,
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={[20, 20]}>
                                    <Col span={24} md={6}>
                                        <ProFormDatePicker
                                            label={t('table.job_table.dateStart')}
                                            name="startDate"
                                            normalize={(value: any) => value && dayjs(value, 'DD/MM/YYYY')}
                                            fieldProps={{
                                                format: 'DD/MM/YYYY',
                                                style: { width: '100%' },
                                            }}
                                            rules={[
                                                { required: true, message: t('notify.required') },
                                                {
                                                    validator: async (_: any, value: any, _callback: any) => {
                                                        const endDate = form.getFieldValue('endDate');
                                                        if (
                                                            endDate &&
                                                            value &&
                                                            !dayjs(value).isBefore(dayjs(endDate))
                                                        ) {
                                                            return Promise.reject(new Error(t('notify.date_start')));
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
                                            label={t('table.job_table.dateEnd')}
                                            name="endDate"
                                            normalize={(value: any) => value && dayjs(value, 'DD/MM/YYYY')}
                                            fieldProps={{
                                                format: 'DD/MM/YYYY',
                                                style: { width: '100%' },
                                            }}
                                            rules={[
                                                { required: true, message: t('notify.required') },
                                                {
                                                    validator: async (_: any, value: any, _callback: any) => {
                                                        const startDate = form.getFieldValue('startDate');
                                                        if (
                                                            startDate &&
                                                            value &&
                                                            !dayjs(value).isAfter(dayjs(startDate))
                                                        ) {
                                                            return Promise.reject(new Error(t('notify.date_end')));
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                            placeholder="dd/mm/yyyy"
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormSelect
                                            name="level"
                                            label={t('level')}
                                            valueEnum={{
                                                FRESHER: 'Fresher',
                                                JUNIOR: 'Junior',
                                                SENIOR: 'Senior',
                                                INTERN: 'Intern',
                                                MIDDLE: 'Middle',
                                            }}
                                            placeholder={t('choose')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                        />
                                    </Col>
                                    <Col span={24} md={6}>
                                        <ProFormSelect
                                            name="workingType"
                                            label={t('table.job_table.type')}
                                            valueEnum={{
                                                FULLTIME: 'Full time',
                                                PARTTIME: 'Part time',
                                                ONLINE: 'Online',
                                                OFFLINE: 'Offline',
                                            }}
                                            placeholder={t('choose')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <ProForm.Item
                                            name="description"
                                            label={t('description')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                        >
                                            <QuillCustom value={description} onChange={setDescription} />
                                        </ProForm.Item>
                                    </Col>
                                </Row>
                                <Divider />
                            </ProForm>
                        </ConfigProvider>
                    </div>
                </div>
            </Access>
        </motion.div>
    );
};

export default ViewUpsertJob;
