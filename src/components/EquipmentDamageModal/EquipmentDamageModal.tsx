import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getEquipmentsByRoomId } from "../../apis/roomApis/roomApis";
import { BookingEquipmentDamaged, RoomInfo } from "../../types/hotel";
import styles from "./EquipmentDamageModal.module.scss";
import classNames from "classnames/bind";
import { EquipmentForm } from "../../types/forms";
import { Add as AddIcon } from "@mui/icons-material";

const cx = classNames.bind(styles);

interface EquipmentDamageModalProps {
  open: boolean;
  onClose: () => void;
  rooms: RoomInfo[];
  onSave: (payload: BookingEquipmentDamaged[]) => void;
  equipmentListDamaged: BookingEquipmentDamaged[];
}

const EquipmentDamageModal = ({ open, onClose, rooms, onSave, equipmentListDamaged }: EquipmentDamageModalProps) => {
  const [equipmentByRoom, setEquipmentByRoom] = useState<EquipmentForm[]>([]);

  useEffect(() => {
    if (open) {
      fetchEquipmentForRooms();
    }
  }, [open, rooms]);

  const fetchEquipmentForRooms = async () => {
    try {
      setEquipmentByRoom([]);
      for (const room of rooms) {
        if (!room.id) continue;
        const equipment = await getEquipmentsByRoomId(room.id);
        setEquipmentByRoom(prev => [...prev, ...equipment]);
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    }
  };

  return (
    <Dialog
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgb(0 0 0 / 0.3)'
        }
      }}
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle style={{fontSize: "2.4rem",fontWeight:700, textAlign: "center"}}>Thiết bị hư hỏng</DialogTitle>
      <DialogContent>
        <div className={cx("selected-equipment")}>
          <h3>Thiết bị đã báo hỏng</h3>
          <table className={cx("equipment-table")}>
            <thead>
              <tr>
                <th>Tên thiết bị</th>
                <th>Loại</th>
                <th>Mô tả hư hỏng</th>
                <th>Chi phí</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {equipmentListDamaged.length > 0 ? equipmentListDamaged.map((item) => (
                <tr key={item.equipmentId}>
                  <td>{item.name}</td>
                  <td>{item.equipmentCategory?.name}</td>
                  <td>
                    <input
                      type="text"
                      className={cx("description-input")}
                      value={item.damageDescription || ''}
                      onChange={(e) => {
                        const updatedEquipment = equipmentListDamaged.map(eq => 
                          eq.equipmentId === item.equipmentId 
                            ? {...eq, damageDescription: e.target.value}
                            : eq
                        );
                        onSave(updatedEquipment);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className={cx("fee-input")}
                      value={item.damageFee?.toLocaleString() || '0'}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '');
                        const numberValue = parseInt(rawValue) || 0;
                        
                        const updatedEquipment = equipmentListDamaged.map(eq =>
                          eq.equipmentId === item.equipmentId
                            ? {...eq, damageFee: numberValue}
                            : eq
                        );
                        onSave(updatedEquipment);
                      }}
                    />
                  </td>
                  <td>
                    <Button
                      style={{fontSize: "12px"}}
                      color="error"
                      onClick={() => {
                        const updatedEquipment = equipmentListDamaged.filter(eq => 
                          eq.equipmentId !== item.equipmentId
                        );
                        onSave(updatedEquipment);
                      }}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className={cx("empty-cell")}>Không có thiết bị hư hỏng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={cx("available-equipment")}>
          <h3>Thiết bị trong phòng</h3>
          <table className={cx("equipment-table")}>
            <thead>
              <tr>
                <th>Tên thiết bị</th>
                <th>Loại</th>
                <th>Phòng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {equipmentByRoom.length > 0 ? equipmentByRoom.map((item) => {
                const isSelected = equipmentListDamaged.some(eq => eq.equipmentId === item.id);
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.equipmentCategory?.name}</td>
                    <td>{item.room?.roomNumber}</td>
                    <td>
                      <Button
                        style={{fontSize: "11px"}}
                        variant="contained"
                        disabled={isSelected}
                        onClick={() => {
                          const newItem = {
                            name: item.name,
                            equipmentId: item.id,
                            equipmentCategory: item.equipmentCategory,
                            damageDescription: '',
                            damageFee: 0,
                          };
                          onSave([...equipmentListDamaged, newItem]);
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className={cx("empty-cell")}>Không có thiết bị trong phòng</td>
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

export default EquipmentDamageModal; 