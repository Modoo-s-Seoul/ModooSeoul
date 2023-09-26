import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// interface Props{

// }

export default function Chart() {
  /**이렇게 필요한 구성 요소를 일일히 가져와 등록하는 이유는
   * 모든 모듈 들어있는 자동 패키지를 쓸 경우
   * 번들 크기가 엄청 커지기 때문이다.
   * 따라서 번들 최적화를 위해 이런 귀찮은 짓을 해야한다.
   * 필요한 구성 요소들을 안들고 오면 차트가 제대로 안나온다.
   */
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        grid: {
          display: false,
        },
        position: "right" as const,
      },
    },
    plugins: {},
  };

  const [stockData, setStockData] = useState({
    labels: [""],
    datasets: [
      {
        label: "",
        data: [0],
        borderColor: "",
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    // 여기에서 주식 데이터를 가져오는 API 호출 등을 수행하고,
    // 가져온 데이터를 stockData에 설정해야 합니다.

    // 가상의 주식 데이터 예시
    const sampleData = {
      labels: ["", "", "", "1R", "2R"],
      datasets: [
        {
          label: "주식 가격",
          data: [100, 75, 110, 115, 110],
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
        },
      ],
    };

    setStockData(sampleData);
  }, []);

  return (
    <>
      <Line options={options} data={stockData} />
    </>
  );
}
