import classNames from "classnames/bind";
import styles from "./RoomAmenityCategories.module.scss";
import Container from "../../../components/Container/Container";
import {
  createConsumableCategory,
  createEquipmentCategory,
  getConsumableCategories,
  getEquipmentCategories,
} from "../../../apis/roomApis/roomApis";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import OptionBar from "../../../components/OptionBar/OptionBar";
import OptionItem from "../../../components/OptionBar/OptionItem";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  DialogActions,
} from "@mui/material";
import InputText from "../../../components/Input/InputText";
import {
  ConsumableCategoriesForm,
  EquipmentCategoryForm,
} from "../../../types/forms";
import { CloseOutlined } from "@mui/icons-material";
import TextArea from "../../../components/TextArea/TextArea";

const cx = classNames.bind(styles);
const columnsDef: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span style={{ paddingLeft: "10px" }}>ID</span>,
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>{params ? params.row.id : ""}</span>
    ),
  },
  {
    field: "name",
    headerName: "Tên danh mục",
    flex: 3,
    filterable: false,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span>Tên thiết bị</span>,
    renderCell: (params) => <span>{params ? params.row.name : ""}</span>,
  },
  {
    field: "description",
    headerName: "Mô tả",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    headerAlign: "left",
    renderHeader: () => <span style={{ paddingLeft: "10px" }}>Mô tả</span>,
    renderCell: (params) => (
      <span style={{ paddingLeft: "10px" }}>
        {params ? params.row.description : "_"}
      </span>
    ),
  },
];

const RoomAmenityCategories = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<any>("consumable");
  const [data, setData] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState<
    ConsumableCategoriesForm | EquipmentCategoryForm
  >({
    id: 0,
    name: "",
    description: "",
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleRowClick = (params: any) => {
    // const { id } = params.row;
    // const type = tab === "consumable" ? "consumable" : "equipment";
    // navigate(
    //   `/admin/${ADMIN_PATHS.ROOM_AMENITY_EDIT.replace(":type", type).replace(
    //     ":id",
    //     id
    //   )}`
    // );
  };

  const handleSelectConsumableTab = () => {
    setTab("consumable");
    fetchConsumablesCategories();
  };
  const handleSelectEquipmentTab = () => {
    setTab("equipment");
    fetchEquipmentsCategories();
  };
  const handleChange = (key: string, value: string) => {
    setCategoryForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const fetchConsumablesCategories = async () => {
    try {
      const data = await getConsumableCategories();
      setData(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục sản phẩm tiêu hao:", error);
    }
  };

  const fetchEquipmentsCategories = async () => {
    try {
      const data = await getEquipmentCategories();
      setData(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục thiết bị:", error);
    }
  };
  const handleAddCategory = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    setTab("consumable")
    fetchConsumablesCategories();
  }, []);
 
  const handleSaveCategory = async () => {
    try {
      if (tab === "consumable") {
        await createConsumableCategory(categoryForm);
        fetchConsumablesCategories();
        setCategoryForm({id:0, name:"", description:""});
      } else {
        await createEquipmentCategory(categoryForm);
        fetchEquipmentsCategories();
        setCategoryForm({id:0, name:"", description:""});
      }
    } catch (error) {
      console.log("Lỗi tạo mới danh mục");
    }
  };

  return (
    <Container
      title="Danh mục tiện nghi"
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Thêm tiện nghi"
          onClick={handleAddCategory}
        />
      }
    >
      <div className={cx("amenities-box")}>
        <div className={cx("optionbar")}>
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
        {/* <div className={cx("search")}>
          <Search placeholder="Tìm kiếm tiện nghi" handleSearch={(q) => handleSearch(q)} />
        </div> */}
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem" }}
            className={cx("data")}
            rows={data}
            columns={columnsDef}
            rowCount={10}
            // pageSizeOptions={[5, 10, 20]}
            // paginationModel={paginationModel}
            // paginationMode="server"
            disableColumnSorting={true}
            // onPaginationModelChange={setPaginationModel}
            onRowClick={handleRowClick}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </div>
      </div>

      <Dialog
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgb(0 0 0 / 0.3)'
          }
        }}
        open={openModal}
        onClose={() => setOpenModal(false)}
        hideBackdrop
        PaperProps={{
          style: {
            width: "500px",
            maxWidth: "500px",
          },
        }}
      >
        <DialogTitle style={{ fontSize: "1.8rem", textAlign: "center" }}>
          Tạo danh mục {tab == "consumable" ? "Đồ dùng tiêu hao" : "Thiết bị"}
        </DialogTitle>
        <Divider />
        <DialogContent style={{ fontSize: "1.6rem" }}>
          <InputText
            value={categoryForm.name}
            title="Tên danh mục"
            placeholder="Nhập tên danh mục"
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextArea
            title="Mô tả"
            value={categoryForm.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả"
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            icon={<CloseOutlined />}
            onClick={() => setOpenModal(false)}
            content="Đóng"
          />
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              handleSaveCategory();
              setOpenModal(false);
            }}
            content="Lưu"
          />
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomAmenityCategories;
