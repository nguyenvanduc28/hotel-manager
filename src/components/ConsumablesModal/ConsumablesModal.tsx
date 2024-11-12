import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getConsumablesByRoomId } from "../../apis/roomApis/roomApis";
import { BookingConsumable, RoomInfo } from "../../types/hotel";
import styles from "./ConsumablesModal.module.scss";
import classNames from "classnames/bind";
import { ConsumableForm } from "../../types/forms";
import { Add as AddIcon } from "@mui/icons-material";

const cx = classNames.bind(styles);

interface ConsumablesModalProps {
  open: boolean;
  onClose: () => void;
  rooms: RoomInfo[];
  onSave: (payload: BookingConsumable[]) => void;
  consumablesSelected: BookingConsumable[];
}

const ConsumablesModal = ({ open, onClose, rooms, onSave, consumablesSelected }: ConsumablesModalProps) => {
  const [consumablesByRoom, setConsumablesByRoom] = useState<ConsumableForm[]>([]);

  useEffect(() => {
    if (open) {
      fetchConsumablesForRooms();
    }
  }, [open, rooms]);

  const fetchConsumablesForRooms = async () => {
    try {
      setConsumablesByRoom([]);
      for (const room of rooms) {
        if (!room.id) continue;
        const consumables = await getConsumablesByRoomId(room.id);
        setConsumablesByRoom(prev => [...prev, ...consumables]);
      }
    } catch (error) {
      console.error('Failed to fetch consumables:', error);
    }
  };

  const getPriceFromConsumableId = (consumableId: number) => {
    const consumable = consumablesByRoom.find(c => c.id === consumableId);
    return consumable?.price || 0;
  }

  const calculateTotalPrice = (consumableId: number, quantity: number) => {
    const price = getPriceFromConsumableId(consumableId);
    return (price * quantity);
  }

  const getQuantityFromConsumableId = (consumableId: number) => {
    const consumable = consumablesByRoom.find(c => c.id === consumableId);
    return consumable?.quantity || 0;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle style={{fontSize: "2.4rem",fontWeight:700, textAlign: "center"}}>Chọn đồ dùng tiêu hao</DialogTitle>
      <DialogContent>
        <div className={cx("selected-consumables")}>
          <h3>Đồ dùng đã chọn</h3>
          <table className={cx("consumables-table")}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Đơn vị</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {consumablesSelected.length > 0 ? consumablesSelected.map((item) => (
                <tr key={item.consumableId}>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{getPriceFromConsumableId(item.consumableId || 0)?.toLocaleString()}đ</td>
                  <td>
                    <input
                      type="number"
                      className={cx("quantity-input")}
                      value={item.quantityUsed || 0}
                      onChange={(e) => {
                        let newQuantity = parseInt(e.target.value);
                        const maxQuantity = getQuantityFromConsumableId(item.consumableId || 0);
                        console.log(maxQuantity);
                        
                        if (newQuantity <= 0) {
                          return;
                        }
                        
                        if (newQuantity > maxQuantity) {
                          newQuantity = maxQuantity;
                        }

                        const totalPrice = calculateTotalPrice(item.consumableId || 0, newQuantity);

                        const updatedConsumables = consumablesSelected.map(c => 
                          c.consumableId === item.consumableId ? {...c, quantityUsed: newQuantity, totalPrice: Number(totalPrice)} : c
                        );
                        onSave(updatedConsumables);
                      }}
                    />
                  </td>
                  <td>{calculateTotalPrice(item?.consumableId || 0, item.quantityUsed || 0)?.toLocaleString()}đ</td>
                  <td>
                    <Button
                      style={{fontSize: "12px"}}
                      color="error"
                      onClick={() => {
                        const updatedConsumables = consumablesSelected.filter(c => c.consumableId !== item.consumableId);
                        onSave(updatedConsumables);
                      }}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className={cx("empty-cell")}>Không có đồ dùng nào được chọn</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={cx("available-consumables")}>
          <h3>Đồ dùng trong phòng</h3>
          <table className={cx("consumables-table")}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Đơn vị</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Phòng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {consumablesByRoom.length > 0 ? consumablesByRoom.map((item) => {
                const isSelected = consumablesSelected.some(c => c.consumableId === item.id);
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    <td>{item.price?.toLocaleString()}đ</td>
                    <td>{item.quantity}</td>
                    <td>{item.room?.roomNumber}</td>
                    <td>
                      <Button
                        style={{fontSize: "11px"}}
                        variant="contained"
                        disabled={isSelected}
                        onClick={() => {
                          const newItem = {
                            name: item.name,
                            unit: item.unit,
                            quantityUsed: 1,
                            consumableId: item.id,
                            consumableCategory: item.consumableCategory,
                            totalPrice: getPriceFromConsumableId(item.id || 0),
                          };
                          onSave([...consumablesSelected, newItem]);
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className={cx("empty-cell")}>Không có đồ dùng nào trong phòng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button style={{fontSize: "12px"}} onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsumablesModal; 