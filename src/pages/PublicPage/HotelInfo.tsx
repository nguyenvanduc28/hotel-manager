import classNames from 'classnames/bind';
import styles from './HotelInfo.module.scss';
import PublicPage from './PublicPage';
import { HotelInfo as HotelInfoType, RoomInfo } from '../../types/hotel';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../../apis/hotelApis';
import { getAvailableRooms } from '../../apis/roomApis/roomApis';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


import { 
    Star, 
    LocationOn, 
    Wifi, 
    LocalParking, 
    Pool, 
    Restaurant,
    MeetingRoom,
    AccessTime,
    LocalBar,
    Elevator,
    AcUnit,
    AirportShuttle
} from '@mui/icons-material';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import { PUBLIC_PATHS } from '../../constants/admin/adminPath';

const cx = classNames.bind(styles);

const HotelInfo = () => {
    const [searchParams] = useSearchParams();
    const hotelId = searchParams.get('hotelId');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const [hotelInfo, setHotelInfo] = useState<HotelInfoType>();
    const [roomsAvailable, setRoomsAvailable] = useState<RoomInfo[]>([]);
    const navigate = useNavigate();

    const fetchHotelInfo = async () => {
        try {
            const dataHotel = await getHotelById(parseInt(hotelId || '0'));
            const dataRooms = await getAvailableRooms(parseInt(checkInDate || '0'), parseInt(checkOutDate || '0'), parseInt(hotelId || '0'));
            setHotelInfo(dataHotel);
            setRoomsAvailable(dataRooms);
        } catch (error) {
            toast.error('Lấy thông tin khách sạn thất bại');
        }
    }

    useEffect(() => {
        fetchHotelInfo();
    }, [checkInDate, checkOutDate, hotelId]);

    const handleBookNow = (room: RoomInfo) => {
        if (!checkInDate || !checkOutDate) {
            toast.error('Vui lòng chọn ngày nhận phòng và trả phòng');
            return;
        }

        navigate(`${PUBLIC_PATHS.BOOKING_PUBLIC}?hotelId=${hotelId}&roomId=${room.id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
    };

    return <PublicPage>
        <div className={cx('hotel-info')}>
            {hotelInfo && (
                <>
                    <div className={cx('header')}>
                        <div className={cx('title-section')}>
                            <h1>{hotelInfo.name}</h1>
                            <div className={cx('rating')}>
                                {[...Array(hotelInfo.rating || 0)].map((_, index) => (
                                    <Star key={index} className={cx('star-icon')} />
                                ))}
                            </div>
                            <div className={cx('address')}>
                                <LocationOn />
                                <span>{hotelInfo.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('main-content')}>
                        <div className={cx('content-wrapper')}>
                            <div className={cx('gallery')}>
                                {hotelInfo.images && hotelInfo.images.length > 0 ? (
                                    <div className={cx('image-grid')}>
                                        {hotelInfo.images.slice(0, 6).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.url}
                                                alt={`${hotelInfo.name} - Ảnh ${index + 1}`}
                                                className={cx('gallery-image')}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <img
                                        src={hotelInfo.logoUrl}
                                        alt={hotelInfo.name}
                                        className={cx('main-image')}
                                    />
                                )}
                            </div>
                            <div className={cx('hotel-description')}>
                                <p>{hotelInfo.description}</p>
                            </div>
                        </div>

                        <div className={cx('info-section')}>
                            <div className={cx('description')}>
                                <h2>Thông tin khách sạn</h2>
                                <div className={cx('hotel-details')}>
                                    <p>Số phòng trống hiện tại: {hotelInfo.numberOfRooms}</p>
                                    <p>Giờ nhận phòng: {hotelInfo.checkInTime}</p>
                                    <p>Giờ trả phòng: {hotelInfo.checkOutTime}</p>
                                </div>
                            </div>

                            <div className={cx('amenities')}>
                                <h2>Tiện nghi chính</h2>
                                <div className={cx('amenities-grid')}>
                                    {hotelInfo.hasWifi && (
                                        <div className={cx('amenity')}>
                                            <Wifi />
                                            <span>Wifi miễn phí</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasParking && (
                                        <div className={cx('amenity')}>
                                            <LocalParking />
                                            <span>Bãi đậu xe</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasSwimmingPool && (
                                        <div className={cx('amenity')}>
                                            <Pool />
                                            <span>Hồ bơi</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasRestaurant && (
                                        <div className={cx('amenity')}>
                                            <Restaurant />
                                            <span>Nhà hàng</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasConferenceRoom && (
                                        <div className={cx('amenity')}>
                                            <MeetingRoom />
                                            <span>Phòng hội nghị</span>
                                        </div>
                                    )}
                                    {hotelInfo.has24HourFrontDesk && (
                                        <div className={cx('amenity')}>
                                            <AccessTime />
                                            <span>Lễ tân 24/7</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasBar && (
                                        <div className={cx('amenity')}>
                                            <LocalBar />
                                            <span>Quầy bar</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasElevator && (
                                        <div className={cx('amenity')}>
                                            <Elevator />
                                            <span>Thang máy</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasAirConditioning && (
                                        <div className={cx('amenity')}>
                                            <AcUnit />
                                            <span>Điều hòa</span>
                                        </div>
                                    )}
                                    {hotelInfo.hasShuttle && (
                                        <div className={cx('amenity')}>
                                            <AirportShuttle />
                                            <span>Đưa đón sân bay</span>
                                        </div>
                                    )}
                                </div>
                                {hotelInfo.otherAmenities && (
                                    <div className={cx('other-amenities')}>
                                        <h3>Tiện ích khác</h3>
                                        <p>{hotelInfo.otherAmenities}</p>
                                    </div>
                                )}
                            </div>
                            <div className={cx('map-container')}>
                                <h2>Vị trí khách sạn</h2>
                                <div className={cx('address')}>
                                    <LocationOn />
                                    <a title='Xem trên Google Map' className={cx('map-link')} href={`https://www.google.com/maps/search/?api=1&query=${hotelInfo.latitude},${hotelInfo.longitude}`} target='_blank' rel='noreferrer'> {hotelInfo.address}</a>
                                </div>
                                <div className={cx('map-wrapper')}>
                                    <MapContainer
                                        center={[hotelInfo.latitude || 10.762622, hotelInfo.longitude || 106.660172] as [number, number]}
                                        zoom={15}
                                        style={{ height: '300px', width: '100%', borderRadius: '12px' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {hotelInfo.latitude && hotelInfo.longitude && (
                                            <Marker
                                                position={[hotelInfo.latitude, hotelInfo.longitude]}
                                                icon={new Icon({
                                                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                                                    iconSize: [25, 41],
                                                    iconAnchor: [12, 41],
                                                })}
                                            />
                                        )}
                                    </MapContainer>
                                </div>
                            </div>

                            <h2 style={{ marginTop: '2rem' }}>Phòng trống</h2>
                            <div className={cx('rooms-section')}>
                                {roomsAvailable.map((room) => (
                                    <div key={room.id} className={cx('room-card')}>
                                        <div className={cx('room-info')}>
                                            <h3>{room.roomType?.name}</h3>
                                            <p>{room.roomType?.description}</p>
                                            <div className={cx('room-features')}>
                                                <span>Diện tích: {room.size}m²</span>
                                                <span>Sức chứa: {room.roomType?.maxOccupancy} người</span>
                                            </div>
                                        </div>
                                        <div className={cx('room-price')}>
                                            <div className={cx('price')}>
                                                {room.roomType?.priceToday && room.roomType.priceToday !== room.roomType.basePricePerNight ? (
                                                    <>
                                                        <span className={cx('price-today')}>{room.roomType.priceToday.toLocaleString()} VNĐ/đêm</span>
                                                        <span className={cx('price-base-line-through')}>
                                                            {room.roomType.basePricePerNight?.toLocaleString()} VNĐ/đêm
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className={cx('price-base')}>{room.roomType?.basePricePerNight?.toLocaleString()} VNĐ/đêm</span>
                                                )}
                                            </div>
                                            <button 
                                                className={cx('book-button')}
                                                onClick={() => handleBookNow(room)}
                                            >
                                                Đặt ngay
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    </PublicPage>
}

export default HotelInfo;