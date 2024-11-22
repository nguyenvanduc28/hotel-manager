import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import classNames from "classnames/bind";

import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import Search from "../../../components/Search/Search";
import OptionBar from "../../../components/OptionBar/OptionBar";
import OptionItem from "../../../components/OptionBar/OptionItem";
import { getServiceTypeList, getServiceItemList } from "../../../apis/serviceApis";
import styles from "./Services.module.scss";
import ServiceActionModal from "./ServiceActionModal";

const cx = classNames.bind(styles);

const serviceItemColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
  },
  {
    field: "name",
    headerName: "Tên dịch vụ",
    flex: 3,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
  },
  {
    field: "price",
    headerName: "Giá",
    flex: 2,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
    renderCell: (params) => (
      <span>{params.row.price?.toLocaleString()} đ</span>
    ),
  },
  {
    field: "description",
    headerName: "Mô tả",
    flex: 3,
    headerClassName: "datagrid-header",
    cellClassName: "datagrid-cell",
  }
];

const Services = () => {
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const initServiceItem = () => {
    return {
      id: 0,
      name: "",
      price: 0,
      description: "",
      serviceType: {
      id: selectedTypeId || 0,
      name: "",
        description: "",
      },
      image: "",
    };
  };

  const handleAddService = () => {
    setSelectedService(initServiceItem());
    setIsModalOpen(true);
  };

  const handleSearch = (input: string) => {
    console.log(input);
  };

  const handleRowClick = (params: any) => {
    const { row } = params;
    setSelectedService(row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedService(initServiceItem());
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    setSelectedService(initServiceItem());
    if (selectedTypeId) {
      fetchServiceItems();
    }
  };

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const types = await getServiceTypeList();
        setServiceTypes(types);
        if (types.length > 0) {
          setSelectedTypeId(types[0].id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại dịch vụ:", error);
      }
    };
    fetchServiceTypes();
  }, []);
  const fetchServiceItems = async () => {
    if (!selectedTypeId) return;
    try {
      const items = await getServiceItemList(selectedTypeId);
      setData(items);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
    }
  };
  useEffect(() => {
    fetchServiceItems();
  }, [selectedTypeId]);

  return (
    <Container
      title="Danh sách dịch vụ"
      button={
        <Button
          icon={<AddCircleOutlineIcon />}
          content="Thêm dịch vụ"
          onClick={handleAddService}
        />
      }
      linkToBack="/admin"
      titleToBack="Quay trở lại trang admin"
    >
      <div className={cx("services-box")}>
        <div className={cx("optionbar")}>
          <OptionBar>
            {serviceTypes.map((type) => (
              <OptionItem
                key={type.id}
                title={type.name}
                onClick={() => setSelectedTypeId(type.id)}
                active={selectedTypeId === type.id}
              />
            ))}
          </OptionBar>
        </div>
        <div className={cx("search")}>
          <Search 
            placeholder="Tìm kiếm dịch vụ" 
            handleSearch={handleSearch} 
          />
        </div>
        <div className={cx("list")}>
          <DataGrid
            style={{ fontSize: "1.4rem", cursor: "pointer" }}
            className={cx("data")}
            rows={data}
            columns={serviceItemColumns}
            disableColumnSorting={true}
            onRowClick={handleRowClick}
            rowSelection={false}
            hideFooterPagination={true}
          />
        </div>
        <ServiceActionModal
          open={isModalOpen}
          onClose={handleModalClose}
          serviceItem={selectedService}
          onSuccess={handleModalSuccess}
        />
      </div>
    </Container>
  );
};

export default Services;
