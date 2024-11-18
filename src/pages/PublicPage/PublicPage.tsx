import React from 'react';
import styles from './PublicPage.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const PublicPage = ({ children }: { children: React.ReactNode }) => {


  return (
    <div className={cx('public-page')}>
      <header className={cx('header')}>
        <div className={cx('header-content')}>
          <div className={cx('logo')}>
            <img className={cx('logo-img')} src="/HOTEL_BOOKING.png" alt="Hotel Logo" />
            <h1>Hotel Booking</h1>
          </div>
          <div className={cx('header-slogan')}>
            <h2>Tìm và đặt phòng khách sạn tốt nhất cho bạn</h2>
          </div>
        </div>
      </header>
      
      {children}

      <footer className={cx('footer')}>
        <div className={cx('footer-content')}>
          <div className={cx('footer-section')}>
            <h3>Về chúng tôi</h3>
            <p>Hotel Booking là nền tảng đặt phòng khách sạn trực tuyến hàng đầu, cung cấp dịch vụ đặt phòng an toàn và tiện lợi.</p>
          </div>
          <div className={cx('footer-section')}>
            <h3>Liên hệ</h3>
            <p>Email: support@hotelbooking.com</p>
            <p>Điện thoại: 1900 xxxx</p>
            <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
          </div>
          <div className={cx('footer-section')}>
            <h3>Theo dõi chúng tôi</h3>
            <div className={cx('social-links')}>
              <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>
        <div className={cx('footer-bottom')}>
          <p>&copy; 2023 Hotel Booking. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>

    </div>
  );
};

export default PublicPage;
