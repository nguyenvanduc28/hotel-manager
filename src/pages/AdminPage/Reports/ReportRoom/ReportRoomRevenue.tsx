import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReportRoomRevenue.module.scss";
import Container from "../../../../components/Container/Container";
import { DateRangePicker } from "react-date-range";
import { DateRange } from "@mui/icons-material";
import moment from "moment";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Scale
} from "chart.js";
import { getRoomTypeReport } from "../../../../apis/reportApi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const cx = classNames.bind(styles);

interface RoomTypeReport {
  roomTypeId: number;
  roomTypeName: string;
  totalRevenue: number;
  totalBookings: number;
  timePeriodStart: number;
  timePeriodEnd: number;
}

const ReportRoomRevenue = () => {
  const [reports, setReports] = useState<RoomTypeReport[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timePeriodStart, setTimePeriodStart] = useState<number>(
    moment().subtract(30, 'days').valueOf()
  );
  const [timePeriodEnd, setTimePeriodEnd] = useState<number>(
    moment().valueOf()
  );
  const [loading, setLoading] = useState(true);

  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setTimePeriodStart(startDate.getTime());
    setTimePeriodEnd(endDate.getTime());
  };

  const handleFilter = async () => {
    setShowDatePicker(false);
    setLoading(true);
    try {
      const data = await getRoomTypeReport({
        timePeriodStart: timePeriodStart / 1000,
        timePeriodEnd: timePeriodEnd / 1000,
        serviceTypeId: 0,
      });
      setReports(data);
    } catch (error) {
      toast.error("Lấy báo cáo thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y1: {
        type: 'linear' as const,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)'
        }
      },
      y2: {
        type: 'linear' as const,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số lượt đặt phòng'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const combinedChartData = {
    labels: reports.map((report) => report.roomTypeName),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: reports.map((report) => report.totalRevenue),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: 'y1',
        barThickness: 40,
      },
      {
        label: "Số lượt đặt phòng",
        data: reports.map((report) => report.totalBookings),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: 'y2',
        barThickness: 40,
      },
    ],
  };

  return (
    <Container title="Báo cáo doanh thu phòng" fullscreen>
      <div className={cx("report-room-revenue")}>
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
            <button className={cx("filter-button-content")} onClick={handleFilter}>
              Lọc
            </button>
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

        {loading ? (
          <div className={cx("loading")}>
            <CircularProgress />
          </div>
        ) : (
          <div className={cx("charts")}>
            <div className={cx("chart-container")}>
              <h3>Thống kê doanh thu và lượt đặt theo loại phòng</h3>
              <Bar options={chartOptions} data={combinedChartData} />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ReportRoomRevenue;
