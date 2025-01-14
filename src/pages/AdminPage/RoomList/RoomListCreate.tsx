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
  getConsumablesAvailable,
  getEquipment,
  getEquipmentAvailable,
  getRoomTypes,
} from "../../../apis/roomApis/roomApis";
import { useNavigate } from "react-router-dom";
import { Consumables, Equipments, RoomType } from "../../../types/hotel";
import { useFormValidation } from "../../../hooks/useFormValidation";
import { uploadMultipleImages } from "../../../apis/imageApis/imageApis";
import { toast } from "react-toastify";

type RoomListCreateProps = {};

const cx = classNames.bind(styles);


const RoomListCreate: React.FC<RoomListCreateProps> = ({}) => {
  const [roomTypeData, setRoomTypeData] = useState<RoomType[]>([]);
  const [consumables, setConsumables] = useState<Consumables[]>([]);
  const [equipments, setEquipments] = useState<Equipments[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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
    size: 0,
    consumables: [],
    equipmentList: [],
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
    imageList: [],
  });
  const navigate = useNavigate();

  const validationRules = {
    roomNumber: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Số phòng không được để trống",
      },
      {
        validate: (value: any) => value > 0,
        message: "Số phòng phải lớn hơn 0",
      },
    ],
    floor: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Tầng không được để trống",
      },
      {
        validate: (value: any) => value >= 0,
        message: "Tầng phải lớn hơn hoặc bằng 0",
      },
    ],
    roomType: [
      {
        validate: (value: any) => value.id && value.id !== 0,
        message: "Vui lòng chọn loại phòng",
      },
    ],
    size: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Diện tích không được để trống",
      },
      {
        validate: (value: any) => value > 0,
        message: "Diện tích phải lớn hơn 0",
      },
    ],
  };

  const { errors, validateForm, confirmSave } = useFormValidation(validationRules);

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
      const data = await getConsumablesAvailable(0);
      setConsumables(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm tiêu hao:", error);
    }
  };
  const fetchEquipments = async () => {
    try {
      const data = await getEquipmentAvailable(0);
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
    if (!validateForm(roomForm)) {
      return;
    }

    try {
      await confirmSave(async () => {
        console.log("data", roomForm);
        const result = await createRoom(roomForm);
        console.log("Phòng đã được tạo:", result);
        navigate("/admin/" + ADMIN_PATHS.ROOM_LIST);
      });
    } catch (error) {
      console.error("Lỗi khi tạo phòng:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const filesArray = Array.from(e.target.files);
    const MAX_SIZE = 1;
    console.log(filesArray);
    
    const invalidFiles = filesArray.filter(file => file.size > MAX_SIZE * 1024 * 1024);

    const mess = "Dung lượng ảnh không được vượt quá "+MAX_SIZE+"mb";
    if (invalidFiles.length > 0) {
      toast.error(mess);
      return;
    }
    // Create preview URLs
    const previews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...previews]);
    
    try {
      setIsUploading(true);
      const uploadedUrls = await uploadMultipleImages(filesArray);
      handleChange('imageList', [...(roomForm.imageList || []), ...uploadedUrls]);
      console.log("Images uploaded successfully:", uploadedUrls);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
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
          <div className={cx("upload-section")}>
            <h3>Tải lên ảnh phòng</h3>
            <div className={cx("image-upload-container")}>
              <label className={cx("upload-button")}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className={cx("add-image-button")}>
                  <span>+</span>
                </div>
              </label>
              
              <div className={cx("preview-container")}>
                {previewImages.map((preview, index) => (
                  <div key={index} className={cx("preview-image-wrapper")}>
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className={cx("preview-image")}
                    />
                    <button
                      className={cx("remove-image")}
                      onClick={() => {
                        setPreviewImages(prev => prev.filter((_, i) => i !== index));
                        handleChange('imageList', 
                          (roomForm.imageList || []).filter((_, i) => i !== index)
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className={cx("upload-note")}>
              Chọn một hoặc nhiều ảnh để tải lên. Chấp nhận các định dạng: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>
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
            error={errors.roomNumber}
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
            error={errors.floor}
          />
        </div>
      </div>
      <div className={cx("box")}>
        <div className={cx("box-item")}>
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
            error={errors.roomType}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={roomForm.size?.toString()}
            title="Diện tích"
            placeholder="Nhập diện tích phòng"
            type="number"
            onChange={(e) =>
              handleChange("size", parseInt(e.target.value) || 0)
            }
            error={errors.size}
          />
        </div>
      </div>
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
              label: cs.name + " - " + cs?.barcode,
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
              label: eq.name + " - " + eq?.barcode,
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
          disabled={isUploading}
        />
      </div>
    </Container>
  );
};

export default RoomListCreate;
