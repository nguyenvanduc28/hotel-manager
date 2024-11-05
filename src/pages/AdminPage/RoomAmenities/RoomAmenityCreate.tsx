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
  createConsumableList,
  createEquipmentList,
} from "../../../apis/roomApis/roomApis"; // Nhớ import hàm API
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useFormValidation } from "../../../hooks/useFormValidation";
import { read, utils, writeFileXLSX } from 'xlsx';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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

  const validationRules = {
    name: [
      {
        validate: (value: any) => value !== undefined && value.trim() !== "",
        message: "Tên sản phẩm không được để trống",
      },
    ],
    barcode: [
      {
        validate: (value: any) => value !== undefined && value.trim() !== "",
        message: "Mã sản phẩm không được để trống",
      },
    ],
    consumableCategory: [
      {
        validate: (value: any) => tab !== "consumable" || value.id && value.id !== 0,
        message: "Vui lòng chọn danh mục",
      },
    ],
    equipmentCategory: [
      {
        validate: (value: any) => tab !== "equipment" || value.id && value.id !== 0,
        message: "Vui lòng chọn danh mục",
      },
    ],
    price: [
      {
        validate: (value: any) => tab !== "consumable" || value >= 0,
        message: "Giá bán không được âm",
      },
    ],
    quantity: [
      {
        validate: (value: any) => tab !== "consumable" || value > 0,
        message: "Số lượng phải lớn hơn 0",
      },
    ],
  };

  const { errors, validateForm, confirmSave } = useFormValidation(validationRules);

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
    const dataToValidate = tab === "consumable" ? consumable : equipment;
    if (!validateForm(dataToValidate)) {
      return;
    }

    try {
      await confirmSave(async () => {
        if (tab === "consumable") {
          await createConsumable(consumable);
        } else if (tab === "equipment") {
          await createEquipment(equipment);
        }
        navigate(`/admin/${ADMIN_PATHS.ROOM_AMENITIES}`);
      });
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

  const handleExportTemplate = () => {
    const template = tab === "consumable" 
      ? [
          {
            name: "Tên sản phẩm (*)",
            barcode: "Mã sản phẩm (*)",
            categoryId: "Mã danh mục (*) - Tham khảo sheet Danh mục",
            quantity: "Số lượng (*)",
            unit: "Đơn vị",
            price: "Giá bán (*)",
            expiryDate: "Ngày hết hạn (DD/MM/YYYY)",
            description: "Mô tả"
          }
        ]
      : [
          {
            name: "Tên thiết bị (*)",
            barcode: "Mã thiết bị (*)",
            categoryId: "Mã danh mục (*) - Tham khảo sheet Danh mục",
            installationDate: "Ngày lắp đặt (DD/MM/YYYY)",
            description: "Mô tả"
          }
        ];

    const categoryList = tab === "consumable"
      ? consumableCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description
        }))
      : equipmentCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description
        }));

    const wb = utils.book_new();
    
    const ws_template = utils.json_to_sheet(template);
    utils.book_append_sheet(wb, ws_template, "Template");
    
    const ws_category = utils.json_to_sheet(categoryList);
    utils.book_append_sheet(wb, ws_category, "Danh mục");

    const fileName = `${tab}_template.xlsx`;
    writeFileXLSX(wb, fileName);
  };

  const validateExcelData = (data: any[]) => {
    const errors: string[] = [];
    
    data.forEach((row, index) => {
      if (!row.name) errors.push(`Dòng ${index + 3}: Thiếu tên sản phẩm`);
      if (!row.barcode) errors.push(`Dòng ${index + 3}: Thiếu mã sản phẩm`);
      
      if (!row.categoryId) {
        errors.push(`Dòng ${index + 3}: Thiếu mã danh mục`);
      } else {
        const categoryExists = tab === "consumable"
          ? consumableCategories.some(cat => cat.id === Number(row.categoryId))
          : equipmentCategories.some(cat => cat.id === Number(row.categoryId));
        
        if (!categoryExists) {
          errors.push(`Dòng ${index + 3}: Mã danh mục không tồn tại`);
        }
      }

      if (tab === "consumable") {
        if (isNaN(Number(row.quantity)) || Number(row.quantity) <= 0) {
          errors.push(`Dòng ${index + 3}: Số lượng không hợp lệ`);
        }

        const price = Number(row.price?.replace(/,/g, ''));
        if (isNaN(price) || price < 0) {
          errors.push(`Dòng ${index + 3}: Giá không hợp lệ`);
        }

        if (row.expiryDate && !moment(row.expiryDate, "DD/MM/YYYY", true).isValid()) {
          errors.push(`Dòng ${index + 3}: Ngày hết hạn không hợp lệ (định dạng DD/MM/YYYY)`);
        }
      } else {
        if (row.installationDate && !moment(row.installationDate, "DD/MM/YYYY", true).isValid()) {
          errors.push(`Dòng ${index + 3}: Ngày lắp đặt không hợp lệ (định dạng DD/MM/YYYY)`);
        }
      }
    });

    return errors;
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      const jsonData = utils.sheet_to_json(worksheet, { 
        range: 2,
        header: tab === "consumable" 
          ? ["name", "barcode", "categoryId", "quantity", "unit", "price", "expiryDate", "description"]
          : ["name", "barcode", "categoryId", "installationDate", "description"],
        raw: false
      });

      if (jsonData.length === 0) {
        alert("File Excel không có dữ liệu!");
        return;
      }

      console.log("Dữ liệu đọc được:", jsonData);

      const validationErrors = validateExcelData(jsonData);
      if (validationErrors.length > 0) {
        alert(`Lỗi trong file Excel:\n${validationErrors.join('\n')}`);
        return;
      }

      if (tab === "consumable") {
        const consumables: ConsumableForm[] = jsonData.map((row: any) => ({
          ...consumable,
          name: row.name,
          barcode: row.barcode,
          consumableCategory: { id: Number(row.categoryId), name: "", description: "" },
          quantity: Number(row.quantity),
          unit: row.unit || "sản phẩm",
          price: Number(row.price?.replace(/,/g, '')),
          expiryDate: row.expiryDate ? moment(row.expiryDate, "DD/MM/YYYY").unix() : undefined,
          description: row.description || ""
        }));
        await createConsumableList(consumables);
      } else {
        const equipments: EquipmentForm[] = jsonData.map((row: any) => ({
          ...equipment,
          name: row.name,
          barcode: row.barcode,
          equipmentCategory: { id: Number(row.categoryId), name: "", description: "" },
          installationDate: row.installationDate ? moment(row.installationDate, "DD/MM/YYYY").unix() : undefined,
          description: row.description || ""
        }));
        await createEquipmentList(equipments);
      }

      alert("Import thành công!");
      navigate(`/admin/${ADMIN_PATHS.ROOM_AMENITIES}`);
    } catch (error) {
      console.error("Lỗi khi import:", error);
      alert("Import thất bại!");
    }
  };

  return (
    <Container
      title="Thêm tiện ích"
      linkToBack={"/admin/" + ADMIN_PATHS.ROOM_AMENITIES}
      titleToBack="Quay trở lại"
    >
      <div className={cx("tab-container")}>
        <div className={cx("tab-header")}>
          <div className={cx("tab-options")}>
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

          <div className={cx("excel-buttons")}>
            <Button
              icon={<FileDownloadIcon />}
              onClick={handleExportTemplate}
              content="Tải template Excel"
            />
            <input
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              id="excel-upload"
              onChange={handleImportExcel}
            />
            <label htmlFor="excel-upload">
              <Button
                icon={<FileUploadIcon />}
                content="Import Excel"
                component="span"
              />
            </label>
          </div>
        </div>
        
        <InputText
          value={tab === "consumable" ? consumable.name : equipment.name}
          title="Tên sản phẩm"
          placeholder="Nhập tên sản phẩm"
          onChange={(e) => {
            handleChange("name", e.target.value);
          }}
          error={errors.name}
        />
        <InputText
          value={tab === "consumable" ? consumable.barcode : equipment.barcode}
          title="Mã sản phẩm"
          placeholder="Nhập mã sản phẩm"
          onChange={(e) => {
            handleChange("barcode", e.target.value);
          }}
          error={errors.barcode}
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
          error={tab === "consumable" ? errors.consumableCategory : errors.equipmentCategory}
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
                  error={errors.quantity}
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
                  error={errors.price}
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
      </div>
    </Container>
  );
};

export default RoomAmenityCreate;
