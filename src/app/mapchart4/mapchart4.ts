import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var Highcharts: any;

// Define interfaces for better type safety (these remain unchanged and are good practice)
interface StateInfo {
  name: string;
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
  unemploymentRate: number;
  housingCostIndex: number;
  educationSpendingPerCapita: number;
  monthlyData: Record<string, MonthlyStateData>;
}

interface MonthlyStateData {
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
  unemploymentRate: number;
  housingCostIndex: number;
  educationSpendingPerCapita: number;
}

interface ChartDataPoint {
  code?: string; // For map
  name: string;
  value: number;
  y?: number; // For Highcharts series data (pie/bar)
}

@Component({
  selector: 'app-mapchart4',
  imports: [CommonModule, FormsModule],
  templateUrl: './mapchart4.html',
  styleUrl: './mapchart4.scss'
})
export class Mapchart4 {

  // Single chart instance
  currentChart: any;

  // New: Property to control the displayed chart type
  currentChartType: 'map' | 'bar' | 'pie' | 'donut' = 'map'; // Default to map

  // --- State Data (remains unchanged) ---
  stateData: Record<string, StateInfo> = {
    "AL": { "name": "Alabama", "income": 60660, "gdp_per_capita": 67786, "population": 5097000, "area": 52420, "unemploymentRate": 2.7, "housingCostIndex": 85, "educationSpendingPerCapita": 10500, "monthlyData": {} },
    "AK": { "name": "Alaska", "income": 113934, "gdp_per_capita": 95147, "population": 733000, "area": 665384, "unemploymentRate": 5.0, "housingCostIndex": 120, "educationSpendingPerCapita": 16000, "monthlyData": {} },
    "AZ": { "name": "Arizona", "income": 77315, "gdp_per_capita": 78201, "population": 7431000, "area": 113990, "unemploymentRate": 3.4, "housingCostIndex": 110, "educationSpendingPerCapita": 9800, "monthlyData": {} },
    "AR": { "name": "Arkansas", "income": 63250, "gdp_per_capita": 60276, "population": 3067000, "area": 53179, "unemploymentRate": 3.1, "housingCostIndex": 80, "educationSpendingPerCapita": 9500, "monthlyData": {} },
    "CA": { "name": "California", "income": 123988, "gdp_per_capita": 104916, "population": 38966000, "area": 163695, "unemploymentRate": 4.8, "housingCostIndex": 180, "educationSpendingPerCapita": 14000, "monthlyData": {} },
    "CO": { "name": "Colorado", "income": 97301, "gdp_per_capita": 93026, "population": 5877000, "area": 104094, "unemploymentRate": 3.0, "housingCostIndex": 130, "educationSpendingPerCapita": 12500, "monthlyData": {} },
    "CT": { "name": "Connecticut", "income": 114156, "gdp_per_capita": 100235, "population": 3617000, "area": 5543, "unemploymentRate": 4.0, "housingCostIndex": 145, "educationSpendingPerCapita": 18000, "monthlyData": {} },
    "DE": { "name": "Delaware", "income": 87173, "gdp_per_capita": 98055, "population": 1032000, "area": 2489, "unemploymentRate": 3.8, "housingCostIndex": 105, "educationSpendingPerCapita": 13000, "monthlyData": {} },
    "FL": { "name": "Florida", "income": 73311, "gdp_per_capita": 78918, "population": 22611000, "area": 65758, "unemploymentRate": 3.2, "housingCostIndex": 115, "educationSpendingPerCapita": 9000, "monthlyData": {} },
    "GA": { "name": "Georgia", "income": 74632, "gdp_per_capita": 79435, "population": 11019000, "area": 59425, "unemploymentRate": 3.5, "housingCostIndex": 95, "educationSpendingPerCapita": 10000, "monthlyData": {} },
    "HI": { "name": "Hawaii", "income": 141832, "gdp_per_capita": 80979, "population": 1431000, "area": 10932, "unemploymentRate": 2.9, "housingCostIndex": 170, "educationSpendingPerCapita": 15000, "monthlyData": {} },
    "ID": { "name": "Idaho", "income": 74942, "gdp_per_capita": 68000, "population": 1964000, "area": 83568, "unemploymentRate": 2.6, "housingCostIndex": 90, "educationSpendingPerCapita": 10000, "monthlyData": {} },
    "IL": { "name": "Illinois", "income": 80306, "gdp_per_capita": 88000, "population": 12549000, "area": 57914, "unemploymentRate": 4.5, "housingCostIndex": 100, "educationSpendingPerCapita": 12000, "monthlyData": {} },
    "IN": { "name": "Indiana", "income": 76910, "gdp_per_capita": 70000, "population": 6862000, "area": 36420, "unemploymentRate": 3.0, "housingCostIndex": 88, "educationSpendingPerCapita": 11000, "monthlyData": {} },
    "IA": { "name": "Iowa", "income": 71433, "gdp_per_capita": 68000, "population": 3207000, "area": 56272, "unemploymentRate": 2.8, "housingCostIndex": 85, "educationSpendingPerCapita": 10500, "monthlyData": {} },
    "KS": { "name": "Kansas", "income": 70333, "gdp_per_capita": 70000, "population": 2939000, "area": 82278, "unemploymentRate": 3.0, "housingCostIndex": 87, "educationSpendingPerCapita": 10700, "monthlyData": {} },
    "KY": { "name": "Kentucky", "income": 61980, "gdp_per_capita": 62000, "population": 4537000, "area": 40408, "unemploymentRate": 4.0, "housingCostIndex": 80, "educationSpendingPerCapita": 9800, "monthlyData": {} },
    "LA": { "name": "Louisiana", "income": 57650, "gdp_per_capita": 60000, "population": 4574000, "area": 52378, "unemploymentRate": 4.2, "housingCostIndex": 82, "educationSpendingPerCapita": 9300, "monthlyData": {} },
    "ME": { "name": "Maine", "income": 73733, "gdp_per_capita": 70000, "population": 1363000, "area": 35380, "unemploymentRate": 3.0, "housingCostIndex": 105, "educationSpendingPerCapita": 12000, "monthlyData": {} },
    "MD": { "name": "Maryland", "income": 124693, "gdp_per_capita": 88000, "population": 6180000, "area": 12406, "unemploymentRate": 4.1, "housingCostIndex": 135, "educationSpendingPerCapita": 15000, "monthlyData": {} },
    "MA": { "name": "Massachusetts", "income": 127760, "gdp_per_capita": 110561, "population": 7001000, "area": 10555, "unemploymentRate": 3.7, "housingCostIndex": 160, "educationSpendingPerCapita": 20000, "monthlyData": {} },
    "MI": { "name": "Michigan", "income": 76960, "gdp_per_capita": 75000, "population": 10037000, "area": 96716, "unemploymentRate": 4.0, "housingCostIndex": 90, "educationSpendingPerCapita": 11500, "monthlyData": {} },
    "MN": { "name": "Minnesota", "income": 86364, "gdp_per_capita": 85000, "population": 5737000, "area": 86936, "unemploymentRate": 2.9, "housingCostIndex": 100, "educationSpendingPerCapita": 13000, "monthlyData": {} },
    "MS": { "name": "Mississippi", "income": 55060, "gdp_per_capita": 53061, "population": 2964000, "area": 48432, "unemploymentRate": 4.5, "housingCostIndex": 75, "educationSpendingPerCapita": 8500, "monthlyData": {} },
    "MO": { "name": "Missouri", "income": 78290, "gdp_per_capita": 72000, "population": 6196000, "area": 69707, "unemploymentRate": 3.5, "housingCostIndex": 88, "educationSpendingPerCapita": 10500, "monthlyData": {} },
    "MT": { "name": "Montana", "income": 70804, "gdp_per_capita": 68000, "population": 1142000, "area": 147039, "unemploymentRate": 3.1, "housingCostIndex": 95, "educationSpendingPerCapita": 11000, "monthlyData": {} },
    "NE": { "name": "Nebraska", "income": 74590, "gdp_per_capita": 93145, "population": 1978000, "area": 77348, "unemploymentRate": 2.6, "housingCostIndex": 85, "educationSpendingPerCapita": 10800, "monthlyData": {} },
    "NV": { "name": "Nevada", "income": 80366, "gdp_per_capita": 75000, "population": 3177000, "area": 110572, "unemploymentRate": 5.2, "housingCostIndex": 110, "educationSpendingPerCapita": 9500, "monthlyData": {} },
    "NH": { "name": "New Hampshire", "income": 110205, "gdp_per_capita": 87000, "population": 1395000, "area": 9349, "unemploymentRate": 2.8, "housingCostIndex": 130, "educationSpendingPerCapita": 16000, "monthlyData": {} },
    "NJ": { "name": "New Jersey", "income": 117847, "gdp_per_capita": 89000, "population": 9260000, "area": 8722, "unemploymentRate": 4.2, "housingCostIndex": 150, "educationSpendingPerCapita": 18500, "monthlyData": {} },
    "NM": { "name": "New Mexico", "income": 60980, "gdp_per_capita": 61000, "population": 2113000, "area": 121590, "unemploymentRate": 4.8, "housingCostIndex": 80, "educationSpendingPerCapita": 9000, "monthlyData": {} },
    "NY": { "name": "New York", "income": 91366, "gdp_per_capita": 117332, "population": 19543000, "area": 54555, "unemploymentRate": 4.3, "housingCostIndex": 140, "educationSpendingPerCapita": 17000, "monthlyData": {} },
    "NC": { "name": "North Carolina", "income": 70804, "gdp_per_capita": 75000, "population": 10835000, "area": 53819, "unemploymentRate": 3.7, "housingCostIndex": 90, "educationSpendingPerCapita": 10000, "monthlyData": {} },
    "ND": { "name": "North Dakota", "income": 76525, "gdp_per_capita": 95982, "population": 783000, "area": 70698, "unemploymentRate": 2.5, "housingCostIndex": 85, "educationSpendingPerCapita": 11000, "monthlyData": {} },
    "OH": { "name": "Ohio", "income": 73770, "gdp_per_capita": 70000, "population": 11799000, "area": 44825, "unemploymentRate": 3.9, "housingCostIndex": 87, "educationSpendingPerCapita": 11200, "monthlyData": {} },
    "OK": { "name": "Oklahoma", "income": 67330, "gdp_per_capita": 65000, "population": 4053000, "area": 69899, "unemploymentRate": 3.6, "housingCostIndex": 80, "educationSpendingPerCapita": 9800, "monthlyData": {} },
    "OR": { "name": "Oregon", "income": 91100, "gdp_per_capita": 80000, "population": 4280000, "area": 98379, "unemploymentRate": 4.4, "housingCostIndex": 125, "educationSpendingPerCapita": 13000, "monthlyData": {} },
    "PA": { "name": "Pennsylvania", "income": 73824, "gdp_per_capita": 75000, "population": 12953000, "area": 46055, "unemploymentRate": 4.0, "housingCostIndex": 95, "educationSpendingPerCapita": 12000, "monthlyData": {} },
    "RI": { "name": "Rhode Island", "income": 104252, "gdp_per_capita": 78000, "population": 1096000, "area": 1545, "unemploymentRate": 3.8, "housingCostIndex": 130, "educationSpendingPerCapita": 14000, "monthlyData": {} },
    "SC": { "name": "South Carolina", "income": 69100, "gdp_per_capita": 65000, "population": 5370000, "area": 32021, "unemploymentRate": 3.3, "housingCostIndex": 88, "educationSpendingPerCapita": 9500, "monthlyData": {} },
    "SD": { "name": "South Dakota", "income": 71810, "gdp_per_capita": 70000, "population": 919000, "area": 77116, "unemploymentRate": 2.7, "housingCostIndex": 80, "educationSpendingPerCapita": 10000, "monthlyData": {} },
    "TN": { "name": "Tennessee", "income": 72700, "gdp_per_capita": 68000, "population": 7126000, "area": 42143, "unemploymentRate": 3.5, "housingCostIndex": 85, "educationSpendingPerCapita": 10000, "monthlyData": {} },
    "TX": { "name": "Texas", "income": 75780, "gdp_per_capita": 76000, "population": 30504000, "area": 268596, "unemploymentRate": 4.0, "housingCostIndex": 95, "educationSpendingPerCapita": 11000, "monthlyData": {} },
    "UT": { "name": "Utah", "income": 89786, "gdp_per_capita": 85000, "population": 3417000, "area": 84897, "unemploymentRate": 2.6, "housingCostIndex": 110, "educationSpendingPerCapita": 12000, "monthlyData": {} },
    "VT": { "name": "Vermont", "income": 89695, "gdp_per_capita": 45707, "population": 647000, "area": 9616, "unemploymentRate": 2.9, "housingCostIndex": 120, "educationSpendingPerCapita": 15000, "monthlyData": {} },
    "VA": { "name": "Virginia", "income": 89393, "gdp_per_capita": 82000, "population": 8716000, "area": 42774, "unemploymentRate": 3.4, "housingCostIndex": 110, "educationSpendingPerCapita": 13000, "monthlyData": {} },
    "WA": { "name": "Washington", "income": 103748, "gdp_per_capita": 108468, "population": 7812000, "area": 71298, "unemploymentRate": 4.6, "housingCostIndex": 140, "educationSpendingPerCapita": 16000, "monthlyData": {} },
    "WV": { "name": "West Virginia", "income": 60410, "gdp_per_capita": 60783, "population": 1770000, "area": 24230, "unemploymentRate": 5.0, "housingCostIndex": 78, "educationSpendingPerCapita": 8000, "monthlyData": {} },
    "WI": { "name": "Wisconsin", "income": 74631, "gdp_per_capita": 72000, "population": 5911000, "area": 65496, "unemploymentRate": 3.2, "housingCostIndex": 90, "educationSpendingPerCapita": 11500, "monthlyData": {} },
    "WY": { "name": "Wyoming", "income": 72415, "gdp_per_capita": 90335, "population": 584000, "area": 97813, "unemploymentRate": 3.0, "housingCostIndex": 95, "educationSpendingPerCapita": 12000, "monthlyData": {} }
  };

