'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import PrefectureSelector from "./components/PrefectureSelector";
import PopulationChart from "./components/PopulationChart";
import PopulationTypeSelector from "./components/PopulationTypeSelector";
import "./App.css";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationData {
  year: number;
  value: number;
}

const API_KEY = process.env.NEXT_PUBLIC_RESAS_API_KEY;

const fetchPrefectures = async (): Promise<Prefecture[]> => {
  const url = "https://opendata.resas-portal.go.jp/api/v1/prefectures";
  const response = await axios.get(url, {
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  return response.data.result;
};

const fetchPopulation = async (prefCode: number, type: string): Promise<PopulationData[]> => {
  const url = `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`;
  const response = await axios.get(url, {
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  const result = response.data.result.data;
  let data;
  switch (type) {
    case '総人口':
      data = result.find((d: any) => d.label === '総人口');
      break;
    case '年少人口':
      data = result.find((d: any) => d.label === '年少人口');
      break;
    case '生産年齢人口':
      data = result.find((d: any) => d.label === '生産年齢人口');
      break;
    case '老年人口':
      data = result.find((d: any) => d.label === '老年人口');
      break;
    default:
      data = result.find((d: any) => d.label === '総人口');
  }
  return data.data;
};

export default function Home() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<{ [key: number]: PopulationData[] }>({});
  const [selectedType, setSelectedType] = useState<string>('総人口');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPrefectures = async () => {
      try {
        const data = await fetchPrefectures();
        setPrefectures(data);
      } catch (error) {
        setError('Failed to fetch prefectures');
      }
    };

    getPrefectures();
  }, []);

  useEffect(() => {
    const getPopulationData = async () => {
      try {
        const dataPromises = selectedPrefCodes.map(prefCode => fetchPopulation(prefCode, selectedType));
        const populationDataArray = await Promise.all(dataPromises);

        const newPopulationData = selectedPrefCodes.reduce((acc, prefCode, index) => {
          acc[prefCode] = populationDataArray[index];
          return acc;
        }, {} as { [key: number]: PopulationData[] });

        setPopulationData(newPopulationData);
      } catch (error) {
        setError('Failed to fetch population data');
      }
    };

    if (selectedPrefCodes.length > 0) {
      getPopulationData();
    }
  }, [selectedPrefCodes, selectedType]);

  const handleCheckboxChange = (prefCode: number) => {
    setSelectedPrefCodes(prev =>
      prev.includes(prefCode) ? prev.filter(code => code !== prefCode) : [...prev, prefCode]
    );
  };

  return (
    <>
      <h1 className="prefecture_title">日本の都道府県</h1>
      {error && <p>{error}</p>}
      <PopulationTypeSelector
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />
      <PrefectureSelector
        prefectures={prefectures}
        selectedPrefCodes={selectedPrefCodes}
        onCheckboxChange={handleCheckboxChange}
      />
      {selectedPrefCodes.length > 0 && (
        <div>
          <h2 className="population_title">人口データ: {selectedType}</h2>
          <PopulationChart
            selectedPrefCodes={selectedPrefCodes}
            populationData={populationData}
            prefectures={prefectures}
          />
        </div>
      )}
    </>
  );
}

//await,async
//Promise型


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import "./App.css";

// interface Prefecture {
//   prefCode: number;
//   prefName: string;
// }

// interface PopulationData {
//   year: number;
//   value: number;
// }

// const API_KEY = process.env.NEXT_PUBLIC_RESAS_API_KEY;

// const fetchPrefectures = async (): Promise<Prefecture[]> => {
//   const url = "https://opendata.resas-portal.go.jp/api/v1/prefectures";
//   const response = await axios.get(url, {
//     headers: {
//       'X-API-KEY': API_KEY,
//     },
//   });
//   return response.data.result;
// };

// const fetchPopulation = async (prefCode: number): Promise<PopulationData[]> => {
//   const url = `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`;
//   const response = await axios.get(url, {
//     headers: {
//       'X-API-KEY': API_KEY,
//     },
//   });
//   return response.data.result.data[0].data;
// };

// export default function Home() {
//   const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
//   const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([]);
//   const [populationData, setPopulationData] = useState<{ [key: number]: PopulationData[] }>({});
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getPrefectures = async () => {
//       try {
//         const data = await fetchPrefectures();
//         setPrefectures(data);
//       } catch (error) {
//         setError('Failed to fetch prefectures');
//       }
//     };

//     getPrefectures();
//   }, []);

//   useEffect(() => {
//     const getPopulationData = async () => {
//       try {
//         const dataPromises = selectedPrefCodes.map(prefCode => fetchPopulation(prefCode));
//         const populationDataArray = await Promise.all(dataPromises);

//         const newPopulationData = selectedPrefCodes.reduce((acc, prefCode, index) => {
//           acc[prefCode] = populationDataArray[index];
//           return acc;
//         }, {} as { [key: number]: PopulationData[] });

//         setPopulationData(newPopulationData);
//       } catch (error) {
//         setError('Failed to fetch population data');
//       }
//     };

//     if (selectedPrefCodes.length > 0) {
//       getPopulationData();
//     }
//   }, [selectedPrefCodes]);

//   const handleCheckboxChange = (prefCode: number) => {
//     setSelectedPrefCodes(prev =>
//       prev.includes(prefCode) ? prev.filter(code => code !== prefCode) : [...prev, prefCode]
//     );
//   };

//   const getMergedData = () => {
//     const mergedData: { year: number;[key: number]: number }[] = [];
//     const years = new Set<number>();

//     selectedPrefCodes.forEach(prefCode => {
//       populationData[prefCode]?.forEach(data => {
//         years.add(data.year);
//       });
//     });

//     Array.from(years).sort().forEach(year => {
//       const dataPoint: { year: number;[key: number]: number } = { year };
//       selectedPrefCodes.forEach(prefCode => {
//         const yearData = populationData[prefCode]?.find(data => data.year === year);
//         dataPoint[prefCode] = yearData ? yearData.value : 0;
//       });
//       mergedData.push(dataPoint);
//     });

//     return mergedData;
//   };

//   return (
//     <>
//       <h1>日本の都道府県</h1>
//       {error && <p>{error}</p>}
//       <div className="flex-container">
//         {prefectures.map((pref) => (
//           <div key={pref.prefCode} className="flex-item">
//             <label>
//               <input
//                 type="checkbox"
//                 name={`pref-${pref.prefCode}`}
//                 value={pref.prefCode}
//                 onChange={() => handleCheckboxChange(pref.prefCode)}
//               />
//               {pref.prefName}
//             </label>
//           </div>
//         ))}
//       </div>
//       {selectedPrefCodes.length > 0 && (
//         <div>
//           <h2>人口データ</h2>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart
//               data={getMergedData()}
//               margin={{
//                 top: 5, right: 30, left: 20, bottom: 5,
//               }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="year" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {selectedPrefCodes.map(prefCode => {
//                 const prefName = prefectures.find(pref => pref.prefCode === prefCode)?.prefName;
//                 return (
//                   <Line
//                     key={prefCode}
//                     type="monotone"
//                     dataKey={prefCode.toString()}
//                     name={prefName}
//                     dot={false}
//                   />
//                 );
//               })}
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </>
//   );
// }

