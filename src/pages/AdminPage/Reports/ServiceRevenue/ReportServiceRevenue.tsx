import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ReportServiceRevenue.module.scss";
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
import { getServiceReport } from "../../../../apis/reportApi";
import { getServiceTypeList } from "../../../../apis/serviceApis";
import { ServiceReport, ServiceType } from "../../../../types/hotel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const cx = classNames.bind(styles);

const ReportServiceRevenue = () => {
  const [reportsMap, setReportsMap] = useState<Map<number, ServiceReport>>(new Map());
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
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
      const newReportsMap = new Map<number, ServiceReport>();
      
      const reportPromises = serviceTypes.map(serviceType => 
        getServiceReport({
          timePeriodStart: timePeriodStart / 1000,
          timePeriodEnd: timePeriodEnd / 1000,
          serviceTypeId: serviceType.id,
        })
      );

      const reports = await Promise.all(reportPromises);
      
      reports.forEach((report, index) => {
        const processedReport = Array.isArray(report) ? report[0] : report;
        if (processedReport) {
          newReportsMap.set(serviceTypes[index].id, processedReport);
        }
      });
      if (newReportsMap.size > 0) {
        const overallReport: ServiceReport = {
          serviceTypeName: "Tổng cộng",
          serviceTypeId: -1,
          timePeriodStart: timePeriodStart / 1000,
          timePeriodEnd: timePeriodEnd / 1000,
          totalRevenue: Array.from(newReportsMap.values()).reduce((sum, report) => sum + report.totalRevenue, 0),
          usageCount: Array.from(newReportsMap.values()).reduce((sum, report) => sum + report.usageCount, 0),
          popularServiceItems: [],
        };
        newReportsMap.set(-1, overallReport);
      }
      
      setReportsMap(newReportsMap);
    } catch (error) {
      toast.error("Lấy báo cáo thất bại");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await getServiceTypeList();
        setServiceTypes(data);
      } catch (error) {
        toast.error("Lấy danh sách loại dịch vụ thất bại");
      }
    }
    initialize();
  }, [])

  useEffect(() => {
    const initialize = async () => {
      try {
        await handleFilter();
      } catch (error) {
      }
    };

    initialize();
  }, [serviceTypes]);

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
          text: 'Số lần sử dụng'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const combinedChartData = {
    labels: Array.from(reportsMap.values()).map((report) => report.serviceTypeName),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: Array.from(reportsMap.values()).map((report) => report.totalRevenue),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: 'y1',
        barThickness: 40,
      },
      {
        label: "Số lần sử dụng",
        data: Array.from(reportsMap.values()).map((report) => report.usageCount),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: 'y2',
        barThickness: 40,
      },
    ],
  };

  return (
    <Container title="Báo cáo doanh thu dịch vụ" fullscreen>
      <div className={cx("report-service-revenue")}>
        <div className={cx("filter")}>
          <div className={cx("date-picker")} onClick={() => setShowDatePicker(!showDatePicker)}>
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
          <div className={cx("reports-grid")}>
            <div className={cx("report-section", "overall")}>
              <h2>Tổng quan</h2>
              <div className={cx("charts")}>
                <div className={cx("chart-container")}>
                  <Bar options={chartOptions} data={combinedChartData} />
                </div>
              </div>
            </div>

            {serviceTypes.map((type) => {
              const report = reportsMap.get(type.id);
              if (!report) return null;

              return (
                <div key={type.id} className={cx("report-section")}>
                  <h3>{type.name}</h3>
                  <div className={cx("report-details")}>
                    <p>Doanh thu: {report.totalRevenue.toLocaleString()} VNĐ</p>
                    <p>Số lần sử dụng: {report.usageCount}</p>
                  </div>
                  <div className={cx("popular-items", "small")}>
                    {report.popularServiceItems.length > 0 ? report.popularServiceItems.map((item) => (
                      <div key={item.serviceItem.id} className={cx("item-card")}>
                        <img 
                          src={item.serviceItem.image || '/default-service.jpg'} 
                          alt={item.serviceItem.name} 
                        />
                        <div className={cx("item-info")}>
                          <h4>{item.serviceItem.name}</h4>
                          <p>Giá: {item.serviceItem.price.toLocaleString()} VNĐ</p>
                          <p>Số lần sử dụng: {item.usageCount}</p>
                        </div>
                      </div>
                    )) : <p className={cx("no-data")}>Không có dữ liệu</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ReportServiceRevenue;
