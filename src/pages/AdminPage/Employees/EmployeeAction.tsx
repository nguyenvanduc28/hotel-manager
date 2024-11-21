import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import styles from "./EmployeeAction.module.scss";
import classNames from "classnames/bind";
import { Divider, Select, MenuItem } from "@mui/material";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import TextArea from "../../../components/TextArea/TextArea";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import GroupRadio from "../../../components/GroupRadio/GroupRadio";
import { GENDERS, EMPLOYEE_STATUS } from "../../../constants/admin/constants";
import moment from "moment";
import { Employee } from "../../../types/hotel";
import { createEmployee, getEmployeeById, updateEmployee } from "../../../apis/employeeApis";
import { ROLES_DATA } from "../../../constants/auth/roleConstants";
import { uploadMultipleImages } from "../../../apis/imageApis/imageApis";


const cx = classNames.bind(styles);

const EmployeeAction: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");



  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [employeeForm, setEmployeeForm] = useState<Employee>({
    name: "",
    email: "",
    phoneNumber: "",
    gender: undefined,
    birthDay: undefined,
    nationality: "",
    identityNumber: "",
    address: "",
    startDate: moment().unix(),
    status: EMPLOYEE_STATUS.ACTIVE,
    notes: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    positionName: "",
    user: {
      username: "",
      password: "",
      roles: [],
    },
  });

  const fetchEmployee = async () => {
    const result = await getEmployeeById(Number(id));
    setEmployeeForm(prev => ({
      ...prev,
      ...result,
    }));
  };

  useEffect(() => {
    if (mode === "edit") {
      fetchEmployee();
    }
  }, [mode, id]);

  const handleChange = (key: keyof Employee | "username" | "password" | "roles", value: any) => {
    if (key === "username" || key === "password" || key === "roles") {
      setEmployeeForm((prev) => ({
        ...prev,
        user: {
          ...prev.user!,
          [key]: value,
        },
      }));
    } else {
      setEmployeeForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const filesArray = Array.from(e.target.files);
    
    // Create preview URLs
    const previews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...previews]);
    
    try {
      setIsUploading(true);
      const uploadedUrls = await uploadMultipleImages(filesArray);
      handleChange('profilePictureUrl', uploadedUrls[0].url); // Take first image as avatar
      console.log("Avatar uploaded successfully:", uploadedUrls[0]);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (mode === "create") {
        const result = await createEmployee(employeeForm);
        console.log("Nhân viên đã được tạo:", result);
        navigate("/admin/" + ADMIN_PATHS.EMPLOYEES);
      } else if (mode === "edit") {
        const result = await updateEmployee(Number(id), employeeForm);
        console.log("Nhân viên đã được cập nhật:", result);
        navigate("/admin/" + ADMIN_PATHS.EMPLOYEES);
      }
    } catch (error) {
      console.error("Lỗi khi tạo nhân viên:", error);
    }
  };

  const roleOptions = ROLES_DATA
    .filter(role => role.name !== 'ADMIN')
    .map(role => ({
      value: role.name,
      label: role.name,
    }));

  return (
    <Container
      title="Thêm nhân viên"
      linkToBack={"/admin/" + ADMIN_PATHS.EMPLOYEES}
      titleToBack="Quay trở lại"
    >
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <div className={cx("upload-section")}>
            <h3>Ảnh đại diện</h3>
            <div className={cx("image-upload-container")}>
              <label className={cx("upload-button")}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className={cx("add-image-button")}>
                  {employeeForm.profilePictureUrl ? <img className={cx("avatar-image")} src={employeeForm.profilePictureUrl} alt="Avatar" /> : <span>+</span>} 
                </div>
              </label>
            </div>
            <p className={cx("upload-note")}>
              Chọn ảnh đại diện. Chấp nhận các định dạng: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <InputText
        value={employeeForm.name}
        title="Tên nhân viên"
        placeholder="Nhập tên nhân viên"
        onChange={(e) => handleChange("name", e.target.value)}
      />
      
      {/* Account Information */}
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.user?.username}
            title="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            onChange={(e) => handleChange("username", e.target.value)}
            disabled={mode === "edit"}
          />
        </div>
          <div className={cx("box-item")}>
        {mode === "create" && (
            <InputText
            value={employeeForm.user?.password}
            title="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            onChange={(e) => handleChange("password", e.target.value)}
            />
          )}
          </div>
      </div>
    
      <div className={cx("box-role")}>
        <div className={cx("box-role-title")}>
          Danh sách quyền
        </div>
        <Select
          labelId="role-select-label"
          id="role-select"
            multiple
          value={employeeForm.user?.roles?.map(role => role.name) || []}
          onChange={(event) => {
            const selectedRoles = event.target.value as string[];
            handleChange("roles", selectedRoles.map(value => ROLES_DATA.find(role => role.name === value)));
        }}
        renderValue={(selected) => (selected as string[]).join(', ')}
        sx={{ width: '100%', marginBottom: '2rem', height: '3.5rem' }}
        >
          {roleOptions.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Contact Information */}
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.email}
            title="Email"
            placeholder="Nhập email"
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.phoneNumber}
            title="Số điện thoại"
            placeholder="Nhập số điện thoại"
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
      </div>

      {/* Personal Information */}
      <div className={cx("box")}>
      <div className={cx("box-item")}>
          <GroupRadio
            title="Giới tính"
            value={employeeForm.gender}
            onSelect={(value) => handleChange("gender", value)}
            options={[
              { value: GENDERS.MALE, label: "Nam" },
              { value: GENDERS.FEMALE, label: "Nữ" },
              { value: GENDERS.OTHER, label: "Khác" },
            ]}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.identityNumber}
            title="Số CCCD/CMND"
            placeholder="Nhập số CCCD/CMND"
            onChange={(e) => handleChange("identityNumber", e.target.value)}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.birthDay ? moment.unix(employeeForm.birthDay).format("YYYY-MM-DD") : ""}
            title="Ngày sinh"
            type="date"
            onChange={(e) => {
              const timestamp = moment(e.target.value, "YYYY-MM-DD").unix();
              handleChange("birthDay", timestamp);
            }}
          />
        </div>
      </div>
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.nationality}
            title="Quốc tịch"
            placeholder="Nhập quốc tịch"
            onChange={(e) => handleChange("nationality", e.target.value)}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.address}
            title="Địa chỉ"
            placeholder="Nhập địa chỉ"
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
      </div>

      {/* Position Information */}
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.positionName}
            title="Chức vụ"
            placeholder="Nhập chức vụ"
            onChange={(e) => handleChange("positionName", e.target.value)}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.startDate ? moment.unix(employeeForm.startDate).format("YYYY-MM-DD") : ""}
            title="Ngày bắt đầu làm việc"
            type="date"
            onChange={(e) => {
              const timestamp = moment(e.target.value, "YYYY-MM-DD").unix();
              handleChange("startDate", timestamp);
            }}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.emergencyContactName}
            title="Tên người liên hệ khẩn cấp"
            placeholder="Nhập tên người liên hệ"
            onChange={(e) => handleChange("emergencyContactName", e.target.value)}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.emergencyContactPhone}
            title="SĐT liên hệ khẩn cấp"
            placeholder="Nhập số điện thoại"
            onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={employeeForm.emergencyContactRelationship}
            title="Mối quan hệ với người liên hệ"
            placeholder="Nhập mối quan hệ"
            onChange={(e) => handleChange("emergencyContactRelationship", e.target.value)}
          />
        </div>
      </div>

      <TextArea
        title="Ghi chú"
        value={employeeForm.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        placeholder="Nhập ghi chú"
      />

      <div className={cx("divider")}>
        <Divider />
      </div>
      
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

export default EmployeeAction;
