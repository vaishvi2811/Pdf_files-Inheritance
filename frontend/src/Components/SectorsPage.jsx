import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import './SectorsPage.css'; // Import the external CSS file

const SectorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allSectors = [
    { company: 'ICICI BANK', mp: '1000', closePrice: '995', mCap: '700B', hasGraph: true, sector: 'banking' },
    { company: 'HDFC BANK', mp: '1400', closePrice: '1395', mCap: '900B', hasGraph: false, sector: 'banking' },
    { company: 'PNB', mp: '80', closePrice: '78', mCap: '100B', hasGraph: false, sector: 'banking' },
    { company: 'INDUSIND BANK', mp: '1200', closePrice: '1190', mCap: '300B', hasGraph: false, sector: 'banking' },
    { company: 'AXIS BANK', mp: '950', closePrice: '945', mCap: '450B', hasGraph: false, sector: 'banking' },
    { company: 'KOTAK BANK', mp: '1800', closePrice: '1795', mCap: '550B', hasGraph: false, sector: 'banking' },
    
    // FMCG Sector
    { company: 'HINDUSTAN UNILEVER', mp: '2500', closePrice: '2490', mCap: '550B', hasGraph: false, sector: 'fmcg' },
    { company: 'ITC', mp: '420', closePrice: '418', mCap: '520B', hasGraph: false, sector: 'fmcg' },
    { company: 'NESTLE', mp: '2200', closePrice: '2190', mCap: '480B', hasGraph: false, sector: 'fmcg' },
    { company: 'BRITANNIA', mp: '4500', closePrice: '4490', mCap: '320B', hasGraph: false, sector: 'fmcg' },
    
    // Automobiles Sector
    { company: 'TATA MOTORS', mp: '800', closePrice: '795', mCap: '400B', hasGraph: false, sector: 'automobiles' },
    { company: 'MARUTI SUZUKI', mp: '10200', closePrice: '10150', mCap: '800B', hasGraph: false, sector: 'automobiles' },
    { company: 'MAHINDRA & MAHINDRA', mp: '1500', closePrice: '1490', mCap: '350B', hasGraph: false, sector: 'automobiles' },
    
    // IT Sector
    { company: 'TCS', mp: '3500', closePrice: '3490', mCap: '1200B', hasGraph: false, sector: 'it' },
    { company: 'INFOSYS', mp: '1600', closePrice: '1590', mCap: '900B', hasGraph: false, sector: 'it' },
    { company: 'WIPRO', mp: '450', closePrice: '448', mCap: '300B', hasGraph: false, sector: 'it' },
    
    // Pharma Sector
    { company: 'SUN PHARMA', mp: '1100', closePrice: '1095', mCap: '400B', hasGraph: false, sector: 'pharma' },
    { company: 'DR REDDY', mp: '5500', closePrice: '5490', mCap: '350B', hasGraph: false, sector: 'pharma' },
    { company: 'CIPLA', mp: '1200', closePrice: '1195', mCap: '280B', hasGraph: false, sector: 'pharma' },
    
    // Energy Sector
    { company: 'RELIANCE', mp: '2500', closePrice: '2490', mCap: '1500B', hasGraph: false, sector: 'energy' },
    { company: 'ONGC', mp: '180', closePrice: '178', mCap: '250B', hasGraph: false, sector: 'energy' },
    { company: 'POWERGRID', mp: '240', closePrice: '238', mCap: '200B', hasGraph: false, sector: 'energy' },
    
    // Metal Sector
    { company: 'TATA STEEL', mp: '120', closePrice: '119', mCap: '180B', hasGraph: false, sector: 'metal' },
    { company: 'HINDALCO', mp: '450', closePrice: '448', mCap: '150B', hasGraph: false, sector: 'metal' },
    { company: 'JSW STEEL', mp: '780', closePrice: '775', mCap: '220B', hasGraph: false, sector: 'metal' }
    
  ];

  const [selectedSectors, setSelectedSectors] = useState(['banking']);

  const filters = [
    { id: 'banking', label: 'Banking', checked: true },
    { id: 'fmcg', label: 'FMCG', checked: false },
    { id: 'automobiles', label: 'Automobiles', checked: false },
    { id: 'it', label: 'IT', checked: false },
    { id: 'pharma', label: 'Pharma', checked: false },
    { id: 'energy', label: 'Energy', checked: false },
    { id: 'metal', label: 'Metal', checked: false },
  ];

  const handleSectorChange = (sectorId) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorId) ? prev.filter((id) => id !== sectorId) : [...prev, sectorId]
    );
  };

  const filteredSectors = useMemo(() => {
    return allSectors.filter((sector) => {
      const matchesSearch = sector.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSectors.includes(sector.sector);
      return matchesSearch && matchesSector;
    });
  }, [searchQuery, selectedSectors]);

  return (
    <div className="sectors-page">
      <div className="header">
        <div className="title">SECTORS</div>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="filter-btn">
          <Filter className="icon" />
        </button>
      </div>

      <div className="content">
        {/* Main Table */}
        <div className="table-container">
          <table className="sector-table">
            <thead>
              <tr>
                <th>COMPANY</th>
                <th>MP</th>
                <th>CLOSE PRICE</th>
                <th>M.CAP</th>
              </tr>
            </thead>
            <tbody>
              {filteredSectors.map((sector, index) => (
                <tr key={index}>
                  <td>
                    {sector.company}
                    {sector.hasGraph && <button className="graph-btn">GRAPH</button>}
                  </td>
                  <td>{sector.mp}</td>
                  <td>{sector.closePrice}</td>
                  <td>{sector.mCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sliding Filter Panel */}
        <div className={`filter-panel ${isFilterOpen ? 'open' : ''}`}>
          <div className="filter-header">
            <div className="filter-title">FILTERS</div>
            <button onClick={() => setIsFilterOpen(false)} className="close-btn">
              <X className="icon" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="icon" />
          </div>

          {/* Checkboxes */}
          <div className="filters">
            {filters.map((filter) => (
              <label key={filter.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedSectors.includes(filter.id)}
                  onChange={() => handleSectorChange(filter.id)}
                />
                {filter.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorsPage;
