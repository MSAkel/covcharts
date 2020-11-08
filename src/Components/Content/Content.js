import {useState, useEffect} from 'react'
import GlobalStats from '../GlobalStats/GlobalStats';
import Capsule from '../Capsule/Capsule';
import DataTable from '../Table/DataTable';
import StatContainer from '../StatContainer/StatContainer';
import './Content.css';

function Content() {
  const [selection, setSelection] = useState("World")
  const [regions, setRegions] = useState([])
  const [regionsData, setRegionsData] = useState([])
  const [countriesList, setCountriesList] = useState([])
  // Global stats
  const [gs, setGs] = useState()
  // const [selected]

  const getStats = async() => {
    const URL = "https://cov19.cc/report.json"
    const data = await fetch(URL)
      .then(res => {
        if(!res.ok) throw new Error("Woops")
        return res.json()
      })

      let regionsList = []
      for(let region in data.regions) {
        if(data.regions[region].name && data.regions[region].name !== 'Antarctica') regionsList.push(data.regions[region].name)
      }
      regionsList.sort()
      
      setRegions(regionsList)
      setRegionsData(data.regions)
      setGs(data.regions.world.totals)
      setCountriesList(data.regions.world.list)
  }

  const onSelectRegion = name => {
    setSelection(name)
  }

  // useEffect(() => {
  //   getStats()
  // }, [])

  useEffect(() => {
    if(!countriesList.length) getStats()
  }, [selection])

  const regionsCapsules = regions && regions.map((region =>
    <Capsule 
     key={region} 
     styling={selection === region ? "capsule-container active" : 'capsule-container'}
     region={region} 
     onSelectRegion={onSelectRegion}
    />
  ))

  return (
    <div className="wrapper">
        <GlobalStats gs={gs}/>
        <div className="region-container">
          <div className="capsules-list">
            {regionsCapsules}
          </div>
          <div className="active-selection-section">
            <div className="selection">
              <h1>{selection}</h1>
            </div>
            <div className="cards">
              <StatContainer title="Confirmed cases" total={gs ? gs.confirmed.toLocaleString() : "No data"}/>
              <StatContainer title="Recovered" total={gs ? gs.recovered.toLocaleString() : "No data"}/>
              <StatContainer title="Active Cases" total={gs ? (gs.confirmed - (gs.recovered + gs.deaths)).toLocaleString() : "No data"}/>
              <StatContainer title="Critical" total={gs ? gs.critical.toLocaleString() : "No data"}/>
              <StatContainer title="Deaths" total={gs ? gs.deaths.toLocaleString() : "No data"}/>
            </div>
          </div>       
          <DataTable countries={countriesList} regionsData={regionsData} selection={selection}/>
        </div>
    </div>
  );
}

export default Content;
