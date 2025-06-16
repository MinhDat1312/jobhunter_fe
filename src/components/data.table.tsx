import { ProTable, type ActionType, type ParamsType, type ProTableProps } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/locale/vi_VN';

const DataTable = <T extends Record<string, any>, U extends ParamsType = ParamsType, ValueType = 'text'>({
    columns,
    actionRef,
    headerTitle,
    rowKey = (record) => record.userId,
    loading,
    dataSource,
    request,
    scroll,
    pagination,
    rowSelection,
    toolBarRender,
    defaultData = [],
    postData,
    params,
    search,
    polling,
    dateFormatter = 'string',
}: ProTableProps<T, U, ValueType>) => {
    return (
        <ConfigProvider locale={vi_VN}>
            <ProTable<T, U, ValueType>
                columns={columns}
                actionRef={actionRef}
                headerTitle={headerTitle}
                rowKey={rowKey}
                loading={loading}
                dataSource={dataSource}
                request={request}
                scroll={scroll}
                pagination={pagination}
                rowSelection={rowSelection}
                toolBarRender={toolBarRender}
                defaultData={defaultData}
                postData={postData}
                bordered
                params={params}
                polling={polling}
                dateFormatter={dateFormatter}
                search={search}
            />
        </ConfigProvider>
    );
};
export default DataTable;
