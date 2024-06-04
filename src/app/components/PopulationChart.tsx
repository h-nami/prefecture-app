import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PopulationData {
  year: number;
  value: number;
}

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationChartProps {
  selectedPrefCodes: number[];
  populationData: { [key: number]: PopulationData[] };
  prefectures: Prefecture[];
}

const PopulationChart: React.FC<PopulationChartProps> = ({
  selectedPrefCodes,
  populationData,
  prefectures
}) => {
  const getMergedData = () => {
    const mergedData: { year: number;[key: number]: number }[] = [];
    const years = new Set<number>();

    // 各都道府県の年数データを収集
    selectedPrefCodes.forEach(prefCode => {
      if (populationData[prefCode]) {
        populationData[prefCode].forEach(data => {
          years.add(data.year);
        });
      }
    });

    // 収集した年数ごとにデータポイントを作成
    Array.from(years).sort().forEach(year => {
      const dataPoint: { year: number;[key: number]: number } = { year };
      selectedPrefCodes.forEach(prefCode => {
        const yearData = populationData[prefCode]?.find(data => data.year === year);
        dataPoint[prefCode] = yearData ? yearData.value : 0;
      });
      mergedData.push(dataPoint);
    });

    return mergedData;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={getMergedData()}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        {selectedPrefCodes.map(prefCode => {
          const prefName = prefectures.find(pref => pref.prefCode === prefCode)?.prefName;
          return (
            <Line
              key={prefCode}
              type="monotone"
              dataKey={prefCode.toString()}
              name={prefName}
              dot={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PopulationChart;


// import React from "react";
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

// interface PopulationData {
//   year: number;
//   value: number;
// }

// interface Prefecture {
//   prefCode: number;
//   prefName: string;
// }

// interface PopulationChartProps {
//   selectedPrefCodes: number[];
//   populationData: { [key: number]: PopulationData[] };
//   prefectures: Prefecture[];
// }

// const PopulationChart: React.FC<PopulationChartProps> = ({
//   selectedPrefCodes,
//   populationData,
//   prefectures
// }) => {
//   const getMergedData = () => {
//     const mergedData: { year: number;[key: number]: number }[] = [];
//     const years = new Set<number>();

//     // 各都道府県の年数データを収集
//     selectedPrefCodes.forEach(prefCode => {
//       populationData[prefCode]?.forEach(data => {
//         years.add(data.year);
//       });
//     });

//     // 収集した年数ごとにデータポイントを作成
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
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart
//         data={getMergedData()}
//         margin={{
//           top: 5, right: 30, left: 20, bottom: 5,
//         }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="year" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         {selectedPrefCodes.map(prefCode => {
//           const prefName = prefectures.find(pref => pref.prefCode === prefCode)?.prefName;
//           return (
//             <Line
//               key={prefCode}
//               type="monotone"
//               dataKey={prefCode.toString()}
//               name={prefName}
//               dot={false}
//             />
//           );
//         })}
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default PopulationChart;
