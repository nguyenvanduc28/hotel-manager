import React, { useState, useEffect } from "react";
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
import {
  createConsumable,
  createEquipment,
  getConsumableCategories,
  getEquipmentCategories,
} from "../../../apis/roomApis/roomApis"; // Nhớ import hàm API
import { useNavigate } from "react-router-dom";
import moment from "moment";

type RoomAmenityCreateProps = {};
const cx = classNames.bind(styles);

const RoomAmenityCreate: React.FC<RoomAmenityCreateProps> = ({}) => {
  const [tab, setTab] = useState<string>("consumable");
  const [consumable, setConsumable] = useState<ConsumableForm>({
    id: 0,
    name: "",
    consumableCategory: { id: 0, name: "", description: "" },
    price: 0,
    room: undefined,
    quantity: 1,
    unit: "sản phẩm",
    barcode: undefined,
    expiryDate: undefined,
    description: "",
  });

  const [equipment, setEquipment] = useState<EquipmentForm>({
    id: 0,
    name: "",
    equipmentCategory: { id: 0, name: "", description: "" },
    room: undefined,
    barcode: undefined,
    installationDate: undefined,
    status: EQUIPMENT_STATUS.AVAILABLE,
    description: "",
  });

  const [consumableCategories, setConsumableCategories] = useState<
    ConsumableCategories[]
  >([]);
  const [equipmentCategories, setEquipmentCategories] = useState<
    EquipmentCategory[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const consumables = await getConsumableCategories();
        const equipments = await getEquipmentCategories();
        setConsumableCategories(consumables);
        setEquipmentCategories(equipments);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

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

  const handleSave = async () => {
    try {
      if (tab === "consumable") {
        await createConsumable(consumable);
      } else if (tab === "equipment") {
        await createEquipment(equipment);
      }
      navigate(`/admin/${ADMIN_PATHS.ROOM_AMENITIES}`);
    } catch (error) {
      console.error("Lưu tiện ích thất bại:", error);
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
        title="Danh mục"
        value={
          tab === "consumable"
            ? consumable.consumableCategory?.id
            : equipment.equipmentCategory?.id
        }
        onChange={(value) => {
          if (tab === "consumable") {
            const selectedCategory = consumableCategories.find(
              (category) => category.id === value
            );
            handleChange("consumableCategory", selectedCategory);
          } else {
            const selectedCategory = equipmentCategories.find(
              (category) => category.id === value
            );
            handleChange("equipmentCategory", selectedCategory);
          }
        }}
        options={
          tab === "consumable"
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
                note="*Giá bán của mỗi đơn vị sản phẩm. (Đặt là 0 nếu sản phẩm miễn phí)"
              />
            </div>
            <div className={cx("box-item")}>
              <InputText
                value={
                  consumable.expiryDate
                    ? moment.unix(consumable.expiryDate).format("YYYY-MM-DD")
                    : ""
                }
                variant="inline-group"
                title="Ngày hết hạn"
                type="date"
                onChange={(e) => {
                  const timestamp = moment(e.target.value, "YYYY-MM-DD").unix(); // Chuyển đổi giá trị ngày về timestamp
                  handleChange("expiryDate", timestamp);
                }}
              />
            </div>
          </div>
        </>
      )}
      {tab == "equipment" && (
        <InputText
        value={
          equipment.installationDate
            ? moment.unix(equipment.installationDate).format("YYYY-MM-DD")
            : ""
        }
        variant="inline-group"
        title="Ngày lắp đặt"
        type="date"
        onChange={(e) => {
          const timestamp = moment(e.target.value, "YYYY-MM-DD").unix(); // Chuyển đổi giá trị ngày về timestamp
          handleChange("installationDate", timestamp);
        }}
      />
      
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
          onClick={handleSave}
          content="Lưu"
        />
      </div>
    </Container>
  );
};

export default RoomAmenityCreate;
