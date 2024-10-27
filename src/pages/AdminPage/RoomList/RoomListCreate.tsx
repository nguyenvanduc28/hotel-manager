import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import { Divider } from "@mui/material";
import styles from "./RoomListCreate.module.scss";
import classNames from "classnames/bind";
import TextArea from "../../../components/TextArea/TextArea";
import SelectContainer from "../../../components/Select/SelectContainer";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { RoomInfoForm } from "../../../types/forms";
import CheckboxMenu from "../../../components/Select/CheckboxMenu";
import {
  createRoom,
  getConsumables,
  getEquipment,
  getRoomTypes,
} from "../../../apis/roomApis/roomApis";
import { useNavigate } from "react-router-dom";
import { Consumables, Equipments, RoomType } from "../../../types/hotel";

type RoomListCreateProps = {};

const cx = classNames.bind(styles);

const options = [
  { value: 1, label: "Option 1" },
  { value: 2, label: "Option 2" },
  { value: 3, label: "Option 3" },
  { value: 4, label: "Option 4" },
];
const RoomListCreate: React.FC<RoomListCreateProps> = ({}) => {
  const [roomTypeData, setRoomTypeData] = useState<RoomType[]>([]);
  const [consumables, setConsumables] = useState<Consumables[]>([]);
  const [equipments, setEquipments] = useState<Equipments[]>([]);
  const [roomForm, setRoomForm] = useState<RoomInfoForm>({
    id:0,
    roomNumber: "",
    floor: undefined,
    isAvailable: true,
    description: "",
    isSmokingAllowed: false,
    roomType: {
      id: 0,
      name: ""
    },
    consumables: undefined,
    equipmentList: undefined,
    hasPrivateKitchen: false,
    hasPrivateBathroom: false,
    hasBalcony: false,
    hasLakeView: false,
    hasGardenView: false,
    hasPoolView: false,
    hasMountainView: false,
    hasLandmarkView: false,
    hasCityView: false,
    hasRiverView: false,
    hasCourtyardView: false,
    hasFreeWifi: true,
    hasSoundproofing: false,
  });
  const navigate = useNavigate();

  const handleChange = (key: keyof RoomInfoForm, value: any) => {
    setRoomForm((prevForm: any) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  const fetchRoomTypes = async () => {
    try {
      const roomTypes = await getRoomTypes();
      setRoomTypeData(roomTypes);
    } catch (error) {
      console.error("Failed to fetch room types:", error);
    }
  };

  const fetchConsumables = async () => {
    try {
      const data = await getConsumables();
      setConsumables(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm tiêu hao:", error);
    }
  };
  const fetchEquipments = async () => {
    try {
      const data = await getEquipment();
      setEquipments(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thiết bị:", error);
    }
  };

  useEffect(() => {
    fetchConsumables();
    fetchEquipments();
    fetchRoomTypes();
  }, []);

  const handleSave = async () => {
    try {
      const result = await createRoom(roomForm);
      console.log("Phòng đã được tạo:", result);
      navigate("/admin/" + ADMIN_PATHS.ROOM_LIST);
    } catch (error) {
      console.error("Lỗi khi tạo phòng:", error);
    }
  };

  return (
    <Container
      title="Thêm phòng mới"
      linkToBack={"/admin/" + ADMIN_PATHS.ROOM_LIST}
      titleToBack="Quay trở lại"
    >
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={roomForm.roomNumber?.toString()}
            title="Số phòng"
            placeholder="Nhập số phòng"
            type="number"
            onChange={(e) =>
              handleChange("roomNumber", parseInt(e.target.value) || undefined)
            }
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={roomForm.floor?.toString()}
            title="Tầng"
            placeholder="Nhập tầng"
            type="number"
            onChange={(e) =>
              handleChange("floor", parseInt(e.target.value) || undefined)
            }
          />
        </div>
      </div>
      <SelectContainer
        title="Loại phòng"
        value={roomForm.roomType.id}
        onChange={(value) => {
          const selectedRoomType = roomTypeData.find(
            (roomType) => roomType.id === value
          );
          handleChange("roomType", selectedRoomType);
        }}
        options={roomTypeData.map((type) => ({
          value: type.id,
          label: type.name,
        }))}
        note="Chọn một loại phòng từ danh sách."
      />
      <div className={cx("amenities")}>
        <div className={cx("amenities-item")}>
          <CheckboxMenu
            title="Danh sách đồ dùng tiêu hao"
            value={roomForm.consumables?.map((consumable) => consumable.id)} 
            onChange={(value) =>
              handleChange(
                "consumables",
                value.map((id) => ({ id }))
              )
            }
            options={consumables.map((cs) => ({
              value: cs.id,
              label: cs.name,
            }))}
          />
        </div>
        <div className={cx("amenities-item")}>
          <CheckboxMenu
            title="Danh sách thiết bị trong phòng"
            value={roomForm.equipmentList?.map((equipment) => equipment.id)} 
            onChange={(value) =>
              handleChange(
                "equipmentList",
                value.map((id) => ({ id }))
              )
            }
            options={equipments.map((eq) => ({
              value: eq.id,
              label: eq.name,
            }))}/>
        </div>
      </div>
      <div className={cx("divider")}>
        <Divider />
      </div>
      <div className={cx("description-detail")}>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.isSmokingAllowed}
            onChange={(e) => handleChange("isSmokingAllowed", e.target.checked)}
          />
          <span>Cho phép hút thuốc</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasPrivateKitchen}
            onChange={(e) =>
              handleChange("hasPrivateKitchen", e.target.checked)
            }
          />
          <span>Bếp riêng</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasPrivateBathroom}
            onChange={(e) =>
              handleChange("hasPrivateBathroom", e.target.checked)
            }
          />
          <span>Phòng tắm riêng</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasBalcony}
            onChange={(e) => handleChange("hasBalcony", e.target.checked)}
          />
          <span>Ban công</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasLakeView}
            onChange={(e) => handleChange("hasLakeView", e.target.checked)}
          />
          <span>View hồ</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasGardenView}
            onChange={(e) => handleChange("hasGardenView", e.target.checked)}
          />
          <span>View vườn</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasPoolView}
            onChange={(e) => handleChange("hasPoolView", e.target.checked)}
          />
          <span>View hồ bơi</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasMountainView}
            onChange={(e) =>
              handleChange("hasMountainView", e.target.checked)
            }
          />
          <span>View núi</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasLandmarkView}
            onChange={(e) =>
              handleChange("hasLandmarkView", e.target.checked)
            }
          />
          <span>View địa danh</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasCityView}
            onChange={(e) => handleChange("hasCityView", e.target.checked)}
          />
          <span>View thành phố</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasRiverView}
            onChange={(e) => handleChange("hasRiverView", e.target.checked)}
          />
          <span>View sông</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasCourtyardView}
            onChange={(e) =>
              handleChange("hasCourtyardView", e.target.checked)
            }
          />
          <span>View sân vườn</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasFreeWifi}
            onChange={(e) => handleChange("hasFreeWifi", e.target.checked)}
          />
          <span>Wifi miễn phí</span>
        </label>
        <label className={cx("option")}>
          <input
            type="checkbox"
            checked={roomForm.hasSoundproofing}
            onChange={(e) =>
              handleChange("hasSoundproofing", e.target.checked)
            }
          />
          <span>Cách âm</span>
        </label>
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
