import './App.css';
import { useEffect, useRef, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { QuickInsights } from './components/QuickInsights';
import { MyChart } from './components/MyChart';
import React  from 'react';
import { MetaData } from './components/MetaData';
import { getQuickInsights, getSites } from './api';

function App() {
  const [selectedSite, setSelectedSite] = useState({})
  const [sites, setSites] = useState([])
  const [quickInsightsTypes, setQuickInsightsTypes] = useState([])
  const [selectedQuickInsightsId, setSelectedQuickInsightsId] = useState(null)
  const [quickInsights, setQuickInsights] = useState({})
  
  const [currentChartType, setCurrentChartType] = useState("day")
  const [chartTime, setChartTime] = useState("2024/10") 
  

  const myChartProps = {
    currentChartType,
    setCurrentChartType,
    chartTime,
    setChartTime
  }

  const quickInsightsProps = {
    quickInsights,
    quickInsightsTypes,
    selectedQuickInsightsId,
    setSelectedQuickInsightsId
  }

  const metadataProps = {
    selectedSite
  }

  const searchBarProps = {
    sites,
    selectedSite,
    setSelectedSite
  }

  const inferQuickInsightsTypes = (site) => {
    const available_data_types = []
    if (site.solarEdgeId) {
      available_data_types.push({
        id: "solar" + "," + site.solarEdgeId,
        label: "Solar",
        value: site.solarEdgeId
      })
    }

    if (site.energyStarId) {
      available_data_types.push({
        id: "electricgrid" + "," + site.energyStarId,
        label: "Electric - Grid",
        value: site.energyStarId
      })

      available_data_types.push({
        id: "naturalgas" + "," + site.energyStarId,
        label: "Natural Gas",
        value: site.energyStarId
      })
    }

    setQuickInsightsTypes(available_data_types)
    setSelectedQuickInsightsId(available_data_types[0].id)
  }
  
  useEffect(() => {
    getSites().then((sites) => {
      setSites(sites)
      const firstSite = sites[0]
      setSelectedSite(firstSite)
      inferQuickInsightsTypes(firstSite)
      getQuickInsights().then((data) => {
        setQuickInsights(data)
      })
    })
    
  }, [])


  useEffect(() => {
    if (selectedSite && Object.keys(selectedSite).length) {
      console.log("selectedSite:", selectedSite)
      inferQuickInsightsTypes(selectedSite)
      getQuickInsights().then((data) => {
        setQuickInsights(data)
      })
    }
  }, [selectedSite])

  useEffect(() => {
    if (quickInsightsTypes.length) {
      console.log("quickInsightsTypes:", quickInsightsTypes)
    }
  }, [quickInsightsTypes])


  useEffect(() => {
    if (selectedQuickInsightsId) {
      console.log("selectedQuickInsightsId", selectedQuickInsightsId)
      getQuickInsights().then((data) => {
        setQuickInsights(data)
      })
    }
  }, [selectedQuickInsightsId])


  return (
    <div className="App">
      <div className="header">
        <h1 className="logo">Dashboard</h1>
        <SearchBar {...searchBarProps}></SearchBar>
        <div className="userActions">Login</div>
      </div>
      <div className="body1">
        <QuickInsights {...quickInsightsProps}></QuickInsights>
        <MetaData {...metadataProps}></MetaData>
      </div>
      <div className="body2">
        <MyChart {...myChartProps}></MyChart>
      </div>
    </div>
  );
}

export default App;
