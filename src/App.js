import React, { useState, useEffect } from 'react';
import './App.css';

// Импортируем Font Awesome через CDN (добавьте в index.html)
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

function App() {
  // Данные университетов
  const universitiesData = [
    {
      "name": "Әл-Фараби атындағы Қазақ ұлттық университеті",
      "city": "Алматы",
      "website": null
    },
    {
      "name": "Абай атындағы Қазақ ұлттық педагогикалық университеті",
      "city": "Алматы",
      "website": "abaluniversity.edu.kz"
    },
    {
      "name": "С.Ж. Асфендияров атындағы Қазақ ұлттық медицина университеті",
      "city": "Алматы",
      "website": "kaznmu.edu.kz"
    },
    {
      "name": "Қазақ ұлттық аграрлық зерттеу университеті",
      "city": "Алматы",
      "website": "kaznaru.edu.kz"
    },
    {
      "name": "Қазақ ұлттық қыздар педагогикалық университеті",
      "city": "Алматы",
      "website": "qyzpu.edu.kz"
    },
    {
      "name": "Т. Жүргенов атындағы Қазақ ұлттық өнер академиясы",
      "city": "Алматы",
      "website": "kaznai.kz"
    },
    {
      "name": "Құрманғазы атындағы Қазақ ұлттық консерваториясы",
      "city": "Алматы",
      "website": "conservatoire.edu.kz"
    },
    {
      "name": "Л.Н. Гумилев атындағы Еуразия ұлттық университеті",
      "city": "Астана",
      "website": "enu.kz"
    },
    {
      "name": "К. Байсейтова атындағы Қазақ ұлттық өнер университеті",
      "city": "Астана",
      "website": "kaznul.edu.kz"
    },
    {
      "name": "Қазақ ұлттық хореография академиясы",
      "city": "Астана",
      "website": "balletacademy.edu.kz"
    },
    {
      "name": "Қазақ ұлттық су шаруашылығы және ирригация университеті",
      "city": "Тараз",
      "website": "kaznuvhi.edu.kz"
    },
    {
      "name": "Академик Е.А. Бекетов атындағы Қарағанды ұлттық университеті",
      "city": "Қарағанды",
      "website": "buketov.edu.kz"
    },
    {
      "name": "Ш. Есенов атындағы Каспий технологиялар және инжиниринг университеті",
      "city": "Ақтау",
      "website": "yu.edu.kz"
    },
    {
      "name": "Қ. Жұбанов атындағы Ақтебе өңірлік университеті",
      "city": "Ақтебе",
      "website": "zhubanov.edu.kz"
    },
    {
      "name": "М. Оспанов атындағы Батыс Қазақстан медицина университеті",
      "city": "Ақтебе",
      "website": "zkmu.edu.kz"
    },
    {
      "name": "Азаматтық авиация академиясы",
      "city": "Алматы",
      "website": "саa.edu.kz"
    },
    {
      "name": "Қазақстан-Британ техникалық университеті",
      "city": "Алматы",
      "website": "kbtu.edu.kz"
    },
    {
      "name": "Ы. Алтынсарин атындағы Арқалық педагогикалық университеті",
      "city": "Арқалық",
      "website": "api.edu.kz"
    },
    {
      "name": "С. Сейфуллин атындағы Қазақ агротехникалық зерттеу университеті",
      "city": "Астана",
      "website": "kazatu.edu.kz"
    },
    {
      "name": "Астана медицина университеті",
      "city": "Астана",
      "website": "amu.edu.kz"
    },
    {
      "name": "Х. Досмухамедов атындағы Атырау университеті",
      "city": "Атырау",
      "website": "asu.edu.kz"
    },
    {
      "name": "С. Өтебаев атындағы Атырау мұнай және газ университеті",
      "city": "Атырау",
      "website": "aogu.edu.kz"
    },
    {
      "name": "Ш. Уелиханов атындағы Көкшетау университеті",
      "city": "Көкшетау",
      "website": "shokan.edu.kz"
    },
    {
      "name": "Д. Серікбаев атындағы Шығыс Қазақстан техникалық университеті",
      "city": "Өскемен",
      "website": "ektu.kz"
    },
    {
      "name": "Торайғыров университеті",
      "city": "Павлодар",
      "website": "tou.edu.kz"
    },
    {
      "name": "Э. Маргулан атындағы Павлодар педагогикалық университеті",
      "city": "Павлодар",
      "website": "ppu.edu.kz"
    },
    {
      "name": "М. Қозыбаев атындағы Солтүстік Қазақстан университеті",
      "city": "Петропавл",
      "website": "ku.edu.kz"
    },
    {
      "name": "Рудный индустриялық университеті",
      "city": "Рудный",
      "website": "rli.edu.kz"
    },
    {
      "name": "Шекерім университеті",
      "city": "Семей",
      "website": "shakarim.edu.kz"
    },
    {
      "name": "Семей медицина университеті",
      "city": "Семей",
      "website": "smu.edu.kz"
    },
    {
      "name": "І. Жансүгіров атындағы Жетісу университеті",
      "city": "Талдықорған",
      "website": "zhetysu.edu.kz"
    },
    {
      "name": "Э. Сағынов атындағы Қарағанды техникалық университеті",
      "city": "Қарағанды",
      "website": "kstu.kz"
    },
    {
      "name": "Қарағанды медицина университеті",
      "city": "Қарағанды",
      "website": "qmu.edu.kz"
    },
    {
      "name": "А. Байтұрсынулы атындағы Қостанай өңірлік университеті",
      "city": "Қостанай",
      "website": "ksu.edu.kz"
    },
    {
      "name": "Қорқыт Ата атындағы Қызылорда университеті",
      "city": "Қызылорда",
      "website": "korkyt.edu.kz"
    },
    {
      "name": "М. Өтемісов атындағы Батыс Қазақстан университеті",
      "city": "Орал",
      "website": "wku.edu.kz"
    },
    {
      "name": "Жөңгір хан атындағы Батыс Қазақстан аграрлық-техникалық университеті",
      "city": "Орал",
      "website": "wkau.edu.kz"
    },
    {
      "name": "С. Аманжолов атындағы Шығыс Қазақстан университеті",
      "city": "Өскемен",
      "website": "vku.edu.kz"
    },
    {
      "name": "Халықаралық ақпараттық технологиялар университеті",
      "city": "Алматы",
      "website": "iitu.edu.kz"
    },
    {
      "name": "«Нұр-Мүбарак» Египет ислам мәдениеті университеті",
      "city": "Алматы",
      "website": "nmu.edu.kz"
    },
    {
      "name": "F. Дәукеев атындағы Алматы энергетика және байланыс университеті",
      "city": "Алматы",
      "website": "aues.edu.kz"
    },
    {
      "name": "КИМЭП университеті",
      "city": "Алматы",
      "website": "kimep.kz"
    },
    {
      "name": "Абылай хан атындағы Қазақ халықаралық қатынастар және әлем тілдері университеті",
      "city": "Алматы",
      "website": "ablaikhan.kz"
    },
    {
      "name": "«Тұран» университеті",
      "city": "Алматы",
      "website": "turan.edu.kz"
    },
    {
      "name": "М. Тынышбаев атындағы ALT университеті",
      "city": "Алматы",
      "website": "alt.edu.kz"
    },
    {
      "name": "Нархоз университеті",
      "city": "Алматы",
      "website": "narxoz.edu.kz"
    },
    {
      "name": "Алматы технологиялық университеті",
      "city": "Алматы",
      "website": "atu.edu.kz"
    },
    {
      "name": "Қазақстан-Неміс университеті",
      "city": "Алматы",
      "website": "dku.kz"
    },
    {
      "name": "К. Сағадиев атындағы Халықаралық бизнес университеті (UIB)",
      "city": "Алматы",
      "website": "uib.edu.kz"
    },
    {
      "name": "Қонаев Университеті",
      "city": "Алматы",
      "website": "vuzkunaeva.kz"
    },
    {
      "name": "Еуразия технологиялық университеті",
      "city": "Алматы",
      "website": "etu.edu.kz"
    },
    {
      "name": "Каспий қоғамдық университеті (Caspian University)",
      "city": "Алматы",
      "website": "cu.edu.kz"
    },
    {
      "name": "Халықаралық инженерлік-технологиялық университеті",
      "city": "Алматы",
      "website": "metu.edu.kz"
    },
    {
      "name": "Халықаралық көліктік-гуманитарлық университеті",
      "city": "Алматы",
      "website": "mtgu.edu.kz"
    },
    {
      "name": "Алматы гуманитарлық-экономикалық университеті",
      "city": "Алматы",
      "website": "ageu.edu.kz"
    },
    {
      "name": "Қазақстан-Ресей медициналық университеті",
      "city": "Алматы",
      "website": "krmu.edu.kz"
    },
    {
      "name": "Алматы менеджмент университеті (AlmaU)",
      "city": "Алматы",
      "website": "almau.edu.kz"
    },
    {
      "name": "«ҚДЖСМ» Қазақстандық медицина университеті",
      "city": "Алматы",
      "website": "ksph.edu.kz"
    },
    {
      "name": "Q University",
      "city": "Алматы",
      "website": "q-university.kz"
    },
    {
      "name": "Халықаралық білім беру корпорациясы (Қазақ бас сәулет-құрылыс академиясы, Қазақ-Америка Университеті)",
      "city": "Алматы",
      "website": "mok.edu.kz"
    },
    {
      "name": "М.С. Нәрікбаев атындағы КАЗГЮУ университеті",
      "city": "Астана",
      "website": "mnu.kz"
    },
    {
      "name": "Astana IT University",
      "city": "Астана",
      "website": "astanait.edu.kz"
    },
    {
      "name": "Астана халықаралық университеті",
      "city": "Астана",
      "website": "alu.kz"
    },
    {
      "name": "Esil University",
      "city": "Астана",
      "website": "esil.edu.kz"
    },
    {
      "name": "Қ. Құлажанов атындағы Қазақ технология және бизнес университеті",
      "city": "Астана",
      "website": "kaztbu.edu.kz"
    },
    {
      "name": "«Тұран-Астана» Университеті",
      "city": "Астана",
      "website": "tau.edu.kz"
    },
    {
      "name": "Баишев Университеті",
      "city": "Ақтөбе",
      "website": "bu.edu.kz"
    },
    {
      "name": "Е.А. Байқоныров атындағы Жезқазған университеті",
      "city": "Жезқазған",
      "website": "zhezu.edu.kz"
    },
    {
      "name": "А. Мырзахметов атындағы Көкшетау университеті",
      "city": "Көкшетау",
      "website": "kuam.edu.kz"
    },
    {
      "name": "Қазтутынуодағы Қарағанды университеті",
      "city": "Қарағанды",
      "website": "keu.kz"
    },
    {
      "name": "SDU University",
      "city": "Қаскелен",
      "website": "sdu.edu.kz"
    },
    {
      "name": "М. Дулатов атындағы Қостанай инженерлік-экономикалық университеті",
      "city": "Қостанай",
      "website": "kineu.edu.kz"
    },
    {
      "name": "Академик З. Алдамжар атындағы Қостанай әлеуметтік-техникалық университеті",
      "city": "Қостанай",
      "website": "kosstu.edu.kz"
    },
    {
      "name": "«Болашақ» Қызылорда университеті",
      "city": "Қызылорда",
      "website": "bolashak.edu.kz"
    },
    {
      "name": "Қызылорда ашық университеті",
      "city": "Қызылорда",
      "website": "ouk.edu.kz"
    },
    {
      "name": "Батыс Қазақстан инновациялық-технологиялық университеті",
      "city": "Орал",
      "website": "wkitu.kz"
    },
    {
      "name": "Қазақстан инновациялық және телекоммуникациялық жүйелер университеті",
      "city": "Орал",
      "website": "kazuits.edu.kz"
    },
    {
      "name": "Қазақстан-Америка еркін университеті",
      "city": "Өскемен",
      "website": "kafu.edu.kz"
    },
    {
      "name": "Инновациялық Еуразия университеті",
      "city": "Павлодар",
      "website": "ineu.edu.kz"
    },
    {
      "name": "Элихан Бекейхан университеті",
      "city": "Семей",
      "website": "abu.edu.kz"
    },
    {
      "name": "Академик Э. Куатбеков атындағы Халықтар Достығы университеті",
      "city": "Шымкент",
      "website": "udn.edu.kz"
    },
    {
      "name": "Ж.А. Төшенев атындағы университет",
      "city": "Шымкент",
      "website": "tashenev.edu.kz"
    },
    {
      "name": "«Мирас» Университеті",
      "city": "Шымкент",
      "website": "miras.edu.kz"
    },
    {
      "name": "Орталық Азия Инновациялық Университеті",
      "city": "Шымкент",
      "website": "caiu.edu.kz"
    },
    {
      "name": "КР Ішкі істер министрлігінің М.Есболатов атындағы Алматы академиясы",
      "city": "Алматы",
      "website": "alpolac.edu.kz"
    },
    {
      "name": "КР Ішкі істер министрлігінің Б.Бейсенов атындағы Қарағанды академиясы",
      "city": "Қарағанды",
      "website": "kpa.edu.kz"
    },
    {
      "name": "КР Ішкі істер министрлігінің М.Бекенбаев атындағы Ақтөбе заң институты",
      "city": "Ақтөбе",
      "website": "auimvd.edu.kz"
    },
    {
      "name": "КР Ішкі істер министрлігінің басқару академиясы",
      "city": "Астана",
      "website": null
    },
    {
      "name": "КР Қорғаныс министрлігінің Ұлттық қорғаныс университеті",
      "city": "Астана",
      "website": "nuo.kz"
    },
    {
      "name": "КР Қорғаныс министрлігінің Радиоэлектроника және байланыс әскери-инженерлік институты",
      "city": "Алматы",
      "website": "vlires.edu.kz"
    },
    {
      "name": "КР Қорғаныс министрлігінің Екі мөрте Кеңес Одағының Батыры Т.Ж.Бигелдинов атындағы Әуе қорғанысы күштерінің әскери институты",
      "city": "Ақтөбе",
      "website": "visvo.edu.kz"
    },
    {
      "name": "КР Жоғары Сот Кеңесінің жанындағы Сот төрелігі академиясы",
      "city": "Астана",
      "website": "sta.edu.kz"
    },
    {
      "name": "ҚР Бас прокуратурасының жанындағы Құқық қорғау органдары академиясы",
      "city": "Қосшы",
      "website": "academy-gp.kz"
    },
    {
      "name": "\"АМL ACADEMY\" Қаржылық мониторинг академиясы",
      "city": "Астана",
      "website": "amlacademy.kz"
    },
    {
      "name": "ҚР Ұлттық қауіпсіздік комитетінің академиясы",
      "city": "Алматы",
      "website": null
    },
    {
      "name": "ҚР Ұлттық қауіпсіздік комитетінің Шекара академиясы",
      "city": "Алматы",
      "website": null
    },
    {
      "name": "ҚР Төтенше жағдайлар министрлігінің М.Ғабдуллин атындағы Азаматтық қорғаныс академиясы",
      "city": "Көкшетау",
      "website": "agz.edu.kz"
    },
    {
      "name": "ҚР Ұлттық ұланының академиясы",
      "city": "Петропавл",
      "website": "ang.edu.kz"
    },
    {
      "name": "ҚР Ішкі істер министрлігінің Ш.Қабылбаев атындағы Қостанай академиясы",
      "city": "Қостанай",
      "website": "qpa.edu.kz"
    },
    {
      "name": "Шымкент университеті",
      "city": "Шымкент",
      "website": "univershu.edu.kz"
    }
  ];

  // Состояния
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWebsiteOnly, setShowWebsiteOnly] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    cities: 0,
    withWebsite: 0
  });

  // Инициализация данных
  useEffect(() => {
    const sortedData = [...universitiesData].sort((a, b) => a.name.localeCompare(b.name));
    setUniversities(sortedData);
    setFilteredUniversities(sortedData);
    
    // Расчет статистики
    const cities = [...new Set(sortedData.map(u => u.city))];
    const withWebsite = sortedData.filter(u => u.website).length;
    
    setStats({
      total: sortedData.length,
      cities: cities.length,
      withWebsite
    });
  }, []);

  // Применение фильтров
  useEffect(() => {
    let filtered = universities;
    
    // Фильтр по городу
    if (selectedCity !== 'All') {
      filtered = filtered.filter(u => u.city === selectedCity);
    }
    
    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Фильтр по наличию сайта
    if (showWebsiteOnly) {
      filtered = filtered.filter(u => u.website);
    }
    
    setFilteredUniversities(filtered);
  }, [selectedCity, searchQuery, showWebsiteOnly, universities]);

  // Получение уникальных городов
  const getUniqueCities = () => {
    const cities = ['All', ...new Set(universities.map(u => u.city).sort())];
    return cities;
  };

  // Обработчик изменения города
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  // Обработчик поиска
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Обработчик фильтра по сайту
  const handleWebsiteFilterChange = () => {
    setShowWebsiteOnly(!showWebsiteOnly);
  };

  // Компонент карточки университета
  const UniversityCard = ({ university }) => {
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
        'Петропавл': '#0891B2',
        'default': '#6B7280'
      };
      return colors[city] || colors.default;
    };

    const cityColor = getCityColor(university.city);

    return (
      <div className="university-card">
        <div className="card-header">
          <div className="city-tag" style={{ backgroundColor: cityColor }}>
            <i className="fas fa-map-marker-alt"></i>
            <span>{university.city}</span>
          </div>
          {university.website && (
            <div className="website-indicator">
              <i className="fas fa-globe"></i>
              <span>Вебсайт</span>
            </div>
          )}
        </div>
        
        <div className="card-body">
          <h3 className="university-name">{university.name}</h3>
        </div>
        
        <div className="card-footer">
          {university.website ? (
            <a 
              href={`https://${university.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="website-link"
            >
              <i className="fas fa-external-link-alt"></i>
              <span className="website-url">{university.website}</span>
            </a>
          ) : (
            <div className="no-website">
              <i className="fas fa-unlink"></i>
              <span>Веб-сайт жоқ</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Шапка */}
      <header className="header">
        <div className="header-content">
          <div className="title-section">
            <h1>Қазақстан Жоғары Оқу Орындары</h1>
            <p className="subtitle">Kazakhstan Higher Education Institutions Directory</p>
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
                <i className="fas fa-globe"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.withWebsite}</h3>
                <p>Веб-сайты бар</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Панель фильтров */}
      <div className="filters-container">
        <div className="filters-header">
          <h3><i className="fas fa-filter"></i> Сүзгілер</h3>
        </div>
        
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
          
          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showWebsiteOnly}
                onChange={handleWebsiteFilterChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Тек веб-сайты бар университеттер
            </label>
          </div>
        </div>
      </div>

      {/* Результаты */}
      <main className="main-content">
        <div className="results-info">
          <h3>Табылды: {filteredUniversities.length} университет</h3>
          {selectedCity !== 'All' && (
            <span className="active-filter">
              <i className="fas fa-map-marker-alt"></i>
              {selectedCity}
            </span>
          )}
          {showWebsiteOnly && (
            <span className="active-filter">
              <i className="fas fa-globe"></i>
              Вебсайты бар
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
              <UniversityCard key={index} university={uni} />
            ))}
          </div>
        )}
      </main>

      {/* Подвал */}
      <footer className="footer">
        <p>© 2024 Қазақстан Жоғары Оқу Орындары Каталогы</p>
        <p className="footer-info">Барлығы: {stats.total} университет | {stats.cities} қала</p>
      </footer>
    </div>
  );
}

export default App;