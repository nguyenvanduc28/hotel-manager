import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, Select, MenuItem, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import classNames from "classnames/bind";

import Button from "../../../components/Button/Button";
import InputText from "../../../components/Input/InputText";
import TextArea from "../../../components/TextArea/TextArea";
import { ServiceItem } from "../../../types/hotel";
import { ServiceItemForm, ServiceTypeForm } from "../../../types/forms";
import { createServiceItem, updateServiceItem, getServiceTypeList } from "../../../apis/serviceApis";
import { uploadMultipleImages } from "../../../apis/imageApis/imageApis";
import styles from "./ServiceActionModal.module.scss";

const cx = classNames.bind(styles);

interface ServiceActionModalProps {
  open: boolean;
  onClose: () => void;
  serviceItem?: ServiceItem;
  onSuccess: () => void;
}

const ServiceActionModal: React.FC<ServiceActionModalProps> = ({
  open,
  onClose,
  serviceItem,
  onSuccess,
}) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeForm[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [serviceForm, setServiceForm] = useState<ServiceItemForm>({
    name: "",
    price: 0,
    description: "",
    serviceType: {
      id: 0,
      name: "",
      description: "",
    },
    image: "",
  });

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const types = await getServiceTypeList();
        setServiceTypes(types);
        if (types.length > 0 && !serviceForm.serviceType.id) {
          setServiceForm(prev => ({
            ...prev,
            serviceType: types[0]
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại dịch vụ:", error);
      }
    };
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    if (serviceItem) {
      setServiceForm({
        id: serviceItem.id,
        name: serviceItem.name,
        price: serviceItem.price,
        description: serviceItem.description || "",
        serviceType: serviceItem.serviceType,
        image: serviceItem.image || "",
      });
    }
  }, [serviceItem]);

  const handleChange = (key: keyof ServiceItemForm, value: any) => {
    setServiceForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const filesArray = Array.from(e.target.files);
    
    try {
      setIsUploading(true);
      const uploadedUrls = await uploadMultipleImages(filesArray);
      handleChange('image', uploadedUrls[0].url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!serviceItem) {
        await createServiceItem(serviceForm);
      } else {
        await updateServiceItem(serviceForm);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className={cx("dialog-title")}>
        {serviceItem ? "Sửa dịch vụ" : "Thêm dịch vụ"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={cx("close-button")}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={cx("dialog-content")}>
        <div className={cx("form-container")}>
          <div className={cx("upload-section")}>
            <h3>Ảnh dịch vụ</h3>
            <div className={cx("image-upload-container")}>
              <label className={cx("upload-button")}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className={cx("add-image-button")}>
                  {serviceForm.image ? 
                    <img className={cx("service-image")} src={serviceForm.image} alt="Service" /> 
                    : <span>+</span>
                  }
                </div>
              </label>
            </div>
            <p className={cx("upload-note")}>
              Chọn ảnh dịch vụ. Chấp nhận các định dạng: JPG, PNG, GIF
            </p>
          </div>

          <div className={cx("form-group")}>
            <label className={cx("form-label")}>Loại dịch vụ</label>
            <Select
              value={serviceForm.serviceType.id}
              onChange={(e) => {
                const selectedType = serviceTypes.find(type => type.id === e.target.value);
                if (selectedType) {
                  handleChange("serviceType", selectedType);
                }
              }}
              className={cx("select-input")}
            >
              {serviceTypes.map((type) => (
                <MenuItem style={{ fontSize: "1.4rem" }} key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <InputText
            value={serviceForm.name}
            title="Tên dịch vụ"
            placeholder="Nhập tên dịch vụ"
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <InputText
            value={serviceForm.price.toString()}
            title="Giá dịch vụ"
            type="number"
            placeholder="Nhập giá dịch vụ"
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />

          <TextArea
            title="Mô tả"
            value={serviceForm.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả dịch vụ"
          />

          <div className={cx("button-container")}>
            <Button
              icon={<SaveOutlinedIcon />}
              content="Lưu"
              onClick={handleSave}
              disabled={isUploading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceActionModal;