  // --- Filter State Variables (remains unchanged) ---
  currentDisplayCategory: 'income' | 'population' | 'area' | 'gdp' | 'unemployment' | 'housing' | 'education' = 'income';
  currentMonth: string | undefined;
  currentSixMonthStartMonth: string | undefined;
  currentSingleStateCode: string | undefined;
  currentTopN: number | undefined;
  currentBottomN: number | undefined;
  currentMinVal: number | undefined;
  currentMaxVal: number | undefined;
  searchStateText: string = '';

  // --- Constructor ---
  constructor() { }

  // --- Lifecycle Hooks ---
  ngOnInit() {
    this.generateMonthlyData();
  }

  ngAfterViewInit() {
    // Initial render of the chart based on default filters and chart type
    this.applyFiltersAndRenderCharts();
  }

  ngOnDestroy() {
    if (this.currentChart) {
      this.currentChart.destroy();
    }
  }

  // --- Data Generation (remains unchanged) ---
  generateMonthlyData() {
    const today = new Date();
    for (const stateCode in this.stateData) {
      if (this.stateData.hasOwnProperty(stateCode)) {
        const state = this.stateData[stateCode];
        state.monthlyData = {};
        for (let i = 0; i < 12; i++) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          state.monthlyData[yearMonth] = {
            income: state.income * (1 + (Math.random() - 0.5) * 0.1),
            gdp_per_capita: state.gdp_per_capita * (1 + (Math.random() - 0.5) * 0.1),
            population: Math.round(state.population * (1 + (Math.random() - 0.5) * 0.02)),
            area: state.area,
            unemploymentRate: parseFloat((state.unemploymentRate * (1 + (Math.random() - 0.5) * 0.15)).toFixed(1)),
            housingCostIndex: parseFloat((state.housingCostIndex * (1 + (Math.random() - 0.5) * 0.1)).toFixed(0)),
            educationSpendingPerCapita: parseFloat((state.educationSpendingPerCapita * (1 + (Math.random() - 0.5) * 0.1)).toFixed(0))
          };
        }
      }
    }
  }

  // --- Central Chart Rendering Dispatcher ---
  private applyFiltersAndRenderCharts() {
    this.renderDynamicChart(
      this.currentDisplayCategory,
      this.currentMonth,
      this.currentSixMonthStartMonth,
      this.currentSingleStateCode,
      this.currentTopN,
      this.currentBottomN,
      this.currentMinVal,
      this.currentMaxVal
    );
  }

  /**
   * Main function to render the selected chart type with applied filters.
   */
  async renderDynamicChart(
    displayCategory: 'income' | 'population' | 'area' | 'gdp' | 'unemployment' | 'housing' | 'education',
    month?: string,
    sixMonthStartMonth?: string,
    singleStateCode?: string,
    topN?: number,
    bottomN?: number,
    minVal?: number,
    maxVal?: number
  ) {
    if (this.currentChart) {
      this.currentChart.destroy(); // Destroy previous chart instance
    }

    // 1. Get Base Data
    const postalCodes = Object.keys(this.stateData);
    let currentIncomeData: number[] = [];
    let currentGdpData: number[] = [];
    let currentPopulationData: number[] = [];
    let currentAreaData: number[] = [];
    let currentUnemploymentData: number[] = [];
    let currentHousingData: number[] = [];
    let currentEducationData: number[] = [];

    // Determine the base data source (snapshot, monthly, or 6-month avg)
    if (month) {
      postalCodes.forEach(code => {
        const monthly = this.stateData[code].monthlyData[month];
        currentIncomeData.push(monthly ? monthly.income : this.stateData[code].income);
        currentGdpData.push(monthly ? monthly.gdp_per_capita : this.stateData[code].gdp_per_capita);
        currentPopulationData.push(monthly ? monthly.population : this.stateData[code].population);
        currentAreaData.push(monthly ? monthly.area : this.stateData[code].area);
        currentUnemploymentData.push(monthly ? monthly.unemploymentRate : this.stateData[code].unemploymentRate);
        currentHousingData.push(monthly ? monthly.housingCostIndex : this.stateData[code].housingCostIndex);
        currentEducationData.push(monthly ? monthly.educationSpendingPerCapita : this.stateData[code].educationSpendingPerCapita);
      });
    } else if (sixMonthStartMonth) {
      const startDate = new Date(sixMonthStartMonth);
      postalCodes.forEach(code => {
        let sumIncome = 0; let sumGdp = 0; let sumPop = 0; let sumArea = 0;
        let sumUnemployment = 0; let sumHousing = 0; let sumEducation = 0;
        let count = 0;
        for (let i = 0; i < 6; i++) {
          const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
          const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          const monthly = this.stateData[code].monthlyData[yearMonth];
          if (monthly) {
            sumIncome += monthly.income; sumGdp += monthly.gdp_per_capita;
            sumPop += monthly.population; sumArea += monthly.area;
            sumUnemployment += monthly.unemploymentRate;
            sumHousing += monthly.housingCostIndex;
            sumEducation += monthly.educationSpendingPerCapita;
            count++;
          }
        }
        currentIncomeData.push(count > 0 ? sumIncome / count : this.stateData[code].income);
        currentGdpData.push(count > 0 ? sumGdp / count : this.stateData[code].gdp_per_capita);
        currentPopulationData.push(count > 0 ? sumPop / count : this.stateData[code].population);
        currentAreaData.push(count > 0 ? sumArea / count : this.stateData[code].area);
        currentUnemploymentData.push(count > 0 ? sumUnemployment / count : this.stateData[code].unemploymentRate);
        currentHousingData.push(count > 0 ? sumHousing / count : this.stateData[code].housingCostIndex);
        currentEducationData.push(count > 0 ? sumEducation / count : this.stateData[code].educationSpendingPerCapita);
      });
    } else {
      currentIncomeData = postalCodes.map(code => this.stateData[code].income);
      currentGdpData = postalCodes.map(code => this.stateData[code].gdp_per_capita);
      currentPopulationData = postalCodes.map(code => this.stateData[code].population);
      currentAreaData = postalCodes.map(code => this.stateData[code].area);
      currentUnemploymentData = postalCodes.map(code => this.stateData[code].unemploymentRate);
      currentHousingData = postalCodes.map(code => this.stateData[code].housingCostIndex);
      currentEducationData = postalCodes.map(code => this.stateData[code].educationSpendingPerCapita);
    }

    // Consolidate all data into an accessible structure
    const allColumns: {
      postalCodes: string[],
      stateNames: string[],
      incomes: number[],
      gdps: number[],
      populations: number[],
      areas: number[],
      unemploymentRates: number[],
      housingCosts: number[],
      educationSpendings: number[],
    } = {
      postalCodes: postalCodes,
      stateNames: postalCodes.map(code => this.stateData[code].name),
      incomes: currentIncomeData,
      gdps: currentGdpData,
      populations: currentPopulationData,
      areas: currentAreaData,
      unemploymentRates: currentUnemploymentData,
      housingCosts: currentHousingData,
      educationSpendings: currentEducationData
    };

    let displayValue: number[];
    let seriesName: string;
    let tooltipSuffix: string;
    let dataClasses: any[] = []; // Only for map, but declared here for consistency
    let subtitleParts: string[] = [];

    // Determine the initial subtitle part based on time filter
    if (month) {
      subtitleParts.push(`Data for ${month}`);
    } else if (sixMonthStartMonth) {
      const startDate = new Date(sixMonthStartMonth);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 5, 1);
      subtitleParts.push(`Average for ${sixMonthStartMonth} to ${endDate.toISOString().substring(0, 7)}`);
    } else {
      subtitleParts.push('Current Snapshot');
    }

    // Assign display values, names, suffixes and data classes based on category
    switch (displayCategory) {
      case 'income':
        displayValue = allColumns.incomes;
        seriesName = 'Median Household Income';
        tooltipSuffix = ' USD';
        dataClasses = [{ from: 0, to: 65000, color: '#E0F2F7', name: '< $65k' }, { from: 65001, to: 80000, color: '#B2EBF2', name: '$65k - $80k' }, { from: 80001, to: 95000, color: '#80DEEA', name: '$80k - $95k' }, { from: 95001, to: 200000, color: '#4DD0E1', name: '> $95k' }];
        break;
      case 'population':
        displayValue = allColumns.populations;
        seriesName = 'Population';
        tooltipSuffix = ' People';
        dataClasses = [{ from: 0, to: 2000000, color: '#F8E0E0', name: '< 2M' }, { from: 2000001, to: 5000000, color: '#F0B2B2', name: '2M - 5M' }, { from: 5000001, to: 10000000, color: '#E88484', name: '5M - 10M' }, { from: 10000001, to: 40000000, color: '#E05555', name: '> 10M' }];
        break;
      case 'area':
        displayValue = allColumns.areas;
        seriesName = 'State Area';
        tooltipSuffix = ' sq mi';
        dataClasses = [{ from: 0, to: 20000, color: '#F0FFF0', name: '< 20k sq mi' }, { from: 20001, to: 50000, color: '#CCFFCC', name: '20k - 50k sq mi' }, { from: 50001, to: 100000, color: '#99E699', name: '50k - 100k sq mi' }, { from: 100001, to: 700000, color: '#66CD66', name: '> 100k sq mi' }];
        break;
      case 'gdp':
        displayValue = allColumns.gdps;
        seriesName = 'GDP per Capita';
        tooltipSuffix = ' USD';
        dataClasses = [{ from: 0, to: 65000, color: '#F8E0F8', name: '< $65k' }, { from: 65001, to: 80000, color: '#F0B2F0', name: '$65k - $80k' }, { from: 80001, to: 95000, color: '#E884E8', name: '$80k - $95k' }, { from: 95001, to: 120000, color: '#E055E0', name: '> $95k' }];
        break;
      case 'unemployment':
        displayValue = allColumns.unemploymentRates;
        seriesName = 'Unemployment Rate';
        tooltipSuffix = '%';
        dataClasses = [{ from: 0, to: 3.0, color: '#C8E6C9', name: '< 3.0%' }, { from: 3.1, to: 4.0, color: '#A5D6A7', name: '3.1% - 4.0%' }, { from: 4.1, to: 5.0, color: '#81C784', name: '4.1% - 5.0%' }, { from: 5.1, to: 100, color: '#4CAF50', name: '> 5.0%' }];
        break;
      case 'housing':
        displayValue = allColumns.housingCosts;
        seriesName = 'Housing Cost Index';
        tooltipSuffix = '';
        dataClasses = [{ from: 0, to: 90, color: '#BBDEFB', name: '< 90 (Cheaper)' }, { from: 91, to: 110, color: '#90CAF9', name: '91 - 110 (Avg)' }, { from: 111, to: 130, color: '#64B5F6', name: '111 - 130 (High)' }, { from: 131, to: 300, color: '#42A5F5', name: '> 130 (Very High)' }];
        break;
      case 'education':
        displayValue = allColumns.educationSpendings;
        seriesName = 'Education Spending per Capita';
        tooltipSuffix = ' USD';
        dataClasses = [{ from: 0, to: 10000, color: '#FFCDD2', name: '< $10k' }, { from: 10001, to: 12000, color: '#EF9A9A', name: '$10k - $12k' }, { from: 12001, to: 15000, color: '#E57373', name: '$12k - $15k' }, { from: 15001, to: 30000, color: '#EF5350', name: '> $15k' }];
        break;
    }

    let statesForDisplay: ChartDataPoint[] = [];
    postalCodes.forEach((code, index) => {
      statesForDisplay.push({
        code: code,
        value: displayValue[index],
        name: allColumns.stateNames[index]
      });
    });

    let filteredStatesData: ChartDataPoint[] = [];
    let filterActive = false;

    if (singleStateCode) {
      const state = statesForDisplay.find(s => s.code === singleStateCode);
      if (state) {
        filteredStatesData.push(state);
        subtitleParts.push(`Filtered: Only ${this.stateData[singleStateCode].name}`);
        filterActive = true;
      }
    } else if (topN || bottomN) {
      statesForDisplay.sort((a, b) => a.value - b.value);
      let tempFilteredStates: ChartDataPoint[];

      if (topN) {
        tempFilteredStates = statesForDisplay.slice(-topN).reverse();
        subtitleParts.push(`Filtered: Top ${topN} by ${seriesName}`);
        filterActive = true;
      } else { // bottomN
        tempFilteredStates = statesForDisplay.slice(0, bottomN);
        subtitleParts.push(`Filtered: Bottom ${bottomN} by ${seriesName}`);
        filterActive = true;
      }
      filteredStatesData = tempFilteredStates;

    } else if (minVal !== undefined || maxVal !== undefined) {
      filteredStatesData = statesForDisplay.filter(s => {
        const meetsMin = minVal === undefined || s.value >= minVal;
        const meetsMax = maxVal === undefined || s.value <= maxVal;
        return meetsMin && meetsMax;
      });
      const minText = minVal !== undefined ? minVal.toLocaleString() : 'Min';
      const maxText = maxVal !== undefined ? maxVal.toLocaleString() : 'Max';
      subtitleParts.push(`Filtered: ${seriesName} between ${minText} and ${maxText}`);
      filterActive = true;
    } else {
      filteredStatesData = statesForDisplay;
    }

    let options: any;
    let chartTypeToRender: string;

    switch (this.currentChartType) {
      case 'map':
        options = await this.getMapChartOptions(filteredStatesData, allColumns, seriesName, tooltipSuffix, dataClasses, subtitleParts, filterActive);
        chartTypeToRender = 'mapChart';
        break;
      case 'bar':
        options = this.getBarChartOptions(filteredStatesData, seriesName, tooltipSuffix, displayCategory, subtitleParts);
        chartTypeToRender = 'chart';
        break;
      case 'pie':
        options = this.getPieDonutChartOptions(filteredStatesData, seriesName, tooltipSuffix, displayCategory, subtitleParts, 'pie');
        chartTypeToRender = 'chart';
        break;
      case 'donut':
        options = this.getPieDonutChartOptions(filteredStatesData, seriesName, tooltipSuffix, displayCategory, subtitleParts, 'donut');
        chartTypeToRender = 'chart';
        break;
      default:
        console.warn('Unknown chart type selected:', this.currentChartType);
        return;
    }

    options.chart.renderTo = 'dynamicChartContainer';

    if (chartTypeToRender === 'mapChart') {
      this.currentChart = Highcharts.mapChart(options);
    } else {
      this.currentChart = Highcharts.chart(options);
    }
  }

  private async getMapChartOptions(
    filteredStatesData: ChartDataPoint[],
    allColumns: any, // This is a bit loose with 'any', but matches previous usage
    seriesName: string,
    tooltipSuffix: string,
    dataClasses: any[],
    subtitleParts: string[],
    filterActive: boolean
  ): Promise<any> {
    const mapData = await fetch('https://code.highcharts.com/mapdata/countries/us/us-all.topo.json')
      .then(response => response.json());

    const chartSeriesData: any[] = [];
    if (mapData?.objects?.default?.geometries) {
      mapData.objects.default.geometries.forEach((geometry: any) => {
        if (geometry?.properties?.['hc-key'] || geometry?.properties?.['postal-code']) {
          const postalCode = geometry.properties['postal-code'] || geometry.properties['hc-key'];
          const stateDataPoint = filteredStatesData.find(s => s.code === postalCode);

          let valueToDisplay = stateDataPoint ? stateDataPoint.value : null;
          let shouldBeHidden = false;

          // If a filter is active and this state is NOT in the filteredStatesData, hide it.
          if (filterActive && !stateDataPoint) {
            shouldBeHidden = true;
          }

          chartSeriesData.push(Highcharts.extend({
            value: shouldBeHidden ? null : valueToDisplay,
            name: stateDataPoint ? stateDataPoint.name : geometry.properties.name, // Use original name if not in filtered
            'postal-code': postalCode,
            labelText: '',
            row: allColumns.postalCodes.indexOf(postalCode) // Maintain original index for popup data
          }, geometry));
        }
      });
    }

    const currentDisplayCategory = this.currentDisplayCategory; // Capture for formatter closure

    return {
      chart: {
        type: 'map',
        map: mapData,
        borderWidth: 1,
        spacingBottom: 1,
        pinchType: undefined,
        zoomType: undefined,
        animation: {
          duration: 1000
        }
      },
      title: {
        text: `US State Data: ${seriesName}`,
        align: 'left'
      },
      subtitle: {
        text: subtitleParts.join(' & ') + '<br>Click on a state for detailed data',
        align: 'left'
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        x: -100,
        y: 70,
        floating: true,
        layout: 'vertical',
        valueDecimals: 0,
        backgroundColor: `color-mix(in srgb, var(--highcharts-background-color, white), transparent 15%)`
      },
      mapNavigation: {
        enabled: false,
        enableButtons: false
      },
      colorAxis: {
        dataClasses: dataClasses
      },
      credits: {
        enabled: false
      },
      series: [{
        data: chartSeriesData,
        joinBy: 'postal-code',
        dataLabels: {
          enabled: true,
          color: 'contrast',
          style: { textTransform: 'uppercase' },
          formatter: function (this: any) {
            if (this.point.value === null) return '';
            let formattedValue: string;
            if (currentDisplayCategory === 'income' || currentDisplayCategory === 'gdp' || currentDisplayCategory === 'education') {
              formattedValue = `$${(this.point.value / 1000).toFixed(0)}k`;
            } else if (currentDisplayCategory === 'population') {
              formattedValue = `${(this.point.value / 1000000).toFixed(1)}M`;
            } else if (currentDisplayCategory === 'area') {
              formattedValue = `${(this.point.value / 1000).toFixed(0)}k`;
            } else if (currentDisplayCategory === 'unemployment') {
              formattedValue = `${this.point.value.toFixed(1)}%`;
            } else if (currentDisplayCategory === 'housing') {
              formattedValue = `${this.point.value.toFixed(0)}`;
            } else {
              formattedValue = this.point.value.toString();
            }
            return formattedValue;
          }
        },
        name: seriesName,
        tooltip: { valueSuffix: tooltipSuffix },
        cursor: 'pointer'
      } as any, {
        name: 'Separators',
        type: 'mapline',
        nullColor: 'silver',
        showInLegend: false,
        enableMouseTracking: false,
        accessibility: { enabled: false }
      }]
    };
  }

  private getBarChartOptions(
    filteredStatesData: ChartDataPoint[],
    seriesName: string,
    tooltipSuffix: string,
    displayCategory: string,
    subtitleParts: string[]
  ): any {
    filteredStatesData.sort((a, b) => a.value - b.value);

    const categories = filteredStatesData.map(d => d.name);
    const data = filteredStatesData.map(d => ({ name: d.name, y: d.value }));

    return {
      chart: {
        type: 'bar',
        animation: { duration: 1000 }
      },
      title: {
        text: `US State Data: ${seriesName}`,
        align: 'left'
      },
      subtitle: {
        text: subtitleParts.join(' & '),
        align: 'left'
      },
      xAxis: {
        categories: categories,
        title: { text: null },
        labels: { style: { fontSize: '10px' } }
      },
      yAxis: {
        min: 0,
        title: { text: seriesName, align: 'high' },
        labels: {
          overflow: 'justify',
          formatter: function (this: any) {
            if (displayCategory === 'income' || displayCategory === 'gdp' || displayCategory === 'education') {
              return `$${(this.value as number / 1000).toFixed(0)}k`;
            } else if (displayCategory === 'population') {
              return `${(this.value as number / 1000000).toFixed(1)}M`;
            } else if (displayCategory === 'area') {
              return `${(this.value as number / 1000).toFixed(0)}k`;
            } else if (displayCategory === 'unemployment') {
              return `${(this.value as number).toFixed(1)}%`;
            } else if (displayCategory === 'housing') {
              return `${(this.value as number).toFixed(0)}`;
            } else {
              return (this.value as number).toString();
            }
          }
        }
      },
      tooltip: {
        valueSuffix: tooltipSuffix,
        formatter: function (this: any) {
          let formattedValue: string;
          if (displayCategory === 'income' || displayCategory === 'gdp' || displayCategory === 'education') {
            formattedValue = `$${this.y?.toLocaleString()}`;
          } else if (displayCategory === 'population') {
            formattedValue = `${this.y?.toLocaleString()} People`;
          } else if (displayCategory === 'area') {
            formattedValue = `${this.y?.toLocaleString()} sq mi`;
          } else if (displayCategory === 'unemployment') {
            formattedValue = `${this.y?.toFixed(1)}%`;
          } else if (displayCategory === 'housing') {
            formattedValue = `${this.y?.toFixed(0)}`;
          } else {
            formattedValue = this.y?.toLocaleString() || '';
          }
          return `<b>${this.point.name}</b><br/>${this.series.name}: ${formattedValue}`;
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            formatter: function (this: any) {
              let formattedValue: string;
              if (displayCategory === 'income' || displayCategory === 'gdp' || displayCategory === 'education') {
                formattedValue = `$${(this.y / 1000).toFixed(0)}k`;
              } else if (displayCategory === 'population') {
                formattedValue = `${(this.y / 1000000).toFixed(1)}M`;
              } else if (displayCategory === 'area') {
                formattedValue = `${(this.y / 1000).toFixed(0)}k`;
              } else if (displayCategory === 'unemployment') {
                formattedValue = `${this.y.toFixed(1)}%`;
              } else if (displayCategory === 'housing') {
                formattedValue = `${this.y.toFixed(0)}`;
              } else {
                formattedValue = this.y.toString();
              }
              return formattedValue;
            }
          }
        }
      },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [{
        name: seriesName,
        type: 'bar',
        data: data
      }]
    };
  }


  private getPieDonutChartOptions(
    filteredStatesData: ChartDataPoint[],
    seriesName: string,
    tooltipSuffix: string,
    displayCategory: string,
    subtitleParts: string[],
    chartType: 'pie' | 'donut'
  ): any {
    const data = filteredStatesData.map(d => ({ name: d.name, y: d.value }));
    const innerSize = chartType === 'donut' ? '60%' : '0%';
    const currentDisplayCategory = displayCategory;
    return {
      chart: {
        type: 'pie', // Both pie and donut use type 'pie' with innerSize
        backgroundColor: 'transparent',
        height: 400, // Adjust height as needed
        animation: { duration: 1000 }
      },
      title: {
        text: `US State Data: ${seriesName}`,
        align: 'left'
      },
      subtitle: {
        text: subtitleParts.join(' & '),
        align: 'left'
      },
      tooltip: {
        pointFormat: `<b>{point.y:,.0f}${tooltipSuffix}</b> ({point.percentage:.1f}%)`,
        formatter: function (this: any) { // Custom formatter to handle different value displays
          let formattedValue: string;
          if (currentDisplayCategory === 'income' || currentDisplayCategory === 'gdp' || currentDisplayCategory === 'education') {
            formattedValue = `$${this.y?.toLocaleString()}`;
          } else if (currentDisplayCategory === 'population') {
            formattedValue = `${this.y?.toLocaleString()} People`;
          } else if (currentDisplayCategory === 'area') {
            formattedValue = `${this.y?.toLocaleString()} sq mi`;
          } else if (currentDisplayCategory === 'unemployment') {
            formattedValue = `${this.y?.toFixed(1)}%`;
          } else if (currentDisplayCategory === 'housing') {
            formattedValue = `${this.y?.toFixed(0)}`;
          } else {
            formattedValue = this.y?.toLocaleString() || '';
          }
          return `<b>${this.point.name}</b><br/>${this.series.name}: ${formattedValue} (${this.point.percentage?.toFixed(1)}%)`;
        }
      },
      plotOptions: {
        pie: {
          innerSize: innerSize,
          showInLegend: true,
          dataLabels: {
            enabled: true,
            formatter:
              function (this: any) { // Custom formatter to handle different value displays
                let formattedValue: string;
                if (currentDisplayCategory === 'income' || currentDisplayCategory === 'gdp' || currentDisplayCategory === 'education') {
                  formattedValue = `$${this.y?.toLocaleString()}`;
                } else if (currentDisplayCategory === 'population') {
                  formattedValue = `${this.y?.toLocaleString()} People`;
                } else if (currentDisplayCategory === 'area') {
                  formattedValue = `${this.y?.toLocaleString()} sq mi`;
                } else if (currentDisplayCategory === 'unemployment') {
                  formattedValue = `${this.y?.toFixed(1)}%`;
                } else if (currentDisplayCategory === 'housing') {
                  formattedValue = `${this.y?.toFixed(0)}`;
                } else {
                  formattedValue = this.y?.toLocaleString() || '';
                }
                return `<b>${this.point.name}</b><br/>${this.series.name}: ${formattedValue} (${this.point.percentage?.toFixed(1)}%)`;
              },
            //  '<b>{point.name}</b>: {point.percentage:.1f} %',
            distance: chartType === 'donut' ? 10 : 20, // Adjust label distance for donut
            style: {
              fontWeight: 'bold',
              color: 'black'
            }
          },
          borderWidth: 0
        }
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginBottom: 5,
        itemStyle: {
          fontSize: '11px'
        },
        labelFormatter: function (this: any) {
          // Format legend labels similar to the category display
          let formattedValue: string;
          if (currentDisplayCategory === 'income' || currentDisplayCategory === 'gdp' || currentDisplayCategory === 'education') {
            formattedValue = `$${(this.y / 1000).toFixed(0)}k`;
          } else if (currentDisplayCategory === 'population') {
            formattedValue = `${(this.y / 1000000).toFixed(1)}M`;
          } else if (currentDisplayCategory === 'area') {
            formattedValue = `${(this.y / 1000).toFixed(0)}k`;
          } else if (currentDisplayCategory === 'unemployment') {
            formattedValue = `${this.y.toFixed(1)}%`;
          } else if (currentDisplayCategory === 'housing') {
            formattedValue = `${this.y.toFixed(0)}`;
          } else {
            formattedValue = this.y.toString();
          }
          return `${this.name}: ${formattedValue}`;
        }
      },
      credits: { enabled: false },
      series: [{
        name: seriesName,
        type: 'pie',
        data: data
      }] as any[],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
              itemWidth: 150
            }
          }
        }]
      }
    };
  }

  // --- Filter Event Handlers (Modified to call applyFiltersAndRenderCharts) ---
  onDisplayCategoryChange(event: Event) {
    this.currentDisplayCategory = (event.target as HTMLSelectElement).value as any;
    this.resetSelectionFilters();
    this.applyFiltersAndRenderCharts();
  }

  onChartTypeChange(event: Event) {
    this.currentChartType = (event.target as HTMLSelectElement).value as any;
    this.applyFiltersAndRenderCharts(); // Re-render with new chart type
  }

  filterByMonth(event: any) {
    const yearMonth = event.target.value;
    this.currentMonth = yearMonth === '' ? undefined : yearMonth;
    this.currentSixMonthStartMonth = undefined;
    this.applyFiltersAndRenderCharts();
  }

  filterBySixMonths(event: any) {
    const startYearMonth = event.target.value
    this.currentSixMonthStartMonth = startYearMonth === '' ? undefined : startYearMonth;
    this.currentMonth = undefined;
    this.applyFiltersAndRenderCharts();
  }

  filterByTopN(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.currentTopN = value ? parseInt(value, 10) : undefined;
    this.currentBottomN = undefined;
    this.currentMinVal = undefined; this.currentMaxVal = undefined;
    this.currentSingleStateCode = undefined;
    this.applyFiltersAndRenderCharts();
  }

  filterByBottomN(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.currentBottomN = value ? parseInt(value, 10) : undefined;
    this.currentTopN = undefined;
    this.currentMinVal = undefined; this.currentMaxVal = undefined;
    this.currentSingleStateCode = undefined;
    this.applyFiltersAndRenderCharts();
  }

  filterByRange() {
    const minInput = document.getElementById('minValInput') as HTMLInputElement;
    const maxInput = document.getElementById('maxValInput') as HTMLInputElement;

    this.currentMinVal = minInput.value ? parseFloat(minInput.value) : undefined;
    this.currentMaxVal = maxInput.value ? parseFloat(maxInput.value) : undefined;

    this.currentTopN = undefined; this.currentBottomN = undefined;
    this.currentSingleStateCode = undefined;
    this.applyFiltersAndRenderCharts();
  }

  searchAndHighlightState() {
    const searchText = this.searchStateText.trim().toLowerCase();
    let foundStateCode: string | undefined = undefined;

    if (searchText) {
      for (const code in this.stateData) {
        if (this.stateData.hasOwnProperty(code)) {
          if (this.stateData[code].name.toLowerCase().includes(searchText) || code.toLowerCase() === searchText) {
            foundStateCode = code;
            break;
          }
        }
      }
    }
    this.currentSingleStateCode = foundStateCode;
    this.currentTopN = undefined; this.currentBottomN = undefined;
    this.currentMinVal = undefined; this.currentMaxVal = undefined;
    this.applyFiltersAndRenderCharts();
  }

  // Helper to reset only selection-based filters
  private resetSelectionFilters() {
    this.currentMonth = undefined;
    this.currentSixMonthStartMonth = undefined;
    this.currentSingleStateCode = undefined;
    this.currentTopN = undefined;
    this.currentBottomN = undefined;
    this.currentMinVal = undefined;
    this.currentMaxVal = undefined;
    this.searchStateText = '';

    const monthSelect = document.getElementById('filterMonth') as HTMLSelectElement;
    if (monthSelect) monthSelect.value = '';
    const sixMonthSelect = document.getElementById('filterSixMonths') as HTMLSelectElement;
    if (sixMonthSelect) sixMonthSelect.value = '';
    const singleStateSelect = document.getElementById('filterSingleState') as HTMLSelectElement;
    if (singleStateSelect) singleStateSelect.value = '';
    const topNSelect = document.getElementById('filterTopN') as HTMLSelectElement;
    if (topNSelect) topNSelect.value = '';
    const bottomNSelect = document.getElementById('filterBottomN') as HTMLSelectElement;
    if (bottomNSelect) bottomNSelect.value = '';
    const minInput = document.getElementById('minValInput') as HTMLInputElement;
    const maxInput = document.getElementById('maxValInput') as HTMLInputElement;
    if (minInput) minInput.value = '';
    if (maxInput) maxInput.value = '';
  }


  resetFilters() {
    this.currentDisplayCategory = 'income';
    this.currentChartType = 'map'; // Reset chart type as well
    this.resetSelectionFilters(); // Call the helper to clear all other filters

    // Ensure the dropdowns reflect the reset values
    const chartTypeSelect = document.getElementById('chartType') as HTMLSelectElement;
    if (chartTypeSelect) chartTypeSelect.value = 'map';
    const displayCategorySelect = document.getElementById('displayCategory') as HTMLSelectElement;
    if (displayCategorySelect) displayCategorySelect.value = 'income';


    this.applyFiltersAndRenderCharts();
  }

  getMonthsForDropdown(): { value: string, viewValue: string }[] {
    const months = [];
    const today = new Date();
    for (let i = 0; i <= 12; i++) { // Last 12 months including current
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      const yearMonth = `${year}-${monthNum.toString().padStart(2, '0')}`;
      const monthName = d.toLocaleString('en-US', { month: 'long' });
      months.push({ value: yearMonth, viewValue: `${monthName} ${year}` });
    }
    return months;
  }

  getAllStateCodes(): { value: string, viewValue: string }[] {
    const states = Object.keys(this.stateData).map(code => ({
      value: code,
      viewValue: `${this.stateData[code].name} (${code})`
    }));
    states.sort((a, b) => a.viewValue.localeCompare(b.viewValue));
    return states;
  }

}
