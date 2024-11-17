import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import styles from "./CustomerCreate.module.scss";
import classNames from "classnames/bind";
import { Divider } from "@mui/material";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import TextArea from "../../../components/TextArea/TextArea";
import { CustomerForm } from "../../../types/forms";
import { createCustomer } from "../../../apis/bookingApis/bookingApis";
import { useNavigate } from "react-router-dom";
import GroupRadio from "../../../components/GroupRadio/GroupRadio";
import { GENDERS } from "../../../constants/admin/constants";
import moment from "moment";
import SelectContainer from "../../../components/Select/SelectContainer";
import { countries } from "../../../constants/regions";

type CustomerCreateProps = {};

const cx = classNames.bind(styles);

const CustomerCreate: React.FC<CustomerCreateProps> = () => {
  const navigate = useNavigate();

  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    id: 0,
    name: "",
    email: "",
    phoneNumber: "",
    gender: undefined,
    birthDay: undefined,
    nationality: "",
    identityNumber: "",
    address: "",
    notes: "",
  });

  const handleChange = (key: keyof CustomerForm, value: any) => {
    setCustomerForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  // Call API to save customer
  const handleSave = async () => {
    try {
      const result = await createCustomer(customerForm);
      console.log("Khách hàng đã được tạo:", result);
      // Chuyển hướng về trang danh sách khách hàng
      navigate("/admin/" + ADMIN_PATHS.CUSTOMERS);
    } catch (error) {
      console.error("Lỗi khi tạo khách hàng:", error);
    }
  };

  return (
    <Container
      title="Thêm khách hàng"
      linkToBack={"/admin/" + ADMIN_PATHS.CUSTOMERS}
      titleToBack="Quay trở lại"
    >
      <InputText
        value={customerForm.name}
        title="Tên khách hàng"
        placeholder="Nhập tên khách hàng"
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <InputText
        value={customerForm.email}
        title="Email"
        placeholder="Nhập email"
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <InputText
        value={customerForm.phoneNumber}
        title="Số điện thoại"
        placeholder="Nhập số điện thoại"
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
      />
      <InputText
        value={customerForm.identityNumber}
        title="Số CMND/CCCD"
        placeholder="Nhập số CMND/CCCD"
        onChange={(e) => handleChange("identityNumber", e.target.value)}
      />

      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={customerForm.address}
            // variant="inline-group"
            title="Địa chỉ"
            placeholder="Nhập địa chỉ"
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div className={cx("box-item")}>
          <SelectContainer
            title="Quốc tịch"
            value={customerForm.nationality}
            onChange={(value) => handleChange("nationality", value)}
            options={countries.map((country) => ({
              value: country.name,
              label: country.name,
            }))}
          />
        </div>
      </div>
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <GroupRadio
            title="Giới tính"
            value={customerForm.gender}
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
            value={
              customerForm.birthDay
                ? moment.unix(customerForm.birthDay).format("YYYY-MM-DD")
                : ""
            }
            // variant="inline-group"
            title="Ngày sinh"
            type="date"
            onChange={(e) => {
              const timestamp = moment(e.target.value, "YYYY-MM-DD").unix();
              handleChange("birthDay", timestamp);
            }}
          />
        </div>
      </div>

      <TextArea
        title="Ghi chú"
        value={customerForm.notes}
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
        />
      </div>
    </Container>
  );
};

export default CustomerCreate;
