// RoomIndoModal.tsx
import React from "react";
import { Dialog } from "@mui/material";
import classNames from "classnames/bind";
import styles from "./RoomIndoModal.module.scss";
import { RoomInfo } from "../../../types/hotel";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

interface BookingInfoModalProps {
  open: boolean;
  onClose: () => void;
  roomInfo: RoomInfo;
}

const RoomIndoModal: React.FC<BookingInfoModalProps> = ({
  open,
  onClose,
  roomInfo,
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    const link = "/admin/room-list/" + roomInfo.id;
    navigate(link);
  };
  return (
    <Dialog sx={{
      '& .MuiBackdrop-root': {
        backgroundColor: 'rgb(0 0 0 / 0.3)'
      }
      }} 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <div className={cx("modal-content")}>
        <div className={cx("title")}>Thông tin phòng</div>
        <div className={cx("divider")} />

        {/* Thông tin chi tiết phòng dưới dạng bảng */}
        <table className={cx("info-table")}>
          <tbody>
            <tr>
              <td>
                <strong className={cx("info-title")}>Số phòng</strong>
              </td>
              <td className={cx("info-value")}>{roomInfo.roomNumber || "_"}</td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Tầng</strong>
              </td>
              <td className={cx("info-value")}>{roomInfo.floor || "_"}</td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Mô tả</strong>
              </td>
              <td className={cx("info-value")}>{roomInfo.description || "_"}</td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Diện tích</strong>
              </td>
              <td className={cx("info-value")}>{roomInfo.size || "_"} m²</td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Trạng thái</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.isAvailable ? "Có sẵn" : "Không có sẵn"}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Loại phòng</strong>
              </td>
              <td className={cx("info-value")}>{roomInfo.roomType?.name || "_"}</td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Số giường đơn</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.roomType?.singleBedCount || "_"}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Số giường đôi</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.roomType?.doubleBedCount || "_"}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>
                  Có thể thêm giường phụ
                </strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.roomType?.extraBedAvailable ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Sức chứa tối đa</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.roomType?.maxOccupancy || "_"}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Giá cơ bản mỗi đêm</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.roomType?.basePricePerNight?.toLocaleString() || "_"}đ
              </td>
            </tr>
          </tbody>
        </table>

        <table className={cx("info-table")}>
          <tbody>
            <tr>
              <td>
                <strong className={cx("info-title")}>Cho phép hút thuốc</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.isSmokingAllowed ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Bếp riêng</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasPrivateKitchen ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Phòng tắm riêng</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasPrivateBathroom ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Ban công</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasBalcony ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Wifi miễn phí</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasFreeWifi ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Cách âm</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasSoundproofing ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Hướng hồ</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasLakeView ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Hướng vườn</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasGardenView ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Hướng bể bơi</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasPoolView ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Hướng núi</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasMountainView ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong className={cx("info-title")}>Hướng thành phố</strong>
              </td>
              <td className={cx("info-value")}>
                {roomInfo.hasCityView ? (
                  <span>
                    <CheckIcon style={{ color: "green", fontSize: "1.6rem" }} />
                  </span>
                ) : (
                  <span>
                    <CloseIcon style={{ color: "red", fontSize: "1.6rem" }} />
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div className={cx("section-title")}>Danh sách tiêu hao</div>
        {roomInfo.consumables && roomInfo.consumables.length > 0 ? (
          <table className={cx("info-table")}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody className={cx("info-tbody")}>
              {roomInfo.consumables.map((consumable) => (
                <tr key={consumable.id}>
                  <td className={cx("info-value")}>{consumable.name || "_"  }</td>
                  <td className={cx("info-value")}>{consumable.quantity || "_"}</td>
                  <td className={cx("info-value")}>{consumable.unit || "_"}</td>
                  <td>{consumable.price?.toLocaleString() || "_"}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={cx("no-content")}>Không có tiêu hao nào</div>
        )}

        <div className={cx("section-title")}>Danh sách thiết bị</div>
        {roomInfo.equipmentList && roomInfo.equipmentList.length > 0 ? (
          <table className={cx("info-table")}>
            <thead>
              <tr>
                <th>Tên thiết bị</th>
                <th>Trạng thái</th>
                <th>Ngày lắp đặt</th>
              </tr>
            </thead>
            <tbody className={cx("info-tbody")}>
              {roomInfo.equipmentList.map((equipment) => (
                <tr key={equipment.id}>
                  <td className={cx("info-value")}>{equipment.name || "_"}</td>
                  <td className={cx("info-value")}>{equipment.status || "_"}</td>
                  <td className={cx("info-value")}>
                    {equipment.installationDate &&
                      moment
                        .unix(equipment.installationDate)
                        .format("DD-MM-YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={cx("no-content")}>Không có thiết bị nào</div>
        )}

        <div className={cx("modal-actions")}>
          <button onClick={handleEditClick} className={cx("edit-button")}>
            Chỉnh sửa thông tin
          </button>
          <button onClick={onClose} className={cx("close-button")}>
            Đóng
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default RoomIndoModal;
