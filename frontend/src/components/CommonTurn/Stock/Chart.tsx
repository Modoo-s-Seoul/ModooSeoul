import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";

interface Props {
  stockLabels: string[];
  stockPrice: number[] | undefined;
}

export default function Chart({ stockLabels, stockPrice }: Props) {
  /**이렇게 필요한 구성 요소를 일일히 가져와 등록하는 이유는
   * 모든 모듈 들어있는 자동 패키지를 쓸 경우
   * 번들 크기가 엄청 커지기 때문이다.
   * 따라서 번들 최적화를 위해 이런 귀찮은 짓을 해야한다.
   * 필요한 구성 요소들을 안들고 오면 차트가 제대로 안나온다.
   */
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
  );

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
        position: "right" as const, // 타입을 명시적으로 지정해 에러를 막아야 한다
      },
    },
    plugins: {},
  };

  // const stockLabels = ["", "", "", "1R", "2R"];
  // const stockPrice = [100, 75, 110, 115, 110];

  const data = (labels: string[], price: number[] | undefined) => {
    const chartData = {
      labels: labels,
      datasets: [
        {
          data: price,
          fill: true,
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;

            if (ctx) {
              const gradient = ctx.createLinearGradient(0, 0, 0, 200);
              gradient.addColorStop(0, "rgba(225,116,116,0.5)");
              gradient.addColorStop(1, "rgba(225,116,116,0.1)");
              return gradient;
            }

            return "transparent";
          },
          borderColor: "red",
          borderWidth: 1,
          pointBackgroundColor: "red",
        },
      ],
    };

    return chartData;
  };

  return (
    <>
      <Line options={options} data={data(stockLabels, stockPrice)} />
    </>
  );
}
