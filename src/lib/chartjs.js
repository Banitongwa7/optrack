import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { INK } from "@/lib/palette";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

ChartJS.defaults.font.family =
  'system-ui, -apple-system, "Segoe UI", sans-serif';
ChartJS.defaults.color = INK.muted;
ChartJS.defaults.plugins.legend.display = false;

const recessiveScales = {
  x: {
    grid: { display: false },
    border: { color: INK.baseline },
    ticks: { color: INK.muted },
  },
  y: {
    beginAtZero: true,
    grid: { color: INK.grid },
    border: { display: false },
    ticks: { color: INK.muted, precision: 0 },
  },
};

export function barOptions({ horizontal = false } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    scales: horizontal
      ? {
          x: { ...recessiveScales.y, position: "bottom" },
          y: { ...recessiveScales.x },
        }
      : recessiveScales,
    plugins: {
      tooltip: { mode: "index", intersect: false },
    },
  };
}

export function lineOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: recessiveScales,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: { mode: "index", intersect: false },
    },
  };
}

export function doughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
  };
}

// Shared mark specs: thin bars with 4px rounded data-ends, 2px surface
// spacers between doughnut segments.
export const BAR_STYLE = {
  borderRadius: 4,
  maxBarThickness: 28,
};

export const DOUGHNUT_STYLE = {
  borderWidth: 2,
  borderColor: INK.surface,
};
