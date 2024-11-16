import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import Button from "../../../components/Button/Button";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InputText from "../../../components/Input/InputText";
import TextArea from "../../../components/TextArea/TextArea";
import styles from "./HotelSetting.module.scss";
import classNames from "classnames/bind";
import { HotelInfo } from "../../../types/hotel";
import { updateHotel } from "../../../apis/hotelApis";
import { useFormValidation } from "../../../hooks/useFormValidation";
import {
  uploadImage,
  uploadMultipleImages,
} from "../../../apis/imageApis/imageApis";
import { useHotel } from "../../../hooks/useHotel";
import { provinces, countries } from "../../../constants/regions";
import SelectContainer from "../../../components/Select/SelectContainer";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import Search from "../../../components/Search/Search";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const defaultPosition = [10.762622, 106.660172]; // Ho Chi Minh City coordinates

const LocationMarker = ({ position, onPositionChange }: any) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPositionChange(lat, lng);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    />
  ) : null;
};

const HotelSetting = () => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { hotelInfo, isLoading, updateHotelInfo } = useHotel();
  console.log(hotelInfo);
  const [mapCenter, setMapCenter] = useState(defaultPosition);
  const [hotelForm, setHotelForm] = useState<HotelInfo>({
    id: 0,
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
    phoneNumber: "",
    email: "",
    websiteUrl: "",
    checkInTime: "",
    checkOutTime: "",
    rating: 0,
    numberOfRooms: 0,
    description: "",
    logoUrl: "",
    totalStaff: 0,
    ownerName: "",
    status: "",
  });

  useEffect(() => {
    if (hotelInfo && !isLoading) {
      setHotelForm(hotelInfo);
      setMapCenter([hotelInfo.latitude || defaultPosition[0], hotelInfo.longitude || defaultPosition[1]]);
    }
  }, [isLoading]);

  const validationRules = {
    name: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Tên khách sạn không được để trống",
      },
    ],
    address: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Địa chỉ không được để trống",
      },
    ],
    city: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Thành phố không được để trống",
      },
    ],
    postalCode: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Mã bưu điện không được để trống",
      },
    ],
    phoneNumber: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Số điện thoại không được để trống",
      },
      {
        validate: (value: any) => /^\d{10,11}$/.test(value),
        message: "Số điện thoại không hợp lệ",
      },
    ],
    email: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Email không được để trống",
      },
      {
        validate: (value: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Email không hợp lệ",
      },
    ],
    checkInTime: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Thời gian check-in không hợp lệ",
      },
    ],
    checkOutTime: [
      {
        validate: (value: any) => value !== undefined && value !== "",
        message: "Thời gian check-out không hợp lệ",
      },
    ],
  };

  const { errors, validateForm, confirmSave } =
    useFormValidation(validationRules);

  const handleChange = (key: keyof HotelInfo, value: any) => {
    setHotelForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!validateForm(hotelForm)) {
      return;
    }

    try {
      await confirmSave(async () => {
        const updatedHotel = await updateHotel(hotelForm.id, hotelForm);
        updateHotelInfo(updatedHotel);
        toast.success("Cập nhật thông tin khách sạn thành công");
      });
    } catch (error) {
      console.error("Lỗi khi lưu thông tin khách sạn:", error);
      toast.error("Lỗi khi lưu thông tin khách sạn");
    }
  };

  const handleLogoImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    try {
      setIsUploading(true);
      const uploadedUrls = await uploadImage(filesArray[0]);
      handleChange("logoUrl", uploadedUrls.url);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    // Create preview URLs
    const previews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);

    try {
      setIsUploading(true);
      const uploadedUrls = await uploadMultipleImages(filesArray);
      handleChange("images", [...(hotelForm.images || []), ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Thêm state để quản lý tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Thêm hàm tìm kiếm
  const handleSearch = async () => {
    if (!searchQuery) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  // Thêm hàm chọn địa điểm từ kết quả tìm kiếm
  const handleSelectLocation = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Cập nhật vị trí marker
    handleChange('latitude', lat);
    handleChange('longitude', lng);
    
    // Cập nhật center của map
    setMapCenter([lat, lng]);
    
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <Container title="Cài đặt khách sạn">
      <div className={cx("box")}>
        <div className={cx("box-item")}>
          <div className={cx("upload-section")}>
            <h3>Logo khách sạn</h3>
            <div className={cx("image-upload-container")}>
              <label className={cx("upload-button")}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoImageUpload}
                  style={{ display: "none" }}
                  multiple={false}
                />
                <div className={cx("add-image-button")}>
                  {hotelForm.logoUrl ? (
                    <img
                      className={cx("image")}
                      src={hotelForm.logoUrl}
                      alt="logo"
                    />
                  ) : (
                    <span>+</span>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("form-container")}>
        <InputText
          value={hotelForm.name}
          title="Tên khách sạn"
          placeholder="Nhập tên khách sạn"
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />

        <div className={cx("form-row")}>
          <InputText
            value={hotelForm.address}
            title="Địa chỉ"
            placeholder="Nhập địa chỉ khách sạn"
            onChange={(e) => handleChange("address", e.target.value)}
            error={errors.address}
          />

          <SelectContainer
            title="Thành phố"
            value={hotelForm.city}
            onChange={(value) => handleChange("city", value)}
            options={provinces.map((province) => ({
              value: province.name,
              label: province.name,
            }))}
          />
        </div>

        <div className={cx("form-row")}>
          <InputText
            value={hotelForm.postalCode}
            title="Mã bưu điện"
            placeholder="Nhập mã bưu điện"
            onChange={(e) => handleChange("postalCode", e.target.value)}
            error={errors.postalCode}
          />

          <SelectContainer
            title="Quốc gia"
            value={hotelForm.country}
            onChange={(value) => handleChange("country", value)}
            options={countries.map((country) => ({
              value: country.name,
              label: country.name,
            }))}
          />
        </div>

        <div className={cx("form-row")}>
          <InputText
            value={hotelForm.phoneNumber}
            title="Số điện thoại"
            placeholder="Nhập số điện thoại"
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            error={errors.phoneNumber}
          />

          <InputText
            value={hotelForm.email}
            title="Email"
            placeholder="Nhập email"
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />
        </div>

        <InputText
          value={hotelForm.websiteUrl}
          title="Website"
          placeholder="Nhập địa chỉ website"
          onChange={(e) => handleChange("websiteUrl", e.target.value)}
        />

        <div className={cx("form-row")}>
          <InputText
            value={hotelForm.checkInTime?.toString()}
            title="Giờ check-in"
            type="text"
            placeholder="Nhập giờ check-in"
            onChange={(e) => handleChange("checkInTime", e.target.value)}
            error={errors.checkInTime}
          />

          <InputText
            value={hotelForm.checkOutTime?.toString()}
            title="Giờ check-out"
            type="text"
            placeholder="Nhập giờ check-out"
            onChange={(e) => handleChange("checkOutTime", e.target.value)}
            error={errors.checkOutTime}
          />
        </div>

        <InputText
          value={hotelForm.ownerName}
          title="Tên chủ sở hữu"
          placeholder="Nhập tên chủ sở hữu"
          onChange={(e) => handleChange("ownerName", e.target.value)}
        />
        {/* danh sách ảnh khách sạn */}

        <div className={cx("box")}>
          <div className={cx("box-item")}>
            <div className={cx("upload-section")}>
              <h3>Danh sách ảnh khách sạn</h3>
              <div className={cx("image-upload-container")}>
                <label className={cx("upload-button")}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <div className={cx("add-image-button")}>
                    <span>+</span>
                  </div>
                </label>

                <div className={cx("preview-container")}>
                  {hotelForm.images?.map((preview, index) => (
                    <div key={index} className={cx("preview-image-wrapper")}>
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className={cx("preview-image")}
                      />
                      <button
                        className={cx("remove-image")}
                        onClick={() => {
                          setPreviewImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          handleChange(
                            "images",
                            (hotelForm.images || []).filter(
                              (_, i) => i !== index
                            )
                          );
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className={cx("upload-note")}>
                Chọn một hoặc nhiều ảnh để tải lên. Chấp nhận các định dạng:
                JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>

        <TextArea
          title="Mô tả"
          value={hotelForm.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Nhập mô tả khách sạn"
        />
        <div className={cx('map-container')}>
          <h3>Vị trí khách sạn trên bản đồ (Click để chọn vị trí)</h3>
          
          {/* Thêm phần tìm kiếm */}
          <div className={cx('search-container')}>
            <div className={cx('search-input')}>
              <div className={cx('search-input-wrapper')}>

              <Search
                placeholder="Tìm kiếm địa điểm..."
                handleSearch={(query) => {
                  setSearchQuery(query);
                  if (query) handleSearch();
                }}
                />
                </div>
                <div className={cx('search-button')}>
              <Button content="Tìm kiếm" onClick={handleSearch} />
                </div>
            </div>
            
            {showResults && searchResults.length > 0 && (
              <div className={cx('search-results')}>
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className={cx('search-result-item')}
                    onClick={() => handleSelectLocation(result)}
                  >
                    {result.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={cx('map-wrapper')}>
            <MapContainer
              key={`${mapCenter[0]}-${mapCenter[1]}`}
              center={[mapCenter[0], mapCenter[1]] as [number, number]}
              zoom={15}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker
                position={hotelForm.latitude && hotelForm.longitude ? [hotelForm.latitude, hotelForm.longitude] : null}
                onPositionChange={(lat: number, lng: number) => {
                  handleChange('latitude', lat);
                  handleChange('longitude', lng);
                }}
              />
            </MapContainer>
          </div>
          <div className={cx('form-row')}>
            <InputText
              value={hotelForm.latitude?.toString()}
              title="Vĩ độ"
              type="number"
              placeholder="Nhập vĩ độ"
              onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
            />
            <InputText
              value={hotelForm.longitude?.toString()}
              title="Kinh độ"
              type="number"
              placeholder="Nhập kinh độ"
              onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className={cx("button-save")}>
          <Button
            icon={<SaveOutlinedIcon />}
            content="Lưu"
            onClick={handleSave}
            disabled={isUploading}
            // showToast={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default HotelSetting;
