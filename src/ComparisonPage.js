import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import universityData from './unis.json';
import './ComparisonPage.css';

const ComparisonPage = () => {
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [activeChart, setActiveChart] = useState('bar');

  useEffect(() => {
    const formattedData = universityData.map(uni => ({
      ...uni,
      rankingNumber: uni.ratings ? parseInt(uni.ratings.replace('#', '')) || 0 : 0
    }));
    setAllUniversities(formattedData);
  }, []);

  const handleAddUniversity = (university) => {
    if (selectedUniversities.length < 5 && !selectedUniversities.some(u => u.name === university.name)) {
      setSelectedUniversities([...selectedUniversities, university]);
    }
  };

  const handleRemoveUniversity = (universityName) => {
    setSelectedUniversities(selectedUniversities.filter(u => u.name !== universityName));
  };

  const handleClearAll = () => {
    setSelectedUniversities([]);
  };

  // Подготовка данных для графиков
  useEffect(() => {
    if (selectedUniversities.length > 0) {
      const data = selectedUniversities.map(uni => ({
        name: uni.name,
        Рейтинг: uni.rankingNumber,
        Город: uni.city,
        Программы: uni.academprograms?.length || 0,
        "Есть 3D Тур": uni["3dtour"] && uni["3dtour"].trim() !== '' ? 1 : 0
      }));
      setComparisonData(data);
    } else {
      setComparisonData([]);
    }
  }, [selectedUniversities]);

  const citiesData = selectedUniversities.reduce((acc, uni) => {
    const city = uni.city;
    if (!acc[city]) acc[city] = 0;
    acc[city]++;
    return acc;
  }, {});

  const pieData = Object.entries(citiesData).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Топ университетов по рейтингу
  const topRankedUniversities = [...allUniversities]
    .filter(u => u.rankingNumber > 0)
    .sort((a, b) => a.rankingNumber - b.rankingNumber)
    .slice(0, 10);

  return (
    <div className="comparison-page">
      <div className="comparison-header">
        <h1><i className="fas fa-balance-scale"></i> Университеттерді салыстыру</h1>
        <p className="subtitle">5 университетке дейін салыстыруға болады</p>
      </div>

      <div className="comparison-container">
        {/* Левая панель - выбор университетов */}
        <div className="selection-panel">
          <div className="panel-header">
            <h3><i className="fas fa-plus-circle"></i> Университеттерді таңдау</h3>
            {selectedUniversities.length > 0 && (
              <button className="clear-btn" onClick={handleClearAll}>
                <i className="fas fa-trash"></i> Барлығын тазарту
              </button>
            )}
          </div>

          <div className="selected-count">
            <span className="count-badge">{selectedUniversities.length}/5</span>
            <span>таңдалған университет</span>
          </div>

          {/* Список выбранных университетов */}
          <div className="selected-list">
            {selectedUniversities.length === 0 ? (
              <div className="empty-selection">
                <i className="fas fa-university"></i>
                <p>Салыстыру үшін университеттерді қосыңыз</p>
              </div>
            ) : (
              selectedUniversities.map((uni, index) => (
                <div key={uni.name} className="selected-item">
                  <div className="item-number">{index + 1}</div>
                  <div className="item-info">
                    <h4>{uni.name}</h4>
                    <div className="item-details">
                      <span className="city-tag">{uni.city}</span>
                      <span className="rank-tag">
                        <i className="fas fa-chart-line"></i> {uni.ratings || 'Рейтинг жоқ'}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveUniversity(uni.name)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Топ университетов для быстрого выбора */}
          <div className="top-universities">
            <h4><i className="fas fa-trophy"></i> Топ-10 университеттер</h4>
            <div className="top-list">
              {topRankedUniversities.map(uni => (
                <div 
                  key={uni.name}
                  className={`top-item ${selectedUniversities.some(u => u.name === uni.name) ? 'selected' : ''}`}
                  onClick={() => handleAddUniversity(uni)}
                >
                  <div className="top-rank">#{uni.rankingNumber}</div>
                  <div className="top-info">
                    <h5>{uni.name}</h5>
                    <p>{uni.city}</p>
                  </div>
                  <div className="top-action">
                    {selectedUniversities.some(u => u.name === uni.name) ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="fas fa-plus-circle"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Правая панель - графики сравнения */}
        <div className="comparison-results">
          <div className="results-header">
            <h3><i className="fas fa-chart-bar"></i> Салыстыру нәтижелері</h3>
            <div className="chart-tabs">
              <button 
                className={`chart-tab ${activeChart === 'bar' ? 'active' : ''}`}
                onClick={() => setActiveChart('bar')}
              >
                <i className="fas fa-chart-bar"></i> Бағандық диаграмма
              </button>
              <button 
                className={`chart-tab ${activeChart === 'pie' ? 'active' : ''}`}
                onClick={() => setActiveChart('pie')}
              >
                <i className="fas fa-chart-pie"></i> Секторлық диаграмма
              </button>
            </div>
          </div>

          {selectedUniversities.length === 0 ? (
            <div className="no-comparison">
              <i className="fas fa-chart-line fa-4x"></i>
              <h4>Салыстыру үшін университеттерді таңдаңыз</h4>
              <p>Сол жақтағы тізімнен университеттерді таңдаңыз</p>
            </div>
          ) : selectedUniversities.length === 1 ? (
            <div className="single-university">
              <i className="fas fa-info-circle fa-3x"></i>
              <h4>Кемінде 2 университетті таңдаңыз</h4>
              <p>Салыстыру үшін тағы бір университет қосыңыз</p>
            </div>
          ) : (
            <>
              {/* Бағандық диаграмма */}
              {activeChart === 'bar' && (
                <div className="chart-container">
                  <h4>Рейтингтер бойынша салыстыру</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Рейтинг" fill="#0088FE" />
                      <Bar dataKey="Программы" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Секторлық диаграмма */}
              {activeChart === 'pie' && (
                <div className="chart-container">
                  <h4>Қалалар бойынша үлестіру</h4>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Таблица сравнения */}
              <div className="comparison-table">
                <h4><i className="fas fa-table"></i> Толық салыстыру кестесі</h4>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Көрсеткіш</th>
                        {selectedUniversities.map(uni => (
                          <th key={uni.name}>{uni.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Қала</strong></td>
                        {selectedUniversities.map(uni => (
                          <td key={uni.name}>{uni.city}</td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Рейтинг</strong></td>
                        {selectedUniversities.map(uni => (
                          <td key={uni.name} className={uni.rankingNumber > 0 ? 'has-rank' : 'no-rank'}>
                            {uni.ratings || 'Рейтинг жоқ'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Бағдарламалар саны</strong></td>
                        {selectedUniversities.map(uni => (
                          <td key={uni.name}>{uni.academprograms?.length || 0}</td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Виртуалды тур</strong></td>
                        {selectedUniversities.map(uni => (
                          <td key={uni.name}>
                            {uni["3dtour"] && uni["3dtour"].trim() !== '' ? (
                              <span className="has-tour"><i className="fas fa-check-circle"></i> Бар</span>
                            ) : (
                              <span className="no-tour"><i className="fas fa-times-circle"></i> Жоқ</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td><strong>Вебсайт</strong></td>
                        {selectedUniversities.map(uni => (
                          <td key={uni.name}>
                            {uni.website ? (
                              <a href={uni.website} target="_blank" rel="noopener noreferrer">
                                <i className="fas fa-external-link-alt"></i> Ашу
                              </a>
                            ) : 'Жоқ'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Статистика сравнения */}
      {selectedUniversities.length >= 2 && (
        <div className="comparison-stats">
          <h3><i className="fas fa-chart-line"></i> Салыстыру статистикасы</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-university"></i>
              </div>
              <div className="stat-info">
                <h4>{selectedUniversities.length}</h4>
                <p>Салыстырылатын университеттер</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-city"></i>
              </div>
              <div className="stat-info">
                <h4>{Object.keys(citiesData).length}</h4>
                <p>Әртүрлі қалалар</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="stat-info">
                <h4>{Math.max(...selectedUniversities.map(u => u.academprograms?.length || 0))}</h4>
                <p>Ең көп бағдарламалар</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-info">
                <h4>{selectedUniversities.reduce((min, uni) => 
                  Math.min(min, uni.rankingNumber || 9999), 9999
                )}</h4>
                <p>Ең жоғары рейтинг (орны)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;