import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import GroupRadio from "../../../components/GroupRadio/GroupRadio";
import { Divider } from "@mui/material";
import styles from "./RoomListCreate.module.scss";
import classNames from "classnames/bind";
import TextArea from "../../../components/TextArea/TextArea";
import SelectContainer from "../../../components/Select/SelectContainer";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { ROOM_STATUS } from "../../../constants/admin/constants";
import { RoomInfoForm } from "../../../types/forms";

type RoomListCreateProps = {};

const cx = classNames.bind(styles);

const roomTypeData = [
  {
    id: 1,
    name: "Phòng tiêu chuẩn",
    description: "Phòng tiêu chuẩn có đầy đủ tiện nghi.",
    single_bed_count: 1,
    double_bed_count: 1,
    extra_bed_available: true,
    size: 25,
    max_occupancy: 3,
    base_price_per_night: 500000,
  },
  {
    id: 2,
    name: "Phòng Deluxe",
    description: "Phòng rộng rãi với tầm nhìn đẹp.",
    single_bed_count: 0,
    double_bed_count: 2,
    extra_bed_available: true,
    size: 35,
    max_occupancy: 4,
    base_price_per_night: 800000,
  },
];
const amenitiesData = [
  {
    id: 1,
    name: "Tủ lạnh",
    numberInUse: 20,
    inventoryNumber: 30,
  },
  {
    id: 2,
    name: "Máy lạnh",
    numberInUse: 15,
    inventoryNumber: 25,
  },
  {
    id: 3,
    name: "Ti vi",
    numberInUse: 10,
    inventoryNumber: 20,
  },
  {
    id: 4,
    name: "Bếp gas",
    numberInUse: 5,
    inventoryNumber: 10,
  },
  {
    id: 5,
    name: "Máy giặt",
    numberInUse: 12,
    inventoryNumber: 15,
  },
  {
    id: 6,
    name: "Lò vi sóng",
    numberInUse: 8,
    inventoryNumber: 10,
  },
  {
    id: 7,
    name: "Máy sấy",
    numberInUse: 3,
    inventoryNumber: 7,
  },
  {
    id: 8,
    name: "Tủ đông",
    numberInUse: 4,
    inventoryNumber: 8,
  },
  {
    id: 9,
    name: "Máy pha cà phê",
    numberInUse: 6,
    inventoryNumber: 10,
  },
  {
    id: 10,
    name: "Quạt",
    numberInUse: 11,
    inventoryNumber: 15,
  },
  {
    id: 11,
    name: "Máy chiếu",
    numberInUse: 2,
    inventoryNumber: 5,
  },
  {
    id: 12,
    name: "Máy lạnh di động",
    numberInUse: 7,
    inventoryNumber: 12,
  },
  {
    id: 13,
    name: "Đầu DVD",
    numberInUse: 1,
    inventoryNumber: 3,
  },
  {
    id: 14,
    name: "Bàn là",
    numberInUse: 9,
    inventoryNumber: 15,
  },
  {
    id: 15,
    name: "Nồi cơm điện",
    numberInUse: 10,
    inventoryNumber: 12,
  },
  {
    id: 16,
    name: "Máy làm mát",
    numberInUse: 5,
    inventoryNumber: 8,
  },
  {
    id: 17,
    name: "Máy ép trái cây",
    numberInUse: 2,
    inventoryNumber: 4,
  },
  {
    id: 18,
    name: "Tủ sách",
    numberInUse: 3,
    inventoryNumber: 5,
  },
  {
    id: 19,
    name: "Tủ giày",
    numberInUse: 4,
    inventoryNumber: 6,
  },
  {
    id: 20,
    name: "Bộ đồ ăn",
    numberInUse: 15,
    inventoryNumber: 20,
  },
];
const options = [
  { value: 1, label: "Option 1" },
  { value: 2, label: "Option 2" },
  { value: 3, label: "Option 3" },
];
const RoomListCreate: React.FC<RoomListCreateProps> = ({}) => {
  const [roomForm, setRoomForm] = useState<RoomInfoForm>({
    roomNumber: undefined,
    floor: undefined,
    isAvailable: true,
    currentStatus: ROOM_STATUS.AVAILABLE,
    description: "",
    isSmokingAllowed: false,
    roomTypeId: undefined,
    amenitiesId: undefined,
  });
  const [selectedValue, setSelectedValue] = useState<string | number>("");

  const handleChange = (key: keyof RoomInfoForm, value: any) => {
    setRoomForm((prevForm: any) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleSave = () => {
    console.log(roomForm);
  };

  return (
    <Container
      title="Thêm phòng mới"
      linkToBack={"/admin/" + ADMIN_PATHS.ROOM_LIST}
      titleToBack="Quay trở lại"
    >
      <InputText
        value={roomForm.roomNumber?.toString()}
        title="Số phòng"
        placeholder="Nhập số phòng"
        type="number"
        onChange={(e) =>
          handleChange("roomNumber", parseInt(e.target.value) || undefined)
        }
      />
      <InputText
        value={roomForm.floor?.toString()}
        title="Tầng"
        placeholder="Nhập tầng"
        type="number"
        onChange={(e) =>
          handleChange("floor", parseInt(e.target.value) || undefined)
        }
      />
      <SelectContainer
        title="Loại phòng"
        value={roomForm.roomTypeId}
        onChange={(value) => handleChange("roomTypeId", value)}
        options={roomTypeData.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
        note="Chọn một loại phòng từ danh sách."
      />
      <GroupRadio
        onSelect={(value) => handleChange("isSmokingAllowed", value === "true")}
        value={roomForm.isSmokingAllowed?.toString()}
        title="Cho phép hút thuốc?"
        numOfRow={2}
        options={[
          { label: "Có", value: "true" },
          { label: "Không", value: "false" },
        ]}
      />
      <div className={cx("divider")}>
        <Divider />
      </div>
      <TextArea
        title="Mô tả"
        value={roomForm.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Nhập mô tả phòng"
      />
      <div className={cx("button-save")}>
        <Button
          icon={<SaveOutlinedIcon />}
          content="Lưu"
          onClick={handleSave}
        />
      </div>
    </Container>
  );
};

export default RoomListCreate;
