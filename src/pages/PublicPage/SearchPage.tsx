import styles from './SearchPage.module.scss';  
import classNames from 'classnames/bind';
import { useState } from 'react';
import { HotelSearchResult } from '../../types/hotel';
import { searchHotels } from '../../apis/hotelApis';
import { toast } from 'react-toastify';
import SearchBar from './components/SearchBar/SearchBar';
import HotelCard from './components/HotelCard/HotelCard';
const cx = classNames.bind(styles);
import PublicPage from './PublicPage';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [checkInDate, setCheckInDate] = useState<number>(0);
    const [checkOutDate, setCheckOutDate] = useState<number>(0);
  
    const handleSearch = async (searchData: {
      location: string;
      checkIn: number;
      checkOut: number;
    }) => {
      try {
        setIsLoading(true);
        const results = await searchHotels({
          location: searchData.location,
          checkInDate: searchData.checkIn / 1000,
          checkOutDate: searchData.checkOut / 1000
        });
        setSearchResults(results);
        setCheckInDate(searchData.checkIn / 1000);
        setCheckOutDate(searchData.checkOut / 1000);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
  return <PublicPage>
    <main className={cx('main-content')}>
        <div className={cx('search-section')}>
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className={cx('results-section')}>
          {isLoading ? (
            <div className={cx('loading')}>Đang tìm kiếm...</div>
          ) : searchResults.length > 0 ? (
            <div className={cx('search-results')}>
              {searchResults.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} checkInDate={checkInDate} checkOutDate={checkOutDate} />
              ))}
            </div>
          ) : (
            <div className={cx('no-results')}>
              <p>Hãy tìm kiếm địa điểm</p>
            </div>
          )}
        </div>
      </main>
  </PublicPage>;
};

export default SearchPage;
