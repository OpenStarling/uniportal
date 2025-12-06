import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ComparisonPage from './ComparisonPage';
import './App.css';
import universityData from './unis.json';

// Helper function to safely process ratings
const processRating = (rating) => {
  if (rating === null || rating === undefined || rating === '') {
    return { clean: '', number: null, original: rating };
  }
  
  const ratingStr = String(rating);
  const clean = ratingStr.replace('#', '');
  const number = parseInt(clean);
  
  return {
    clean: !isNaN(number) ? clean : '',
    number: !isNaN(number) ? number : null,
    original: rating
  };
};

// Компонент модального окна с деталями университета
const UniversityDetailsModal = ({ isOpen, onClose, university }) => {
  if (!isOpen || !university) return null;

  const formatRanking = (ranking) => {
    const { clean, number } = processRating(ranking);
    return number !== null ? clean + ' орны' : 'Рейтинг жоқ';
  };

  const hasTour = university["3dtour"] && university["3dtour"].trim() !== '';

  const renderTourContent = () => {
    if (!hasTour) {
      return (
        <div className="no-tour-section">
          <i className="fas fa-map-marked-alt"></i>
          <p>Виртуалды тур қолжетімді емес</p>
        </div>
      );
    }

    const tourUrl = university["3dtour"];
    
    // Проверяем тип тура
    if (tourUrl.includes('youtube.com') || tourUrl.includes('youtu.be')) {
      let videoId = '';
      if (tourUrl.includes('watch?v=')) {
        videoId = tourUrl.split('watch?v=')[1].split('&')[0];
      } else if (tourUrl.includes('youtu.be/')) {
        videoId = tourUrl.split('youtu.be/')[1];
      }
      
      if (videoId) {
        return (
          <div className="tour-section">
            <h4><i className="fas fa-vr-cardboard"></i> Виртуалды тур</h4>
            <div className="youtube-tour">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`${university.name} виртуалды туры`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        );
      }
    }
    
    // Для других URL открываем в iframe
    return (
      <div className="tour-section">
        <h4><i className="fas fa-vr-cardboard"></i> Виртуалды тур</h4>
        <div className="website-tour">
          <iframe
            src={tourUrl}
            title={`${university.name} виртуалды туры`}
            width="100%"
            height="400"
            style={{ border: 'none' }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
          <a href={tourUrl} target="_blank" rel="noopener noreferrer" className="open-external">
            <i className="fas fa-external-link-alt"></i> Жаңа бетте ашу
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="details-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="details-modal-body">
          {/* Заголовок с городом и рейтингом */}
          <div className="university-header">
            <div className="university-title-section">
              <h2>{university.name}</h2>
              <div className="header-details">
                <span className="detail-city">
                  <i className="fas fa-map-marker-alt"></i>
                  {university.city}
                </span>
                <span className="detail-ranking">
                  <i className="fas fa-chart-line"></i>
                  {formatRanking(university.ratings)}
                </span>
              </div>
            </div>
          </div>

          <div className="details-content">
            {/* Миссия */}
            <div className="detail-section">
              <h4><i className="fas fa-bullseye"></i> Миссия</h4>
              <p>{university.mission}</p>
            </div>

            {/* Академические программы */}
            <div className="detail-section">
              <h4><i className="fas fa-graduation-cap"></i> Академиялық бағдарламалар</h4>
              <div className="programs-grid">
                {university.academprograms && university.academprograms.map((program, index) => (
                  <span key={index} className="program-tag">
                    {program}
                  </span>
                ))}
              </div>
            </div>

            {/* Международное сотрудничество */}
            {university["international cooperation"] && (
              <div className="detail-section">
                <h4><i className="fas fa-globe"></i> Халықаралық ынтымақтастық</h4>
                <p>{university["international cooperation"]}</p>
              </div>
            )}

            {/* Виртуальный тур */}
            {renderTourContent()}

            {/* Ссылки */}
            <div className="links-section">
              <h4><i className="fas fa-link"></i> Сілтемелер</h4>
              <div className="links-grid">
                {university.website && (
                  <a 
                    href={university.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-btn website-link"
                  >
                    <i className="fas fa-globe"></i>
                    <div>
                      <strong>Ресми вебсайт</strong>
                      <small>Университеттің ресми сайты</small>
                    </div>
                  </a>
                )}
                
                {university["application and admission"] && (
                  <a 
                    href={university["application and admission"]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link-btn admission-link"
                  >
                    <i className="fas fa-user-graduate"></i>
                    <div>
                      <strong>Түсу бөлімі</strong>
                      <small>Қабылдау туралы ақпарат</small>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Основной компонент приложения
function MainApp() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [stats, setStats] = useState({
    total: 0,
    cities: 0,
    withWebsite: 0,
    withTour: 0
  });

  const location = useLocation();

  // Инициализация данных
  useEffect(() => {
    const formattedData = universityData.map(uni => {
      const { number } = processRating(uni.ratings);
      return {
        ...uni,
        rankingNumber: number !== null ? number : 9999
      };
    });
    
    setUniversities(formattedData);
    setFilteredUniversities(formattedData);
    
    // Расчет статистики
    const cities = [...new Set(formattedData.map(u => u.city))];
    const withWebsite = formattedData.filter(u => u.website).length;
    const withTour = formattedData.filter(u => u["3dtour"] && u["3dtour"].trim() !== '').length;
    
    setStats({
      total: formattedData.length,
      cities: cities.length,
      withWebsite,
      withTour
    });
  }, []);

  // Умная сортировка
  const sortUniversities = (data) => {
    return [...data].sort((a, b) => {
      let compareA, compareB;
      
      switch (sortBy) {
        case 'name':
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          return sortOrder === 'asc' 
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
            
        case 'city':
          compareA = a.city.toLowerCase();
          compareB = b.city.toLowerCase();
          return sortOrder === 'asc'
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
            
        case 'ranking':
          compareA = a.rankingNumber;
          compareB = b.rankingNumber;
          return sortOrder === 'asc'
            ? compareA - compareB
            : compareB - compareA;
            
        case 'programs':
          compareA = a.academprograms?.length || 0;
          compareB = b.academprograms?.length || 0;
          return sortOrder === 'asc'
            ? compareA - compareB
            : compareB - compareA;
            
        default:
          return 0;
      }
    });
  };

  // Фильтрация
  useEffect(() => {
    let filtered = universities;
    
    if (selectedCity !== 'All') {
      filtered = filtered.filter(u => u.city === selectedCity);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.academprograms && u.academprograms.some(program => 
          program.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }
    
    // Применяем сортировку
    filtered = sortUniversities(filtered);
    
    setFilteredUniversities(filtered);
  }, [selectedCity, searchQuery, universities, sortBy, sortOrder]);

  const getUniqueCities = () => {
    const cities = ['All', ...new Set(universities.map(u => u.city).sort())];
    return cities;
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const openDetails = (university) => {
    setSelectedUniversity(university);
    setShowDetailsModal(true);
  };

  const formatRanking = (ranking) => {
    const { clean, number } = processRating(ranking);
    return number !== null ? clean + ' орны' : 'Рейтинг жоқ';
  };

  // Компонент карточки университета
  const UniversityCard = ({ university, onDetailsClick }) => {
    const getCityColor = (city) => {
      const colors = {
        'Алматы': '#2E5AAC',
        'Астана': '#0E9F6E',
        'Ақтөбе': '#F05252',
        'Атырау': '#8B5CF6',
        'Қарағанды': '#F59E0B',
        'Шымкент': '#DC2626',
        'Семей': '#10B981',
        'Павлодар': '#F97316',
        'Көкшетау': '#6366F1',
        'Қостанай': '#8B5CF6',
        'Өскемен': '#059669',
        'Тараз': '#7C3AED',
        'Орал': '#D97706',
        'default': '#6B7280'
      };
      return colors[city] || colors.default;
    };

    return (
      <div className="university-card">
        <div className="card-header">
          <div className="city-badge" style={{ backgroundColor: getCityColor(university.city) }}>
            <i className="fas fa-map-marker-alt"></i>
            {university.city}
          </div>
          {university["3dtour"] && university["3dtour"].trim() !== '' && (
            <span className="tour-badge">
              <i className="fas fa-vr-cardboard"></i>
              3D Тур
            </span>
          )}
        </div>
        
        <div className="university-main-info">
          <h3 className="university-name">{university.name}</h3>
          <div className="ranking-info">
            <i className="fas fa-chart-line ranking-icon"></i>
            <span className="ranking-text">{formatRanking(university.ratings)}</span>
          </div>
        </div>
        
        <div className="card-footer">
          <div className="action-buttons">
            <button 
              className="details-btn"
              onClick={() => onDetailsClick(university)}
            >
              <i className="fas fa-info-circle"></i>
              Толығырақ
            </button>
            <Link 
              to="/comparison" 
              state={{ university }}
              className="compare-btn"
            >
              <i className="fas fa-balance-scale"></i>
              Салыстыру
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Навигация */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-university"></i>
            <span>Қазақстан Университеттері</span>
          </div>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <i className="fas fa-home"></i> Басты бет
            </Link>
            <Link 
              to="/comparison" 
              className={`nav-link ${location.pathname === '/comparison' ? 'active' : ''}`}
            >
              <i className="fas fa-balance-scale"></i> Салыстыру
            </Link>
          </div>
        </div>
      </nav>

      {/* Шапка (только на главной) */}
      {location.pathname === '/' && (
        <>
          <header className="header">
            <div className="header-content">
              <div className="title-section">
                <h1>Қазақстан Жоғары Оқу Орындары</h1>
                <p className="subtitle">Рейтингтер және виртуалды турлар</p>
              </div>
              
              <div className="stats-container">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-university"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.total}</h3>
                    <p>Барлық университеттер</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.cities}</h3>
                    <p>Қалалар</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-vr-cardboard"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.withTour}</h3>
                    <p>Виртуалды турлар</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Фильтры и сортировка */}
          <div className="filters-container">
            <div className="search-section">
              <div className="search-box">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Университет немесе қала бойынша іздеу..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
              
              <div className="sort-section">
                <span className="sort-label">Сұрыптау:</span>
                <div className="sort-buttons">
                  <button 
                    className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                    onClick={() => handleSortChange('name')}
                  >
                    Атауы {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-btn ${sortBy === 'city' ? 'active' : ''}`}
                    onClick={() => handleSortChange('city')}
                  >
                    Қала {sortBy === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-btn ${sortBy === 'ranking' ? 'active' : ''}`}
                    onClick={() => handleSortChange('ranking')}
                  >
                    Рейтинг {sortBy === 'ranking' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    className={`sort-btn ${sortBy === 'programs' ? 'active' : ''}`}
                    onClick={() => handleSortChange('programs')}
                  >
                    Бағдарламалар {sortBy === 'programs' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="filter-section">
              <div className="filter-group">
                <label>Қала бойынша:</label>
                <div className="city-buttons">
                  <button
                    className={`city-btn ${selectedCity === 'All' ? 'active' : ''}`}
                    onClick={() => handleCityChange('All')}
                  >
                    Барлығы
                  </button>
                  {getUniqueCities().slice(1, 9).map(city => (
                    <button
                      key={city}
                      className={`city-btn ${selectedCity === city ? 'active' : ''}`}
                      onClick={() => handleCityChange(city)}
                    >
                      {city}
                    </button>
                  ))}
                  {getUniqueCities().length > 9 && (
                    <select
                      className="city-dropdown"
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                    >
                      <option value="All">Барлық қалалар</option>
                      {getUniqueCities().slice(9).map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Маршруты */}
      <Routes>
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/" element={
          <main className="main-content">
            <div className="results-info">
              <h3>Табылды: {filteredUniversities.length} университет</h3>
              {selectedCity !== 'All' && (
                <span className="active-filter">
                  <i className="fas fa-map-marker-alt"></i>
                  {selectedCity}
                </span>
              )}
              {sortBy !== 'name' && (
                <span className="active-filter">
                  <i className="fas fa-sort"></i>
                  {sortBy === 'city' ? 'Қала бойынша' : 
                   sortBy === 'ranking' ? 'Рейтинг бойынша' : 
                   'Бағдарламалар бойынша'} {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
            
            {filteredUniversities.length === 0 ? (
              <div className="no-results">
                <i className="fas fa-university"></i>
                <h3>Университеттер табылған жоқ</h3>
                <p>Сіздің іздеу шарттарыңызға сәйкес университеттер табылмады</p>
              </div>
            ) : (
              <div className="universities-grid">
                {filteredUniversities.map((uni, index) => (
                  <UniversityCard 
                    key={index}
                    university={uni}
                    onDetailsClick={openDetails}
                  />
                ))}
              </div>
            )}
          </main>
        } />
      </Routes>

      {/* Модальное окно с деталями университета */}
      <UniversityDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        university={selectedUniversity}
      />

      {/* Подвал */}
      <footer className="footer">
        <p>© 2025 Қазақстан Жоғары Оқу Орындары Каталогы</p>
        <p className="footer-info">
          Барлығы: {stats.total} университет | {stats.cities} қала | {stats.withTour} виртуалды тур
        </p>
      </footer>
    </div>
  );
}

// Основной компонент App с роутингом
function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;