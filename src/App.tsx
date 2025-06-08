import { Button } from 'antd';
import { useState } from 'react';
import ModalRecruiter from './components/admin/recruiter/modal.recruiter';

function App() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div style={{ padding: 24 }}>
            <Button type="primary" onClick={() => setOpenModal(true)}>
                Mở Modal Recruiter
            </Button>

            <ModalRecruiter
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={null}
                setDataInit={() => {}}
                reloadTable={() => {}}
            />
        </div>
    );
}

export default App;
