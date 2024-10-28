import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import styles from "./BookingCreate.module.scss";
import classNames from "classnames/bind";
import { Divider } from "@mui/material";
import Title from "../../../components/Title/Title";
import { ADMIN_PATHS } from "../../../constants/admin/adminPath";
import { BookingForm } from "../../../types/forms";
// import { createBooking } from "../../../apis/bookingApis/bookingApis";
import { useNavigate } from "react-router-dom";
import { BOOKING_STATUS } from "../../../constants/admin/constants";
import SearchWithMenu from "../../../components/SearchWithMenu/SearchWithMenu";

type BookingCreateProps = {};

const cx = classNames.bind(styles);

const BookingCreate: React.FC<BookingCreateProps> = () => {
  const navigate = useNavigate();

  const [bookingForm, setBookingForm] = useState<BookingForm>({
    id: 0,
    customer: {id:0},
    checkInDate: undefined,
    checkOutDate: undefined,
    bookingDate: Date.now(),
    estimatedArrivalTime: undefined,
    isGroup: false,
    totalCost: 0,
    status: BOOKING_STATUS.Pending, // giá trị mặc định
    deposit: 0,
    cancellationPolicy: "Miễn phí hủy trong 12h",
    canceledAt: undefined,
    isGuaranteed: true,
    rooms: [],
  });
  const options = [
    { value: 1, label: "Tùy chọn 1" },
    { value: 2, label: "Tùy chọn 2" },
    { value: 3, label: "Tùy chọn 3" },
    { value: 4, label: "Tùy chọn 4" },
    { value: 5, label: "Tùy chọn 5" },
  ];
  const handleChange = (key: keyof BookingForm, value: any) => {
    setBookingForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  // Gọi API để lưu thông tin booking
  const handleSave = async () => {
    try {
    //   const result = await createBooking(bookingForm);

      console.log("Booking đã được tạo:", bookingForm);
      navigate("/admin/" + ADMIN_PATHS.BOOKINGS);
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
    }
  };

  return (
    <Container
      title="Thêm Booking"
      linkToBack={"/admin/" + ADMIN_PATHS.BOOKINGS}
      titleToBack="Quay trở lại"
    >
      <SearchWithMenu
      title="Thông tin khách hàng"
      options={options}
      handleSearch={(query) => console.log(query)}
      handleButtonClick={() => console.log("thêm khách hàng")}
      titleButton="Thêm khách hàng"
      onSelect={(value) => handleChange("customer", {id:value})}
      />
      <div className={cx("divider")}>
        <Divider />
      </div>
      {/* <Title title="Thông tin booking:" /> */}
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <InputText
            value={bookingForm.checkInDate?.toString() || ""}
            title="Ngày nhận phòng"
            placeholder="Nhập ngày nhận phòng"
            type="date"
            onChange={(e) =>
              handleChange("checkInDate", new Date(e.target.value).getTime())
            }
          />
        </div>
        <div className={cx("box-item")}>
          <InputText
            value={bookingForm.checkOutDate?.toString() || ""}
            title="Ngày trả phòng"
            placeholder="Nhập ngày trả phòng"
            type="date"
            onChange={(e) =>
              handleChange("checkOutDate", new Date(e.target.value).getTime())
            }
          />
        </div>
      </div>
      <InputText
        value={""}
        // value={bookingForm.customer}
        title="Danh sách phòng"
        placeholder="Danh sách phòng"
        onChange={(e) => handleChange("customer", e.target.value)}
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

export default BookingCreate;
