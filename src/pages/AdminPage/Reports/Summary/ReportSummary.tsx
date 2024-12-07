import { useEffect, useState } from "react";
import Container from "../../../../components/Container/Container";
import styles from "./ReportSummary.module.scss";
import classNames from "classnames/bind";
import { GeneralReport } from "../../../../types/hotel";
import { getGeneralReport } from "../../../../apis/reportApi";
import { DateRangePicker } from "react-date-range";
import { DateRange } from "@mui/icons-material";
import moment from "moment";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const cx = classNames.bind(styles);

const ReportSummary = () => {
  const [report, setReport] = useState<GeneralReport | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timePeriodStart, setTimePeriodStart] = useState<number>(
    moment().startOf("month").valueOf()
  );
  const [timePeriodEnd, setTimePeriodEnd] = useState<number>(
    moment().endOf("month").valueOf()
  );

  const handleDateChange = async (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setTimePeriodStart(startDate.getTime());
    setTimePeriodEnd(endDate.getTime());
  };

  const handleFilter = async () => {
    setShowDatePicker(false);
    try {
      const data = await getGeneralReport({
        timePeriodStart: timePeriodStart / 1000,
        timePeriodEnd: timePeriodEnd / 1000,
        serviceTypeId: 0,
      });
      setReport(data);
    } catch (error) {
      toast.error("Lấy báo cáo thất bại");
    }
  };

  useEffect(() => {
    handleDateChange({
      selection: {
        startDate: moment().subtract(1, 'month').startOf('month').toDate(),
        endDate: moment().subtract(1, 'month').endOf('month').toDate(),
      },
    });
    handleFilter();
  }, []);

  return (
    <Container title="Báo cáo tổng quan" fullscreen>
      <div className={cx("report-summary")}>
        <div className={cx("filter")}>
          <div
            className={cx("date-picker")}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <DateRange />
            <span>
              {moment(timePeriodStart).format("DD/MM/YYYY")} -{" "}
              {moment(timePeriodEnd).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className={cx("filter-button")}>
            <button className={cx("filter-button-content")} onClick={handleFilter}>Lọc</button>
          </div>
          {showDatePicker && (
            <div className={cx("date-picker-container")}>
              <DateRangePicker
                ranges={[
                  {
                    startDate: new Date(timePeriodStart),
                    endDate: new Date(timePeriodEnd),
                    key: "selection",
                  },
                ]}
                onChange={handleDateChange}
                showDateDisplay={false}
                moveRangeOnFirstSelection={false}
                staticRanges={[]}
                inputRanges={[]}
                months={2}
                direction="horizontal"
              />
            </div>
          )}
        </div>

        {report ? (
          <div className={cx("report-grid")}>
            <div className={cx("report-item")}>
              <h3>Tổng doanh thu</h3>
              <p>{report.totalRevenue.toLocaleString()}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Doanh thu từ phòng</h3>
              <p>{report.roomRevenue.toLocaleString()}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Doanh thu từ dịch vụ</h3>
              <p>{report.serviceRevenue.toLocaleString()}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Doanh thu từ tiêu dùng</h3>
              <p>{report.consumableRevenue.toLocaleString()}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Tổng số đơn</h3>
              <p>{report.totalBookings}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Đơn hoàn thành</h3>
              <p>{report.totalCompletedBookings}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Đơn đã hủy</h3>
              <p>{report.totalCanceledBookings}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Tổng khách hàng</h3>
              <p>{report.totalCustomers}</p>
            </div>
            <div className={cx("report-item")}>
              <h3>Doanh thu trung bình/đơn</h3>
              <p>{report.averageRevenuePerBooking.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className={cx("loading")}>
            <CircularProgress />
          </div>
        )}
      </div>
    </Container>
  );
};

export default ReportSummary;
