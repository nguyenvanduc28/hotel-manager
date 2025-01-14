import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookingForm, CustomerForm } from '../../types/forms';
import { HotelInfo, RoomInfo } from '../../types/hotel';
import { getHotelById } from '../../apis/hotelApis';
import { getAvailableRooms, getRoomById } from '../../apis/roomApis/roomApis';
import { createBooking, createCustomer } from '../../apis/bookingApis/bookingApis';
import { toast } from 'react-toastify';
import moment from 'moment';
import PublicPage from './PublicPage';
import styles from './BookingPublic.module.scss';
import classNames from 'classnames/bind';
import { BOOKING_STATUS, GENDERS } from '../../constants/admin/constants';
import InputText from '../../components/Input/InputText';
import Button from '../../components/Button/Button';
import { DateRange, SaveOutlined } from '@mui/icons-material';
import GroupRadio from '../../components/GroupRadio/GroupRadio';
import { countries } from '../../constants/regions';
import SelectContainer from '../../components/Select/SelectContainer';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ColumnFilter from "../../components/ColumnFilter/ColumnFilter";
import { CloseOutlined } from "@mui/icons-material";
import { Divider } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";
import { DateRangePicker } from 'react-date-range';
import { PUBLIC_PATHS } from '../../constants/admin/adminPath';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const cx = classNames.bind(styles);

const defaultColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 0.5,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span style={{ paddingLeft: "10px" }}>ID</span>,
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>{params.row.id}</span>
    ),
  },
  {
    field: "roomNumber",
    headerName: "Số phòng",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Số phòng</span>,
    renderCell: (params) => <span>{params.row.roomNumber}</span>,
  },
  {
    field: "floor",
    headerName: "Tầng",
    flex: 0.5,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tầng</span>,
    renderCell: (params) => <span>{params.row.floor}</span>,
  },
  {
    field: "roomType",
    headerName: "Loại phòng",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Loại phòng</span>,
    renderCell: (params) => (
      <span>{params.row.roomType ? params.row.roomType.name : ""}</span>
    ),
  },
  {
    field: "isAvailable",
    headerName: "Có sẵn",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Có sẵn</span>,
    renderCell: (params) =>
      params.row.isAvailable ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "price",
    headerName: "Giá phòng (giá cơ bản/đêm)",
    flex: 1,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Giá phòng/1 đêm</span>,
    renderCell: (params) => (
      <span>
        {params.row.roomType?.priceToday && params.row.roomType.priceToday !== params.row.roomType.basePricePerNight ? (
            <div>
                <span style={{color: '#f7300d'}}>{params.row.roomType.priceToday.toLocaleString()} đ</span>
                <span style={{textDecoration: 'line-through', fontSize: '1.2rem', color: '#888', marginLeft: '8px'}}>{params.row.roomType.basePricePerNight?.toLocaleString()} đ</span>
            </div>
        ) : (
            <span>{params.row.roomType?.basePricePerNight?.toLocaleString()} đ</span>
        )}
      </span>
    ),
  },
];

