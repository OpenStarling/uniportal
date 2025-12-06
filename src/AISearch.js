import React, { useState, useEffect } from 'react';
import { InstantSearch, SearchBox, Hits, Highlight, Configure, useInstantSearch } from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import './AISearch.css';
import universityData from './unis.json';

// Инициализация Algolia клиента (используйте свои реальные ключи)
const searchClient = algoliasearch(
  'YOUR_ALGOLIA_APP_ID', // Замените на ваш Application ID
  'YOUR_ALGOLIA_SEARCH_API_KEY' // Замените на ваш Search-Only API Key
);

// Индекс для поиска
const indexName = 'kazakhstan_universities';

// Компонент для отображения результатов поиска
const UniversityHit = ({ hit }) => {
  return (
    <div className="search-hit-card">
      <div className="hit-header">
        <h3>
          <Highlight attribute="name" hit={hit} />
        </h3>
        <span className="hit-city">
          <i className="fas fa-map-marker-alt"></i>
          <Highlight attribute="city" hit={hit} />
        </span>
      </div>
      
      <div className="hit-content">
        {hit.mission && (
          <p className="hit-mission">
            <Highlight attribute="mission" hit={hit} />
          </p>
        )}
        
        {hit.academprograms && hit.academprograms.length > 0 && (
          <div className="hit-programs">
            <strong><i className="fas fa-graduation-cap"></i> Бағдарламалар:</strong>
            <div className="programs-list">
              {hit.academprograms.slice(0, 3).map((program, index) => (
                <span key={index} className="program-tag">{program}</span>
              ))}
              {hit.academprograms.length > 3 && (
                <span className="more-programs">+{hit.academprograms.length - 3} басқа</span>
              )}
            </div>
          </div>
        )}
        
        <div className="hit-stats">
          {hit.ratings && (
            <span className="hit-rating">
              <i className="fas fa-chart-line"></i> Рейтинг: {hit.ratings}
            </span>
          )}
          {hit.website && (
            <span className="hit-website">
              <i className="fas fa-globe"></i> Вебсайт бар
            </span>
          )}
          {hit["3dtour"] && hit["3dtour"].trim() !== '' && (
            <span className="hit-tour">
              <i className="fas fa-vr-cardboard"></i> 3D Тур бар
            </span>
          )}
        </div>
      </div>
      
      <div className="hit-actions">
        <a 
          href={hit.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hit-action-btn"
        >
          <i className="fas fa-external-link-alt"></i> Сайтқа өту
        </a>
      </div>
    </div>
  );
};

// Компонент для отображения состояния поиска
const SearchStatus = () => {
  const { status } = useInstantSearch();
  
  if (status === 'stalled') {
    return (
      <div className="search-status">
        <i className="fas fa-spinner fa-spin"></i>
        Іздеу жалғасуда...
      </div>
    );
  }
  
  return null;
};

// Компонент для отображения, когда нет результатов
const NoResults = () => {
  const { results } = useInstantSearch();
  
  if (!results || results.nbHits === 0) {
    return (
      <div className="no-search-results">
        <i className="fas fa-search"></i>
        <h4>Нәтиже табылмады</h4>
        <p>Іздеу сұранысыңызға сәйкес университеттер табылмады</p>
        <p className="search-tips">
          <strong>Кеңес:</strong> Басқа сөздерді пайдаланып көріңіз немесе қала атауын енгізіңіз
        </p>
      </div>
    );
  }
  
  return null;
};

// Основной компонент AI-поиска
const AISearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // Загрузка истории поиска из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('universitySearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Сохранение поискового запроса в историю
  const saveToHistory = (query) => {
    if (!query.trim()) return;
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item.toLowerCase() !== query.toLowerCase())
    ].slice(0, 5); // Храним только последние 5 запросов
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('universitySearchHistory', JSON.stringify(updatedHistory));
  };

  // Обработка поиска
  const handleSearch = (event) => {
    const query = event.currentTarget.value;
    setSearchQuery(query);
    if (query.trim()) {
      saveToHistory(query);
    }
  };

  // Очистка истории поиска
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('universitySearchHistory');
  };

  // Примеры популярных запросов
  const popularSearches = [
    "Алматы университеттері",
    "Инженерлік бағдарламалар",
    "Медицина университеттері",
    "Техникалық университеттер",
    "Астана университеттері",
    "Халықаралық бағдарламалар"
  ];

  return (
    <>
      {/* Кнопка для открытия AI-поиска */}
      <button 
        className="ai-search-toggle"
        onClick={() => setIsOpen(true)}
      >
        <i className="fas fa-robot"></i>
        <span>AI Іздеу</span>
      </button>

      {/* Модальное окно AI-поиска */}
      {isOpen && (
        <div className="ai-search-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="ai-search-modal" onClick={e => e.stopPropagation()}>
            {/* Шапка модального окна */}
            <div className="ai-search-header">
              <div className="header-content">
                <h2>
                  <i className="fas fa-robot"></i>
                  AI-қуатталған іздеу
                </h2>
                <p className="subtitle">Университеттерді табу үшін сұрақ қойыңыз</p>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Основное содержимое */}
            <div className="ai-search-content">
              {/* Быстрый доступ */}
              <div className="quick-access">
                <h4><i className="fas fa-bolt"></i> Жылдам іздеу</h4>
                <div className="popular-searches">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      className="popular-search-btn"
                      onClick={() => {
                        setSearchQuery(search);
                        saveToHistory(search);
                      }}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* История поиска */}
              {searchHistory.length > 0 && (
                <div className="search-history">
                  <div className="history-header">
                    <h4><i className="fas fa-history"></i> Соңғы іздеулер</h4>
                    <button 
                      className="clear-history-btn"
                      onClick={clearHistory}
                    >
                      <i className="fas fa-trash"></i> Тазарту
                    </button>
                  </div>
                  <div className="history-list">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        className="history-item"
                        onClick={() => {
                          setSearchQuery(item);
                          saveToHistory(item);
                        }}
                      >
                        <i className="fas fa-search"></i>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Поисковая строка Algolia */}
              <div className="algolia-search-wrapper">
                <InstantSearch 
                  searchClient={searchClient} 
                  indexName={indexName}
                  initialUiState={{
                    [indexName]: {
                      query: searchQuery
                    }
                  }}
                >
                  <Configure 
                    hitsPerPage={10}
                    attributesToSnippet={['mission:50', 'academprograms:20']}
                    snippetEllipsisText="..."
                  />
                  
                  <div className="algolia-search-box">
                    <SearchBox 
                      placeholder="Мысалы: 'Алматыдағы техникалық университеттер' немесе 'медицина бағдарламалары'..."
                      autoFocus
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveToHistory(searchQuery);
                      }}
                      onChange={(event) => handleSearch(event)}
                      value={searchQuery}
                      classNames={{
                        root: 'searchbox-root',
                        form: 'searchbox-form',
                        input: 'searchbox-input',
                        submit: 'searchbox-submit',
                        reset: 'searchbox-reset',
                        loadingIndicator: 'searchbox-loading'
                      }}
                    />
                  </div>

                  {/* Статус поиска */}
                  <SearchStatus />

                  {/* Результаты поиска */}
                  <div className="search-results-container">
                    <NoResults />
                    <Hits 
                      hitComponent={UniversityHit}
                      classNames={{
                        root: 'hits-root',
                        list: 'hits-list',
                        item: 'hits-item'
                      }}
                    />
                  </div>

                  {/* Советы по поиску */}
                  <div className="search-tips-section">
                    <h4><i className="fas fa-lightbulb"></i> Іздеу кеңестері</h4>
                    <div className="tips-grid">
                      <div className="tip-card">
                        <i className="fas fa-city"></i>
                        <p><strong>Қала бойынша:</strong> "Алматы университеттері", "Астана медицина"</p>
                      </div>
                      <div className="tip-card">
                        <i className="fas fa-graduation-cap"></i>
                        <p><strong>Бағдарлама бойынша:</strong> "инженерлік", "медицина", "экономика"</p>
                      </div>
                      <div className="tip-card">
                        <i className="fas fa-star"></i>
                        <p><strong>Рейтинг бойынша:</strong> "жетекші университеттер", "жоғары рейтингті"</p>
                      </div>
                      <div className="tip-card">
                        <i className="fas fa-vr-cardboard"></i>
                        <p><strong>Арнайы мүмкіндіктер:</strong> "3D тур бар", "халықаралық бағдарламалар"</p>
                      </div>
                    </div>
                  </div>
                </InstantSearch>
              </div>
            </div>

            {/* Подвал модального окна */}
            <div className="ai-search-footer">
              <p>
                <i className="fas fa-info-circle"></i>
                Algolia AI-поиск қуатталған. Сіздің сұрақтарыңызды табиғи тілде қойыңыз.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Функция для инициализации индекса Algolia (запустить один раз)
