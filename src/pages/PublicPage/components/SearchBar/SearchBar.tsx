import React, { useState } from 'react';
import moment from 'moment';
import styles from './SearchBar.module.scss';
import classNames from 'classnames/bind';
import { DateRangePicker } from 'react-date-range';
import { DateRange } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Register Vietnamese locale
const cx = classNames.bind(styles);

interface SearchBarProps {
  onSearch: (searchData: {
    location: string;
    checkIn: number;
    checkOut: number;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<number | null>(null);
  const [checkOut, setCheckOut] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSubmit = () => {
    if (location && checkIn && checkOut) {
      if (checkIn >= checkOut) {
        toast.error('Ngày trả phòng phải sau ngày nhận phòng');
        return;
      }
      
      onSearch({
        location,
        checkIn,
        checkOut,
      });
    } else {
      toast.error('Vui lòng nhập địa điểm và chọn ngày nhận phòng và trả phòng');
    }
  };

  return (
    <div className={cx('search-bar')}>
      <div className={cx('search-input')}>
        <input
          type="text"
          placeholder="Nhập địa điểm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <div className={cx('date-picker')}>
        <DateRange fontSize="large"/>
        <div className={cx('date-inputs')} onClick={() => setShowDatePicker(!showDatePicker)}>
          <div className={cx('date-input')}>
            <span className={cx('date-label')}>Nhận phòng</span>
            <span className={cx('date-value')}>
              {checkIn ? moment(checkIn).format('DD [tháng] MM') : 'Chọn ngày'}
            </span>
          </div>
          <div className={cx('date-separator')}></div>
          <div className={cx('date-input')}>
            <span className={cx('date-label')}>Trả phòng</span>
            <span className={cx('date-value')}>
              {checkOut ? moment(checkOut).format('DD [tháng] MM') : 'Chọn ngày'}
            </span>
          </div>
        </div>
        {showDatePicker && (
          <div className={cx('date-picker-container')}>
            <DateRangePicker
              ranges={[{
              startDate: checkIn ? new Date(checkIn) : moment().toDate(),
              endDate: checkOut ? new Date(checkOut) : moment().toDate(),
              key: 'selection'
              }]}
              onChange={(ranges) => {
                const selection = ranges.selection;
                if (selection) {
                  setCheckIn(selection.startDate ? selection.startDate.getTime() : null);
                  setCheckOut(selection.endDate ? selection.endDate.getTime() : null);
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
      <button className={cx('search-button')} onClick={handleSubmit}>
        Tìm kiếm
      </button>
    </div>
  );
}; 

export default SearchBar;