const hiddenColumns: GridColDef[] = [
  {
    field: "description",
    headerName: "Mô tả",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderCell: (params) => <span>{params.row.description}</span>,
  },
  // {
  //   field: "lastCleaned",
  //   headerName: "Dọn dẹp lần cuối",
  //   flex: 1,
  //   headerClassName: "datagrid-header",
  //   cellClassName: "datagrid-cell",
  //   headerAlign: "left",
  //   renderCell: (params) =>
  //     params.row.lastCleaned
  //       ? moment.unix(params.row.lastCleaned).format("YYYY-MM-DD")
  //       : "",
  // },
  {
    field: "isSmokingAllowed",
    headerName: "Cho phép hút thuốc",
    flex: 1,
    renderCell: (params) =>
      params.row.isSmokingAllowed ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasPrivateKitchen",
    headerName: "Bếp riêng",
    flex: 1,
    renderCell: (params) =>
      params.row.hasPrivateKitchen ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasPrivateBathroom",
    headerName: "Phòng tắm riêng",
    flex: 1,
    renderCell: (params) =>
      params.row.hasPrivateBathroom ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasBalcony",
    headerName: "Ban công",
    flex: 1,
    renderCell: (params) =>
      params.row.hasBalcony ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasLakeView",
    headerName: "View hồ",
    flex: 1,
    renderCell: (params) =>
      params.row.hasLakeView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasGardenView",
    headerName: "View vườn",
    flex: 1,
    renderCell: (params) =>
      params.row.hasGardenView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasPoolView",
    headerName: "View hồ bơi",
    flex: 1,
    renderCell: (params) =>
      params.row.hasPoolView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasMountainView",
    headerName: "View núi",
    flex: 1,
    renderCell: (params) =>
      params.row.hasMountainView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasLandmarkView",
    headerName: "View địa danh",
    flex: 1,
    renderCell: (params) =>
      params.row.hasLandmarkView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasCityView",
    headerName: "View thành phố",
    flex: 1,
    renderCell: (params) =>
      params.row.hasCityView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasRiverView",
    headerName: "View sông",
    flex: 1,
    renderCell: (params) =>
      params.row.hasRiverView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasCourtyardView",
    headerName: "View sân trong",
    flex: 1,
    renderCell: (params) =>
      params.row.hasCourtyardView ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasFreeWifi",
    headerName: "Wifi miễn phí",
    flex: 1,
    renderCell: (params) =>
      params.row.hasFreeWifi ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
  {
    field: "hasSoundproofing",
    headerName: "Cách âm",
    flex: 1,
    renderCell: (params) =>
      params.row.hasSoundproofing ? (
        <span>
          <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
        </span>
      ) : (
        <span>
          <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
        </span>
      ),
  },
];

const BookingPublic = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hotelId = searchParams.get('hotelId');
    const roomId = searchParams.get('roomId');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');

    const [hotelInfo, setHotelInfo] = useState<HotelInfo>();
    const [roomInfo, setRoomInfo] = useState<RoomInfo>();
    const [totalNights, setTotalNights] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [bookingForm, setBookingForm] = useState<BookingForm>({
        id: 0,
        customer: { id: 0 },
        checkInDate: parseInt(checkInDate || '0'),
        checkOutDate: parseInt(checkOutDate || '0'),
        bookingDate: Date.now() / 1000,
        estimatedArrivalTime: undefined,
        isGroup: false,
        totalCost: 0,
        status: BOOKING_STATUS.Pending,
        deposit: 0,
        cancellationPolicy: "Miễn phí hủy trong 12h",
        canceledAt: undefined,
        isGuaranteed: false,
        numberOfAdults: 2,
        numberOfChildren: 0,
        rooms: [],
        consumablesUsed: [],
        equipmentDamagedList: [],
        hotelId: parseInt(hotelId || '0')
    });

    const [customerForm, setCustomerForm] = useState<CustomerForm>({
        id: 0,
        name: "",
        email: "",
        phoneNumber: "",
        gender: undefined,
        birthDay: undefined,
        nationality: "",
        identityNumber: "",
        address: "",
        notes: "",
        hotelId: parseInt(hotelId || '0')
    });

    const [availableRooms, setAvailableRooms] = useState<RoomInfo[]>([]);
    const [openRoomModal, setOpenRoomModal] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<GridColDef[]>(defaultColumns);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const hotel = await getHotelById(parseInt(hotelId || '0'));
                setHotelInfo(hotel);

                const roomAvailable = await getAvailableRooms(parseInt(checkInDate || '0'), parseInt(checkOutDate || '0'), parseInt(hotelId || '0'));
                setAvailableRooms(roomAvailable);
                const room = roomAvailable.find((r: RoomInfo) => r.id === parseInt(roomId || '0'));
                if (!room) {
                    throw new Error('Phòng không khả dụng trong thời gian này');
                }
                setRoomInfo(room);

                const nights = moment.unix(parseInt(checkOutDate || '0'))
                    .diff(moment.unix(parseInt(checkInDate || '0')), 'days');
                setTotalNights(nights);

                setBookingForm(prev => ({
                    ...prev,
                    rooms: [room],
                    totalCost: (room.roomType?.priceToday || room.roomType?.basePricePerNight) * nights
                }));
            } catch (error) {
                toast.error('Không thể tải thông tin đặt phòng');
            }
        };

        fetchInitialData();
    }, [hotelId, roomId, checkInDate, checkOutDate]);

    const handleChangeCustomer = (key: keyof CustomerForm, value: any) => {
        setCustomerForm(prev => ({
            ...prev,
            [key]: value
        }));
    };
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
      setLoading(true);
        try {
            // Validate required fields
            if (!customerForm.name || !customerForm.email || !customerForm.phoneNumber) {
                toast.error('Vui lòng điền đầy đủ thông tin cá nhân');
                return;
            }

            // Validate số người lớn
            if (!bookingForm.numberOfAdults || bookingForm.numberOfAdults < 1) {
                toast.error('Số người lớn phải lớn hơn 0');
                return;
            }

            // Create customer first
            const customerResponse = await createCustomer(customerForm);
            
            // Create booking
            const bookingResponse = await createBooking({
                ...bookingForm,
                customer: { id: customerResponse.id }
            });
            // Save customer and booking info to localStorage after successful booking
            localStorage.setItem('customerInfo', JSON.stringify(customerResponse));
            localStorage.setItem('bookingInfo', JSON.stringify(bookingResponse));
            navigate(PUBLIC_PATHS.ALERT_BOOKING_SUCCESS);
        } catch (error) {
            toast.error('Đặt phòng thất bại');
        } finally {
          setLoading(false);
        }
    };

    const handleDateChange = async (type: 'checkIn' | 'checkOut', timestamp: number) => {
        if (type === 'checkIn') {
            setBookingForm(prev => ({
                ...prev,
                checkInDate: timestamp,
                rooms: [], // Reset phòng đã chọn
                totalCost: 0,
            }));
        } else {
            setBookingForm(prev => ({
                ...prev,
                checkOutDate: timestamp,
                rooms: [], // Reset phòng đã chọn
                totalCost: 0,
            }));
        }
    };

    const fetchAvailableRooms = async (checkIn: number, checkOut: number) => {
        try {
            const rooms = await getAvailableRooms(checkIn, checkOut, parseInt(hotelId || '0'));
            setAvailableRooms(rooms);
        } catch (error) {
            toast.error('Không thể tải danh sách phòng trống');
        }
    };

    return (
        <PublicPage>
            <div className={cx('booking-public')}>
                <div className={cx('booking-form')}>
                    <h2>Thông tin đặt phòng</h2>
                    
                    <div className={cx('form-section')}>
                        <h3>Thông tin khách hàng</h3>
                        <InputText
                            value={customerForm.name}
                            title="Họ và tên *"
                            placeholder="Nhập họ và tên"
                            onChange={(e) => handleChangeCustomer("name", e.target.value)}
                        />
                        <InputText
                            value={customerForm.email}
                            title="Email *"
                            placeholder="Nhập email"
                            onChange={(e) => handleChangeCustomer("email", e.target.value)}
                        />
                        <InputText
                            value={customerForm.phoneNumber}
                            title="Số điện thoại *"
                            placeholder="Nhập số điện thoại"
                            onChange={(e) => handleChangeCustomer("phoneNumber", e.target.value)}
                        />
                        <div className={cx('form-row')}>
                            <GroupRadio
                                title="Giới tính"
                                value={customerForm.gender}
                                onSelect={(value) => handleChangeCustomer("gender", value)}
                                options={[
                                    { value: GENDERS.MALE, label: "Nam" },
                                    { value: GENDERS.FEMALE, label: "Nữ" },
                                    { value: GENDERS.OTHER, label: "Khác" },
                                ]}
                            />
                            <SelectContainer
                                title="Quốc tịch"
                                value={customerForm.nationality}
                                onChange={(value) => handleChangeCustomer("nationality", value)}
                                options={countries.map((country) => ({
                                    value: country.name,
                                    label: country.name,
                                }))}
                            />
                        </div>
                    </div>

                    <div className={cx('form-section')}>
                        <h3>Thời gian lưu trú</h3>
                        <div className={cx('form-row', 'date-row')}>
                            <div className={cx('date-picker')}>
                                <div className={cx('date-inputs')} onClick={() => setShowDatePicker(!showDatePicker)}>
                                    <div className={cx('date-input')}>
                                        <span className={cx('date-label')}>Nhận phòng</span>
                                        <span className={cx('date-value')}>
                                            {bookingForm.checkInDate ? moment.unix(bookingForm.checkInDate).format('DD [tháng] MM') : 'Chọn ngày'}
                                        </span>
                                    </div>
                                    <div className={cx('date-separator')}></div>
                                    <div className={cx('date-input')}>
                                        <span className={cx('date-label')}>Trả phòng</span>
                                        <span className={cx('date-value')}>
                                            {bookingForm.checkOutDate ? moment.unix(bookingForm.checkOutDate).format('DD [tháng] MM') : 'Chọn ngày'}
                                        </span>
                                    </div>
                                </div>
                                {showDatePicker && (
                                    <div className={cx('date-picker-container')}>
                                        <DateRangePicker
                                            ranges={[{
                                                startDate: bookingForm.checkInDate ? moment.unix(bookingForm.checkInDate).toDate() : moment().toDate(),
                                                endDate: bookingForm.checkOutDate ? moment.unix(bookingForm.checkOutDate).toDate() : moment().toDate(),
                                                key: 'selection'
                                            }]}
                                            onChange={(ranges) => {
                                                const selection = ranges.selection;
                                                if (selection) {
                                                    handleDateChange('checkIn', moment(selection.startDate!).unix());
                                                    handleDateChange('checkOut', moment(selection.endDate!).unix());
                                                    const nights = moment(selection.endDate!)
                                                        .diff(moment(selection.startDate!), 'days');
                                                    setTotalNights(nights);
                                                    fetchAvailableRooms(moment(selection.startDate!).unix(), moment(selection.endDate!).unix());
                                                }
                                            }}
                                            showDateDisplay={false}
                                            moveRangeOnFirstSelection={false}
                                            minDate={new Date()}
                                            staticRanges={[]}
                                            inputRanges={[]}
                                        />
                                    </div>
                                )}
                            </div>
                            
                        </div>
                        <div className={cx('time-container')}>
                            <div className={cx("time-picker")}>

                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <TimePicker
                                    label="Giờ dự kiến đến"
                                    value={bookingForm.estimatedArrivalTime ? moment.unix(bookingForm.estimatedArrivalTime) : null}
                                    onChange={(newValue) => {
                                        setBookingForm(prev => ({
                                            ...prev,
                                            estimatedArrivalTime: newValue ? moment(newValue).unix() : undefined
                                        }));
                                    }}
                                    slotProps={{
                                        textField: {
                                            style: { fontSize: '1.6rem' }
                                        }
                                    }}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>

                    <div className={cx('form-section')}>
                        <h3>Thông tin đặt phòng</h3>
                        <div className={cx('form-row')}>
                            <InputText
                                value={bookingForm.numberOfAdults?.toString()}
                                title="Số người lớn *"
                                placeholder="Nhập số người"
                                type="number"
                                onChange={(e) => {
                                    const parsedValue = parseFloat(e.target.value);
                                    setBookingForm(prev => ({
                                        ...prev,
                                        numberOfAdults: isNaN(parsedValue) ? 0 : parsedValue
                                    }));
                                }}
                                suffix="người"
                            />
                            <InputText
                                value={bookingForm.numberOfChildren?.toString()}
                                title="Số trẻ em"
                                placeholder="Nhập số người"
                                type="number"
                                onChange={(e) => {
                                    const parsedValue = parseFloat(e.target.value);
                                    setBookingForm(prev => ({
                                        ...prev,
                                        numberOfChildren: isNaN(parsedValue) ? 0 : parsedValue
                                    }));
                                }}
                                suffix="người"
                            />
                        </div>
                    </div>

                    <div className={cx('form-section')}>
                        <h3>Danh sách phòng đã chọn</h3>
                        {bookingForm.rooms.map((room) => (
                            <div key={room.id} className={cx('room-item')}>
                                <div className={cx('room-info')}>
                                    <span>Phòng {room.roomNumber} - {room.roomType?.name}</span>
                                    <span>
                                        {room.roomType?.priceToday && room.roomType.priceToday !== room.roomType.basePricePerNight ? (
                                            <div>
                                                <span style={{color: '#f7300d', fontSize: '1.6rem'}}>{room.roomType.priceToday.toLocaleString()} VNĐ/đêm</span>
                                                <span style={{textDecoration: 'line-through', fontSize: '1.4rem', color: '#888', marginLeft: '8px'}}>{room.roomType.basePricePerNight?.toLocaleString()} VNĐ/đêm</span>
                                            </div>
                                        ) : (
                                            <span>{room.roomType?.basePricePerNight?.toLocaleString()} VNĐ/đêm</span>
                                        )}
                                    </span>
                                </div>
                                <Button
                                    icon={<RemoveCircleOutline />}
                                    onClick={() => {
                                        const updatedRooms = bookingForm.rooms.filter(r => r.id !== room.id);
                                        const totalCost = updatedRooms.reduce((acc, r) => 
                                            acc + (r.roomType?.priceToday || r.roomType?.basePricePerNight || 0) * totalNights, 0
                                        );
                                        setBookingForm(prev => ({
                                            ...prev,
                                            rooms: updatedRooms,
                                            totalCost
                                        }));
                                        // tính lại đặt cọc
                                        const isGuaranteed = bookingForm.isGuaranteed;
                                        const deposit = isGuaranteed ? (totalCost || 0) * 0.2 : 0;
                                        setBookingForm(prev => ({
                                            ...prev,
                                            deposit
                                        }));
                                    }}
                                    content="Xóa"
                                />
                            </div>
                        ))}
                        <Button
                            icon={<AddCircleOutline />}
                            content="Thêm phòng"
                            onClick={() => {
                                if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
                                    toast.error('Vui lòng chọn ngày nhận và trả phòng');
                                    return;
                                }
                                setOpenRoomModal(true);
                            }}
                        />
                    </div>

                    <div className={cx('form-section')}>
                        <h3>Chi tiết đặt phòng</h3>
                        <div className={cx('booking-details')}>
                            <div className={cx('detail-item')}>
                                <span>Khách sạn:</span>
                                <span>{hotelInfo?.name}</span>
                            </div>
                            <div className={cx('detail-item')}>
                                <span>Phòng:</span>
                                <span>{roomInfo?.roomType?.name} - Số {roomInfo?.roomNumber}</span>
                            </div>
                            <div className={cx('detail-item')}>
                                <span>Ngày nhận phòng:</span>
                                <span>{moment.unix(Number(bookingForm.checkInDate)).format('DD/MM/YYYY')}</span>
                            </div>
                            <div className={cx('detail-item')}>
                                <span>Ngày trả phòng:</span>
                                <span>{moment.unix(Number(bookingForm.checkOutDate)).format('DD/MM/YYYY')}</span>
                            </div>
                            <div className={cx('detail-item')}>
                                <span>Số đêm:</span>
                                <span>{totalNights} đêm</span>
                            </div>
                            <div className={cx('detail-item')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input 
                                        type="checkbox"
                                        id="guaranteedBooking"
                                        checked={bookingForm.isGuaranteed}
                                        onChange={(e) => {
                                            const isGuaranteed = e.target.checked;
                                            const deposit = isGuaranteed ? (bookingForm.totalCost || 0) * 0.2 : 0;
                                            setBookingForm(prev => ({
                                                ...prev,
                                                isGuaranteed,
                                                deposit
                                            }));
                                        }}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                    <label className={cx('guaranteed-label')} htmlFor="guaranteedBooking">Đặt phòng đảm bảo?</label>
                                </div>
                            </div>
                            {bookingForm.isGuaranteed && (
                                <div className={cx('detail-item')}>
                                    <span>Tiền đặt cọc:</span>
                                    <span>{bookingForm.deposit?.toLocaleString() || 0} VNĐ</span>
                                </div>
                            )}
                            <div className={cx('detail-item', 'total-cost')}>
                                <span>Tổng tiền phòng:</span>
                                <span>{bookingForm.totalCost?.toLocaleString() || 0} VNĐ</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('form-actions')}>
                        <Button
                            icon={<SaveOutlined />}
                            content="Xác nhận đặt phòng"
                            onClick={handleSubmit}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            <Dialog
                open={openRoomModal}
                onClose={() => setOpenRoomModal(false)}
                hideBackdrop
                PaperProps={{
                    style: {
                        width: "1000px", 
                        maxWidth: "1000px",
                    },
                }}
            >
                <DialogTitle style={{ fontSize: "1.8rem", textAlign: "center" }}>
                    Danh sách phòng trống từ ngày{" "}
                    {bookingForm.checkInDate
                        ? moment.unix(bookingForm.checkInDate).format("YYYY-MM-DD")
                        : ""}{" "}
                    đến ngày{" "}
                    {bookingForm.checkOutDate
                        ? moment.unix(bookingForm.checkOutDate).format("YYYY-MM-DD") 
                        : ""}
                </DialogTitle>
                <Divider />
                <DialogContent style={{ fontSize: "1.6rem" }}>
                    <ColumnFilter
                        hiddenColumns={hiddenColumns}
                        defaultVisibleColumns={defaultColumns}
                        onChange={(columns) => setVisibleColumns(columns)}
                    />
                    <DataGrid
                        style={{ fontSize: "1.4rem", cursor: "pointer" }}
                        rows={availableRooms}
                        columns={visibleColumns}
                        rowCount={availableRooms.length}
                        disableColumnSorting={true}
                        onRowClick={(params) => {
                            if (bookingForm.rooms.find(r => r.id === params.row.id)) {
                                toast.error('Phòng này đã được chọn');
                                return;
                            }
                            const updatedRooms = [...bookingForm.rooms, params.row];
                            const totalCost = updatedRooms.reduce((acc, r) => 
                                acc + (r.roomType.priceToday || r.roomType.basePricePerNight) * totalNights, 0
                            );
                            setBookingForm(prev => ({
                                ...prev,
                                rooms: updatedRooms,
                                totalCost
                            }));
                            // tính lại đặt cọc
                            const isGuaranteed = bookingForm.isGuaranteed;
                            const deposit = isGuaranteed ? (totalCost || 0) * 0.2 : 0;
                            setBookingForm(prev => ({
                                ...prev,
                                deposit
                            }));
                            setOpenRoomModal(false);
                        }}
                        rowSelection={false}
                        hideFooterPagination={true}
                    />
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        icon={<CloseOutlined />}
                        onClick={() => setOpenRoomModal(false)}
                        content="Đóng"
                    />
                </DialogActions>
            </Dialog>
        </PublicPage>
    );
};

export default BookingPublic;