export const initializeAlgoliaIndex = async () => {
  try {
    // Трансформируем данные в формат Algolia
    const algoliaData = universityData.map((uni, index) => ({
      objectID: index.toString(),
      name: uni.name,
      city: uni.city,
      mission: uni.mission,
      academprograms: uni.academprograms,
      ratings: uni.ratings,
      website: uni.website,
      "3dtour": uni["3dtour"],
      "application and admission": uni["application and admission"],
      "international cooperation": uni["international cooperation"],
      // Создаем поле для полнотекстового поиска
      _tags: [
        uni.city,
        ...(uni.academprograms || []),
        ...(uni["international cooperation"] ? ['халықаралық'] : []),
        ...(uni["3dtour"] && uni["3dtour"].trim() !== '' ? ['3dtour'] : [])
      ]
    }));

    console.log('Данные для Algolia подготовлены:', algoliaData.length, 'записей');
    console.log('Пример записи:', algoliaData[0]);
    
    // Здесь нужно будет отправить данные в Algolia через их API
    // Для этого нужны права записи (Admin API Key)
    
    return {
      success: true,
      message: 'Данные подготовлены для Algolia. Загрузите их через Algolia Dashboard.',
      data: algoliaData
    };
  } catch (error) {
    console.error('Ошибка при подготовке данных для Algolia:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default AISearch;