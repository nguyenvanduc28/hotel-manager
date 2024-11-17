import React, { useState } from 'react';
import styles from './PublicPage.module.scss';
import classNames from 'classnames/bind';
import SearchBar from './components/SearchBar/SearchBar';
import { searchHotels } from '../../apis/hotelApis';
import { toast } from 'react-toastify';
import HotelCard from './components/HotelCard/HotelCard';
import { HotelSearchResult } from '../../types/hotel';
const cx = classNames.bind(styles);

const PublicPage = () => {
  const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchData: {
    location: string;
    checkIn: number;
    checkOut: number;
  }) => {
    try {
      setIsLoading(true);
      const results = await searchHotels({
        location: searchData.location,
        checkInDate: searchData.checkIn / 1000,
        checkOutDate: searchData.checkOut / 1000
      });
      setSearchResults(results);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <main className={cx('main-content')}>
        <div className={cx('search-section')}>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className={cx('results-section')}>
          {isLoading ? (
            <div className={cx('loading')}>Đang tìm kiếm...</div>
          ) : searchResults.length > 0 ? (
            <div className={cx('search-results')}>
              {searchResults.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className={cx('no-results')}>
              <p>Hãy tìm kiếm địa điểm</p>
            </div>
          )}
        </div>
      </main>

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
