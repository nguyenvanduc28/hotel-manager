import React, { useEffect, useState } from "react";
import { getRoomTypesWithPriceInRange } from "../../../apis/roomApis/roomApis";
import { RoomType } from "../../../types/hotel";
import moment from "moment";
import { DateRangePicker } from 'react-date-range';
import styles from "./RoomPrice.module.scss";
import classNames from "classnames/bind";
import Container from "../../../components/Container/Container";
import PriceEditor from './PriceEditor';

const cx = classNames.bind(styles);
const RoomPrice = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [startDate, setStartDate] = useState(moment().startOf('day'));
  const [endDate, setEndDate] = useState(moment().add(20, 'days').startOf('day'));
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const roomTypesData = await getRoomTypesWithPriceInRange(startDate.unix(), endDate.unix());
        setRoomTypes(roomTypesData);
      } catch (error) {
        console.error("Failed to fetch room types with prices:", error);
      }
    };

    fetchRoomTypes();
  }, [startDate, endDate]);

  const handleDateRangeChange = (item: any) => {
    setStartDate(moment(item.selection.startDate).startOf('day'));
    setEndDate(moment(item.selection.endDate).startOf('day'));
    setShowDatePicker(false);
  };


  const handleEditorSave = async () => {
    const roomTypesData = await getRoomTypesWithPriceInRange(startDate.unix(), endDate.unix());
    setRoomTypes(roomTypesData);
  };

  return (
    <Container fullscreen title="Giá phòng">
      <div className={cx("container")}>
        <button className={cx("dateRangeButton")} onClick={() => setShowDatePicker(!showDatePicker)}>
          Select Date Range
        </button>
        {showDatePicker && (
          <div className={cx("dateRangePicker")}>
            <DateRangePicker
              ranges={[{
                startDate: startDate.toDate(),
                endDate: endDate.toDate(),
                key: 'selection'
              }]}
              onChange={handleDateRangeChange}
              minDate={new Date()}
              staticRanges={[]}
              inputRanges={[]}
            />
          </div>
        )}
        <div className={cx("tableContainer")}>
          <table className={cx("priceTable")}>
            <thead>
              <tr>
                <th className={cx("roomTypeHeader")}>Room Type</th>
                {Array.from({ length: endDate.diff(startDate, 'days') }, (_, i) => {
                  const date = startDate.clone().add(i, 'days');
                  return (
                    <th key={date.format('YYYY-MM-DD')} className={cx("dateHeader")}>
                      {date.format('DD/MM')}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {roomTypes.map(roomType => (
                <tr key={roomType.id}>
                  <td className={cx("roomTypeName")}>{roomType.name}</td>
                  {Array.from({ length: endDate.diff(startDate, 'days') }, (_, i) => {
                    const date = startDate.clone().add(i, 'days');
                    
                    return (
                      <td 
                        key={date.format('YYYY-MM-DD')} 
                        className={cx("priceCell")}
                      >
                        <PriceEditor
                          basePricePerNight={roomType.basePricePerNight || 0}
                          onSave={handleEditorSave}
                          value={roomType.roomPrices?.find(p => 
                            moment.unix(p.date || 0).isSame(date, 'day')
                          )}
                          roomTypeId={roomType.id || 0}
                          date={date.unix()}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default RoomPrice;
