import { useNavigate } from 'react-router-dom';
import PublicPage from './PublicPage';
import Button from '../../components/Button/Button';
import { HomeOutlined } from '@mui/icons-material';

import classNames from 'classnames/bind';
import styles from './AlertBookingSuccess.module.scss';

const cx = classNames.bind(styles);

const AlertBookingSuccess = () => {
    const navigate = useNavigate();
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');

    return (
        <PublicPage>
            <div className={cx('alert-success')}>
                <div className={cx('alert-content')}>
                    <h2>Đặt phòng thành công!</h2>
                    <p>
                        Bạn đã tạo booking thành công, hãy kiểm tra email được gửi đến{' '}
                        <strong>{customerInfo.email}</strong>
                    </p>
                    <div className={cx('action')}>
                        <Button
                            icon={<HomeOutlined />}
                            content="Về trang chủ"
                            onClick={() => navigate('/')}
                        />
                    </div>
                </div>
            </div>
        </PublicPage>
    );
};

export default AlertBookingSuccess;
