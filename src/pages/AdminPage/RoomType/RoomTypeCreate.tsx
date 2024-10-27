import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import styles from "./RoomTypeCreate.module.scss";
import classNames from "classnames/bind";
import { Divider } from "@mui/material";
import Title from "../../../components/Title/Title";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import TextArea from "../../../components/TextArea/TextArea";
import GroupRadio from "../../../components/GroupRadio/GroupRadio";
import { RoomTypeForm } from "../../../types/forms";
import { createRoomType } from "../../../apis/roomApis/roomApis";
import { useNavigate } from "react-router-dom";

type RoomTypeCreateProps = {};

const cx = classNames.bind(styles);

const RoomTypeCreate: React.FC<RoomTypeCreateProps> = () => {
  const navigate = useNavigate();
  
  const [roomTypeForm, setRoomTypeForm] = useState<RoomTypeForm>({
    id:0,
    name: "",
    description: "",
    singleBedCount: 0,
    doubleBedCount: 0,
    extraBedAvailable: false,
    sizeRange: "18-20",
    maxOccupancy: 0,
    basePricePerNight: 0,
  });

  const handleChange = (key: keyof RoomTypeForm, value: any) => {
    setRoomTypeForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  // Call API to save room type
  const handleSave = async () => {
    try {
      const result = await createRoomType(roomTypeForm);
      console.log("Loại phòng đã được tạo:", result);
      // Chuyển hướng về trang danh sách loại phòng
      navigate("/admin/" + ADMIN_PATHS.ROOM_TYPE);
    } catch (error) {
      console.error("Lỗi khi tạo loại phòng:", error);
    }
  };

  return (
    <Container
      title="Thêm loại phòng"
      linkToBack={"/admin/" + ADMIN_PATHS.ROOM_TYPE}
      titleToBack="Quay trở lại"
    >
      <InputText
        value={roomTypeForm.name}
        title="Tên loại phòng"
        placeholder="Nhập tên loại phòng"
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <TextArea
        title="Mô tả"
        value={roomTypeForm.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Nhập mô tả"
      />
      <div className={cx("divider")}>
        <Divider />
      </div>
      <Title title="Thông tin giường:" />
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={roomTypeForm.singleBedCount?.toString()}
            title="Số giường đơn"
            placeholder="Nhập số giường đơn"
            type="number"
            onChange={(e) =>
              handleChange("singleBedCount", parseInt(e.target.value) || 0)
            }
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={roomTypeForm.doubleBedCount?.toString()}
            title="Số giường đôi"
            placeholder="Nhập số giường đôi"
            type="number"
            onChange={(e) =>
              handleChange("doubleBedCount", parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>
      <GroupRadio
        onSelect={(value) =>
          handleChange("extraBedAvailable", value === "true")
        }
        value={roomTypeForm.extraBedAvailable?.toString()}
        title="Có thể kê thêm giường phụ?"
        numOfRow={2}
        options={[
          { label: "Có", value: "true" },
          { label: "Không", value: "false" },
        ]}
      />
      <div className={cx("divider")}>
        <Divider />
      </div>
      <Title title="Thông tin chi tiết phòng:" />
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={roomTypeForm.sizeRange}
            title="Diện tích (m²)"
            placeholder="Nhập diện tích phòng"
            onChange={(e) => handleChange("sizeRange", e.target.value)}
            suffix="m²"
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={roomTypeForm.maxOccupancy?.toString()}
            title="Sức chứa tối đa"
            placeholder="Nhập sức chứa tối đa"
            type="number"
            onChange={(e) =>
              handleChange("maxOccupancy", parseInt(e.target.value) || 0)
            }
            suffix="người"
          />
        </div>
      </div>
      <div className={cx("divider")}>
        <Divider />
      </div>
      <InputText
        value={roomTypeForm.basePricePerNight?.toString()}
        title="Giá cơ bản mỗi đêm"
        placeholder="Nhập giá cơ bản mỗi đêm"
        type="number"
        onChange={(e) =>
          handleChange("basePricePerNight", parseFloat(e.target.value) || 0)
        }
        suffix="₫"
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

export default RoomTypeCreate;
