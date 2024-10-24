import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import InputText from "../../../components/Input/InputText";
import { EQUIPMENT_STATUS } from "../../../constants/admin/constants";
import TextArea from "../../../components/TextArea/TextArea";
import styles from "./RoomAmenityCreate.module.scss";
import classNames from "classnames/bind";
import { Divider } from "@mui/material";
import OptionBar from "../../../components/OptionBar/OptionBar";
import OptionItem from "../../../components/OptionBar/OptionItem";
import { ConsumableForm, EquipmentForm } from "../../../types/forms";
import SelectContainer from "../../../components/Select/SelectContainer";
import { ConsumableCategories, EquipmentCategory } from "../../../types/hotel";

type RoomAmenityCreateProps = {};
const cx = classNames.bind(styles);

const RoomAmenityCreate: React.FC<RoomAmenityCreateProps> = ({}) => {
  const [tab, setTab] = useState<string>("consumable");
  const [consumable, setConsumable] = useState<ConsumableForm>({
    id: 0,
    name: undefined,
    consumableCategoryId: 0,
    price: 0,
    quantity: 1,
    unit: "sản phẩm",
    barcode: undefined,
    expiryDate: undefined,
    description: undefined,
  });
  const [equipment, setEquipment] = useState<EquipmentForm>({
    id: 0,
    name: undefined,
    equipmentCategoryId: 0,
    barcode: undefined,
    installationDate: undefined,
    status: EQUIPMENT_STATUS.WORKING,
    description: undefined,
  });
  const [consumableCategories, setConsumableCategories] = useState<
    ConsumableCategories[]
  >([
    { id: 1, name: "Hoa quả", description: "" },
    { id: 2, name: "Nước ngọt", description: "" },
    { id: 3, name: "Khăn lau", description: "" },
    { id: 4, name: "Đồ ăn", description: "" },
    { id: 5, name: "Nước trái cây", description: "" },
  ]);
  const [equipmentCategories, setEquipmentCategories] = useState<
    EquipmentCategory[]
  >([
    { id: 1, name: "Tivi", description: "" },
    { id: 2, name: "Tủ lạnh", description: "" },
    { id: 3, name: "Bàn", description: "" },
    { id: 4, name: "Ghế", description: "" },
    { id: 5, name: "Điều hòa", description: "" },
  ]);
  const handleChange = (key: string, value: any) => {
    if (tab === "consumable") {
      setConsumable((prev) => ({
        ...prev,
        [key]: value,
      }));
    } else if (tab === "equipment") {
      setEquipment((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // Call API to save amenity
  const handleSave = () => {
    if (tab === "consumable") {
      console.log("Consumable", consumable);
    } else if (tab === "equipment") {
      console.log("equipment", equipment);
    }
  };

  const handleSelectConsumableTab = () => {
    setTab("consumable");
  };

  const handleSelectEquipmentTab = () => {
    setTab("equipment");
  };

  return (
    <Container
      title="Thêm tiện ích"
      linkToBack={"/admin/" + ADMIN_PATHS.ROOM_AMENITIES}
      titleToBack="Quay trở lại"
    >
      <div className={cx("tab")}>
        <OptionBar>
          <OptionItem
            title="Đồ dùng tiêu hao"
            onClick={handleSelectConsumableTab}
            active={tab === "consumable"}
          />
          <OptionItem
            title="Thiết bị"
            onClick={handleSelectEquipmentTab}
            active={tab === "equipment"}
          />
        </OptionBar>
      </div>
      <InputText
        value={tab === "consumable" ? consumable.name : equipment.name}
        title="Tên sản phẩm"
        placeholder="Nhập tên sản phẩm"
        onChange={(e) => {
          handleChange("name", e.target.value);
        }}
      />
      <InputText
        value={tab === "consumable" ? consumable.barcode : equipment.barcode}
        title="Mã sản phẩm"
        placeholder="Nhập mã sản phẩm"
        onChange={(e) => {
          handleChange("barcode", e.target.value);
        }}
      />
      <SelectContainer
        title="Loại phòng"
        value={
          tab == "consumable"
            ? consumable.consumableCategoryId
            : equipment.equipmentCategoryId
        }
        onChange={(value) => {
          tab == "consumable"
            ? handleChange("consumableCategoryId", value)
            : handleChange("equipmentCategoryId", value);
        }}
        options={
          tab == "consumable"
            ? consumableCategories.map((consumableCate) => ({
                value: consumableCate.id,
                label: consumableCate.name,
              }))
            : equipmentCategories.map((equipmentCate) => ({
                value: equipmentCate.id,
                label: equipmentCate.name,
              }))
        }
      />
      {tab === "consumable" && (
        <>
          <div className={cx("divider")}>
            <Divider />
          </div>
          <div className={cx("box")}>
            <div className={cx("box-item")}>
              <InputText
                value={consumable.quantity?.toString()}
                title="Số lượng: "
                placeholder="Nhập số lượng sản phẩm"
                variant="inline-group"
                type="number"
                onChange={(e) => {
                  const parsedValue = parseFloat(e.target.value);
                  handleChange(
                    "quantity",
                    isNaN(parsedValue) ? 0 : parsedValue
                  );
                }}
                suffix={consumable.unit}
              />
            </div>
            <div className={cx("box-item")}>
              <InputText
                value={consumable.unit}
                title="Đơn vị"
                placeholder="Nhập đơn vị"
                variant="inline-group"
                onChange={(e) => {
                  handleChange("unit", e.target.value);
                }}
              />
            </div>
          </div>
          <div className={cx("box")}>
            <div className={cx("box-item")}>
              <InputText
                value={consumable.price?.toString()}
                variant="inline-group"
                title="Giá bán"
                placeholder="Nhập giá bán"
                type="number"
                onChange={(e) => {
                  const parsedValue = parseFloat(e.target.value);
                  handleChange("price", isNaN(parsedValue) ? 0 : parsedValue);
                }}
                suffix="₫"
                note="*Giá bán của mỗi đơn vị sản phẩm"
              />
            </div>
            <div className={cx("box-item")}>
              <InputText
                value={
                  consumable.expiryDate
                    ? new Date(consumable.expiryDate * 1000)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                variant="inline-group"
                title="Ngày hết hạn"
                type="date"
                onChange={(e) => {
                  const timestamp = new Date(e.target.value).getTime() / 1000; // Chia cho 1000 để chuyển đổi sang giây
                  handleChange("expiryDate", timestamp);
                }}
              />
            </div>
          </div>
        </>
      )}
      <div className={cx("divider")}>
        <Divider />
      </div>
      <TextArea
        title="Mô tả"
        value={
          tab === "consumable" ? consumable.description : equipment.description
        }
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Nhập mô tả"
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

export default RoomAmenityCreate;
