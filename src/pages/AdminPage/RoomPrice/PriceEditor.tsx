import React, { useState } from 'react';
import styles from "./PriceEditor.module.scss";
import classNames from "classnames/bind";
import { RoomPrice, RoomType } from '../../../types/hotel';
import { updatePriceRoomType } from '../../../apis/roomApis/roomApis';
import moment from 'moment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { toast } from 'react-toastify';
const cx = classNames.bind(styles);

interface PriceEditorProps {
  basePricePerNight: number;
  onSave: () => void;
  value: RoomPrice | undefined;
  roomTypeId: number;
  date: number;
}

const PriceEditor: React.FC<PriceEditorProps> = ({ basePricePerNight, onSave, value, roomTypeId, date }) => {
  const [isEditing, setIsEditing] = useState(false);


  const [price, setPrice] = useState(value?.price || basePricePerNight);

  const handleSave = async () => {
    try {
      const payload: RoomPrice = {
        roomTypeId: value?.roomTypeId || roomTypeId,
        date: value?.date ? moment.unix(value.date).startOf('day').unix() : date,
        price: price
      };
      
      await updatePriceRoomType(payload);
      setIsEditing(false);
      onSave();
    } catch (error) {
      console.error('Failed to update price:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    isEditing ? (
      <div className={cx("priceEditor")}>
        <div className={cx("input-container")}>
        <input
          type="number"
          className={cx("text")}
          value={price}
          onChange={(e) => {
            setPrice(Number(e.target.value));
            if (Number(e.target.value) < 0) {
              setPrice(0);
            }
            if (Number(e.target.value) > basePricePerNight) {
              setPrice(basePricePerNight);
              toast.error("Giá phòng không thể lớn hơn giá phòng cơ bản");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
        <span className={cx("suffix")}>VND</span>
        <IconButton onClick={handleSave} className={cx("iconButton", "save")}>
          <CheckIcon />
        </IconButton>
        <IconButton onClick={handleCancel} className={cx("iconButton", "cancel")}>
          <CloseIcon />
        </IconButton>
        </div>
      </div>
    ) : (
      <div className={cx("priceEditor")} onClick={() => setIsEditing(true)}>
        {value?.price ? value?.price.toLocaleString() : "_"}
      </div>
    )
  );
};

export default PriceEditor; 