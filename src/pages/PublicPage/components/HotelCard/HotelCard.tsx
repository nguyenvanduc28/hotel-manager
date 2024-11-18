import React from 'react';
import styles from './HotelCard.module.scss';
import classNames from 'classnames/bind';
import { HotelSearchResult } from '../../../../types/hotel';
import { 
  Wifi, LocalParking, Restaurant, Pool, 
  MeetingRoom, AccessTime, LocalBar, Elevator,
  AcUnit, AirportShuttle, LocationOn 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_PATHS } from '../../../../constants/admin/adminPath';

const cx = classNames.bind(styles);

interface HotelCardProps {
  hotel: HotelSearchResult;
  checkInDate: number;
  checkOutDate: number;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, checkInDate, checkOutDate }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    const path = `${PUBLIC_PATHS.HOTEL_INFO}?hotelId=${hotel.id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
    navigate(path);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`;

  const amenities = [
    { icon: <Wifi />, available: hotel.hasWifi, label: 'Wifi' },
    { icon: <LocalParking />, available: hotel.hasParking, label: 'Bãi đậu xe' },
    { icon: <Restaurant />, available: hotel.hasRestaurant, label: 'Nhà hàng' },
    { icon: <Pool />, available: hotel.hasSwimmingPool, label: 'Hồ bơi' },
    { icon: <MeetingRoom />, available: hotel.hasConferenceRoom, label: 'Phòng họp' },
    { icon: <AccessTime />, available: hotel.has24HourFrontDesk, label: 'Lễ tân 24h' },
    { icon: <LocalBar />, available: hotel.hasBar, label: 'Quầy bar' },
    { icon: <Elevator />, available: hotel.hasElevator, label: 'Thang máy' },
    { icon: <AcUnit />, available: hotel.hasAirConditioning, label: 'Điều hòa' },
    { icon: <AirportShuttle />, available: hotel.hasShuttle, label: 'Đưa đón' },
  ];

  return (
    <div className={cx('hotel-card')} onClick={handleCardClick}>
      <div className={cx('hotel-image')}>
        <img 
          src={hotel.images?.[0]?.url || '/hotel-placeholder.jpg'} 
          alt={hotel.name} 
        />
        {hotel.logoUrl && (
          <img 
            src={hotel.logoUrl} 
            alt="Logo" 
            className={cx('hotel-logo')}
          />
        )}
      </div>
      <div className={cx('hotel-info')}>
        <div className={cx('hotel-header')}>
          <h3 className={cx('hotel-name')}>{hotel.name}</h3>
          <span className={cx('hotel-rating')}>⭐ {hotel.rating?.toFixed(1)}</span>
        </div>
        
        <div className={cx('hotel-location')}>
          <LocationOn />
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cx('address-link')}
          >
            {hotel.address}
          </a>
        </div>

        <div className={cx('hotel-amenities')}>
          {amenities.map((amenity, index) => (
            amenity.available && (
              <div key={index} className={cx('amenity-item')} title={amenity.label}>
                {amenity.icon}
              </div>
            )
          ))}
        </div>

        <p className={cx('hotel-description')}>{hotel.description}</p>

        <div className={cx('hotel-footer')}>
          <div className={cx('room-info')}>
            <span>Còn {hotel.availableRoomCount} phòng trống</span>
          </div>
          <div className={cx('price-info')}>
            <span className={cx('price-label')}>Giá từ</span>
            <span className={cx('price-value')}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(hotel.lowestPrice)}
            </span>
            <span className={cx('price-unit')}>/đêm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard; 