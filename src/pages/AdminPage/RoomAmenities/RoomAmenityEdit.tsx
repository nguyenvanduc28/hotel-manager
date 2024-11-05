import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import TextArea from "../../../components/TextArea/TextArea";
import styles from "./RoomAmenityEdit.module.scss";
import classNames from "classnames/bind";
import SelectContainer from "../../../components/Select/SelectContainer";
import { ConsumableForm, EquipmentForm } from "../../../types/forms";
import { getConsumableById, getEquipmentById, updateConsumable, updateEquipment } from "../../../apis/roomApis/roomApis";
import { ConsumableCategories, EquipmentCategory } from "../../../types/hotel";
import { getConsumableCategories, getEquipmentCategories } from "../../../apis/roomApis/roomApis";
import moment from "moment";
import { EQUIPMENT_STATUS } from "../../../constants/admin/constants";
import { Divider } from "@mui/material";

const cx = classNames.bind(styles);

const RoomAmenityEdit: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const isConsumable = type === "consumable";
  const navigate = useNavigate();

  const [consumable, setConsumable] = useState<ConsumableForm>({
    id: parseInt(id || "0", 10),
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
    id: parseInt(id || "0", 10),
    name: "",
    equipmentCategory: { id: 0, name: "", description: "" },
    room: undefined,
    barcode: undefined,
    installationDate: undefined,
    status: EQUIPMENT_STATUS.AVAILABLE,
    description: "",
  });

  const [initialData, setInitialData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [categories, setCategories] = useState<ConsumableCategories[] | EquipmentCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isConsumable) {
          const [data, categories] = await Promise.all([
            getConsumableById(parseInt(id || "0", 10)),
            getConsumableCategories(),
          ]);
          setConsumable(data);
          setCategories(categories);
          setInitialData(data);
        } else {
          const [data, categories] = await Promise.all([
            getEquipmentById(parseInt(id || "0", 10)),
            getEquipmentCategories(),
          ]);
          setEquipment(data);
          setCategories(categories);
          setInitialData(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [id, isConsumable]);

  const handleChange = (key: string, value: any) => {
    if (isConsumable) {
      setConsumable((prev) => {
        const updatedData = { ...prev, [key]: value };
        setIsChanged(JSON.stringify(updatedData) !== JSON.stringify(initialData));
        return updatedData;
      });
    } else {
      setEquipment((prev) => {
        const updatedData = { ...prev, [key]: value };
        setIsChanged(JSON.stringify(updatedData) !== JSON.stringify(initialData));
        return updatedData;
      });
    }
  };

  const handleSave = async () => {
    try {
      if (isConsumable) {
        await updateConsumable(consumable);
      } else {
        await updateEquipment(equipment);
      }
      navigate("/admin/room-amenities");
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    }
  };

  return (
    <Container
      title="Chỉnh sửa tiện ích"
      linkToBack="/admin/room-amenities"
      titleToBack="Quay trở lại"
    >
      <InputText
        value={isConsumable ? consumable.name : equipment.name}
        title="Tên sản phẩm"
        placeholder="Nhập tên sản phẩm"
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <InputText
        value={isConsumable ? consumable.barcode : equipment.barcode}
        title="Mã sản phẩm"
        placeholder="Nhập mã sản phẩm"
        onChange={(e) => handleChange("barcode", e.target.value)}
      />
      <SelectContainer
        title="Danh mục"
        value={isConsumable ? consumable.consumableCategory?.id : equipment.equipmentCategory?.id}
        onChange={(value) => {
          const selectedCategory = categories.find((category) => category.id === value);
          handleChange(isConsumable ? "consumableCategory" : "equipmentCategory", selectedCategory);
        }}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
      />
      {isConsumable && (
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
      {!isConsumable && (
        <InputText
          value={equipment.installationDate ? moment.unix(equipment.installationDate).format("YYYY-MM-DD") : ""}
          title="Ngày lắp đặt"
          type="date"
          onChange={(e) => handleChange("installationDate", moment(e.target.value).unix())}
        />
      )}
      <div className={cx("divider")}>
        <Divider />
      </div>
      <TextArea
        title="Mô tả"
        value={isConsumable ? consumable.description : equipment.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Nhập mô tả"
      />
      <div className={cx("button-save")}>
        <Button
          icon={<SaveOutlinedIcon />}
          onClick={handleSave}
          content="Lưu"
          disabled={!isChanged}
        />
      </div>
    </Container>
  );
};

export default RoomAmenityEdit;
