import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare var Highcharts: any;

interface MonthlyData {
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
  unemploymentRate: number; // NEW
  housingCostIndex: number; // NEW
  educationSpendingPerCapita: number; // NEW
}

interface StateInfo {
  name: string;
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
  unemploymentRate: number; // NEW
  housingCostIndex: number; // NEW
  educationSpendingPerCapita: number; // NEW
  monthlyData: { [key: string]: MonthlyData };
}


@Component({
  selector: 'app-mapchart',
  imports: [CommonModule, FormsModule],
  templateUrl: './mapchart.html',
  styleUrl: './mapchart.scss'
})
export class Mapchart {

  chart7: any;
  // Track current filter states for UI and chart updates
  currentDisplayCategory: 'income' | 'population' | 'area' | 'gdp' | 'unemployment' | 'housing' | 'education' = 'income';
  currentMonth: string | undefined = undefined;
  currentSixMonthStartMonth: string | undefined = undefined;
  currentSingleStateCode: string | undefined = undefined;
  currentTopN: number | undefined = undefined;
  currentBottomN: number | undefined = undefined;
  currentMinVal: number | undefined = undefined;
  currentMaxVal: number | undefined = undefined;
  searchStateText: string = ''; // For state search input

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


  constructor() {
    this.generateMonthlyData();
  }

  generateMonthlyData() {
    const today = new Date();
    // Generate data for past 12 months for demonstration
    for (const stateCode in this.stateData) {
      if (this.stateData.hasOwnProperty(stateCode)) {
        const state = this.stateData[stateCode];
        for (let i = 0; i < 12; i++) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          state.monthlyData[yearMonth] = {
            income: state.income * (1 + (Math.random() - 0.5) * 0.1), // +/- 5% variation
            gdp_per_capita: state.gdp_per_capita * (1 + (Math.random() - 0.5) * 0.1),
            population: Math.round(state.population * (1 + (Math.random() - 0.5) * 0.02)), // +/- 1% variation
            area: state.area, // Area remains constant
            unemploymentRate: parseFloat((state.unemploymentRate * (1 + (Math.random() - 0.5) * 0.15)).toFixed(1)), // +/- 7.5% variation, 1 decimal place
            housingCostIndex: parseFloat((state.housingCostIndex * (1 + (Math.random() - 0.5) * 0.1)).toFixed(0)), // +/- 5% variation, integer
            educationSpendingPerCapita: parseFloat((state.educationSpendingPerCapita * (1 + (Math.random() - 0.5) * 0.1)).toFixed(0)) // +/- 5% variation, integer
          };
        }
      }
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.chartSeven(this.currentDisplayCategory); // Initial display
  }

  ngOnDestroy() {
    if (this.chart7) {
      this.chart7.destroy();
    }
  }

  private applyFiltersAndRenderChart() {
    this.chartSeven(
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

  // --- Main Chart Rendering Function ---
  chartSeven(
    displayCategory: 'income' | 'population' | 'area' | 'gdp' | 'unemployment' | 'housing' | 'education',
    month?: string,
    sixMonthStartMonth?: string,
    singleStateCode?: string,
    topN?: number,
    bottomN?: number,
    minVal?: number,
    maxVal?: number
  ) {
    (async () => {
      const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
      ).then(response => response.json());

      const postalCodes = Object.keys(this.stateData);
      const stateNames = postalCodes.map(code => this.stateData[code].name);

      let currentIncomeData: number[] = [];
      let currentGdpData: number[] = [];
      let currentPopulationData: number[] = [];
      let currentAreaData: number[] = [];
      let currentUnemploymentData: number[] = []; // NEW
      let currentHousingData: number[] = [];      // NEW
      let currentEducationData: number[] = [];    // NEW

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
        unemploymentRates: number[], // NEW
        housingCosts: number[],      // NEW
        educationSpendings: number[], // NEW
      } = {
        postalCodes: postalCodes,
        stateNames: stateNames,
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
      let dataClasses: any[];
      let subtitleParts: string[] = [];

      // Determine initial subtitle part based on time filter
      if (month) {
        subtitleParts.push(`Data for ${month}`);
      } else if (sixMonthStartMonth) {
        const endDate = new Date(new Date(sixMonthStartMonth).getFullYear(), new Date(sixMonthStartMonth).getMonth() + 5, 1);
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
        case 'unemployment': // NEW CATEGORY
          displayValue = allColumns.unemploymentRates;
          seriesName = 'Unemployment Rate';
          tooltipSuffix = '%';
          dataClasses = [{ from: 0, to: 3.0, color: '#C8E6C9', name: '< 3.0%' }, { from: 3.1, to: 4.0, color: '#A5D6A7', name: '3.1% - 4.0%' }, { from: 4.1, to: 5.0, color: '#81C784', name: '4.1% - 5.0%' }, { from: 5.1, to: 100, color: '#4CAF50', name: '> 5.0%' }];
          break;
        case 'housing': // NEW CATEGORY
          displayValue = allColumns.housingCosts;
          seriesName = 'Housing Cost Index';
          tooltipSuffix = '';
          dataClasses = [{ from: 0, to: 90, color: '#BBDEFB', name: '< 90 (Cheaper)' }, { from: 91, to: 110, color: '#90CAF9', name: '91 - 110 (Avg)' }, { from: 111, to: 130, color: '#64B5F6', name: '111 - 130 (High)' }, { from: 131, to: 300, color: '#42A5F5', name: '> 130 (Very High)' }];
          break;
        case 'education': // NEW CATEGORY
          displayValue = allColumns.educationSpendings;
          seriesName = 'Education Spending per Capita';
          tooltipSuffix = ' USD';
          dataClasses = [{ from: 0, to: 10000, color: '#FFCDD2', name: '< $10k' }, { from: 10001, to: 12000, color: '#EF9A9A', name: '$10k - $12k' }, { from: 12001, to: 15000, color: '#E57373', name: '$12k - $15k' }, { from: 15001, to: 30000, color: '#EF5350', name: '> $15k' }];
          break;
      }

      // Prepare data for actual display/filtering
      let statesForDisplay: { code: string, value: number, name: string }[] = [];
      postalCodes.forEach((code, index) => {
        statesForDisplay.push({
          code: code,
          value: displayValue[index],
          name: allColumns.stateNames[index]
        });
      });

      // --- APPLY NEW FILTERS ---
      let filteredStates: string[] = [];
      let filterActive = false; // Flag to indicate if any non-time filter is active

      if (singleStateCode) {
        filteredStates.push(singleStateCode);
        subtitleParts.push(`Filtered: Only ${this.stateData[singleStateCode].name}`);
        filterActive = true;
      } else if (topN || bottomN) {
        // Sort data based on current display category
        statesForDisplay.sort((a, b) => a.value - b.value); // Ascending for bottom N, descending for top N

        if (topN) {
          filteredStates = statesForDisplay.slice(-topN).map(s => s.code);
          subtitleParts.push(`Filtered: Top ${topN} by ${seriesName}`);
          filterActive = true;
        } else if (bottomN) {
          filteredStates = statesForDisplay.slice(0, bottomN).map(s => s.code);
          subtitleParts.push(`Filtered: Bottom ${bottomN} by ${seriesName}`);
          filterActive = true;
        }
      } else if (minVal !== undefined || maxVal !== undefined) {
        filteredStates = statesForDisplay.filter(s => {
          const meetsMin = minVal === undefined || s.value >= minVal;
          const meetsMax = maxVal === undefined || s.value <= maxVal;
          return meetsMin && meetsMax;
        }).map(s => s.code);
        subtitleParts.push(`Filtered: ${seriesName} between ${minVal !== undefined ? minVal.toLocaleString() : 'Min'} and ${maxVal !== undefined ? maxVal.toLocaleString() : 'Max'}`);
        filterActive = true;
      }


      const chartSeriesData: any[] = [];
      if (mapData?.objects?.default?.geometries) {
        mapData.objects.default.geometries.forEach((geometry: any) => {
          if (geometry?.properties?.['postal-code']) {
            const postalCode = geometry.properties['postal-code'];
            const i = allColumns.postalCodes.indexOf(postalCode);
            if (i >= 0) {
              let valueToDisplay = displayValue[i];
              let shouldBeHidden = false;

              // Determine if state should be hidden by current filters
              if (filterActive) {
                if (!filteredStates.includes(postalCode)) {
                  shouldBeHidden = true;
                }
              }

              if (shouldBeHidden) {
                // Set value to null for hidden states
                chartSeriesData.push(Highcharts.extend({
                  value: null,
                  name: allColumns.stateNames[i],
                  'postal-code': postalCode,
                  labelText: '', // No label for hidden states
                  row: i
                }, geometry));
              } else {
                // Otherwise, add the actual value
                chartSeriesData.push(Highcharts.extend({
                  value: valueToDisplay,
                  name: allColumns.stateNames[i],
                  'postal-code': postalCode,
                  labelText: '', // Formatted by dataLabels.formatter
                  row: i
                }, geometry));
              }
            }
          }
        });
      }

      const options: any = {
        style: {
          fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
        },
        chart: {
          type: 'map',
          map: mapData,
          renderTo: 'container7',
          borderWidth: 1,
          spacingBottom: 1,
          pinchType: '',
          zoomType: '',
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
          data: chartSeriesData, // Populated directly now
          joinBy: 'postal-code',
          dataLabels: {
            enabled: true,
            color: 'contrast',
            style: { textTransform: 'uppercase' },
            formatter: function (this: any) {
              if (this.point.value === null) return ''; // Hide label for null values
              let formattedValue: string;
              if (displayCategory === 'income' || displayCategory === 'gdp' || displayCategory === 'education') {
                formattedValue = `$${(this.point.value / 1000).toFixed(0)}k`;
              } else if (displayCategory === 'population') {
                formattedValue = `${(this.point.value / 1000000).toFixed(1)}M`;
              } else if (displayCategory === 'area') {
                formattedValue = `${(this.point.value / 1000).toFixed(0)}k`;
              } else if (displayCategory === 'unemployment') {
                formattedValue = `${this.point.value.toFixed(1)}%`;
              } else if (displayCategory === 'housing') {
                formattedValue = `${this.point.value.toFixed(0)}`;
              } else {
                formattedValue = this.point.value.toString();
              }
              return formattedValue;
            }
          },
          name: seriesName,
          point: {
            events: {
              // click: (function (this: any) { // Enclose pointClick in a self-executing function
              //   const currentAllColumns = allColumns;
              //   return function (this: any) {
              //     const postalCode = this['postal-code'];
              //     const rowIndex = currentAllColumns.postalCodes.indexOf(postalCode);
              //     if (rowIndex === -1) return;

              //     const chart = this.series.chart;
              //     chart.removeAnnotation('data-popup');

              //     chart.addAnnotation({
              //       id: 'data-popup',
              //       labelOptions: { useHTML: true, backgroundColor: '#fff' },
              //       labels: [{
              //         point: { x: chart.plotWidth / 2, y: chart.plotHeight / 10 },
              //         text: `
              //       <div id="annotation-container" style="width: 300px; padding: 10px; font-family: Arial;">
              //         <div id="annotation-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              //           <span style="font-weight: bold; font-size: 14px;">${this.name}</span>
              //           <button id="annotation-close-btn" style="background: none; border: none; font-weight: bold; font-size: 16px; cursor: pointer;">✕</button>
              //         </div>
              //         <div id="popup-data" style="width: 280px; height: 200px;"></div>
              //       </div>
              //     `,
              //         shape: 'rect'
              //       }],
              //       zIndex: 10
              //     });

              //     const pieChart = Highcharts.chart('popup-data', {
              //       chart: { type: 'pie' },
              //       title: { text: null },
              //       legend: { enabled: true, reversed: false },
              //       navigation: { buttonOptions: { enabled: false } },
              //       series: [{
              //         name: 'Data',
              //         data: [
              //           { name: 'Median Income', color: '#4CAF50', y: currentAllColumns.incomes[rowIndex] },
              //           { name: 'GDP per Capita', color: '#2196F3', y: currentAllColumns.gdps[rowIndex] },
              //           { name: 'Population', color: '#FFC107', y: currentAllColumns.populations[rowIndex] },
              //           { name: 'Area (sq mi)', color: '#9E9E9E', y: currentAllColumns.areas[rowIndex] },
              //           { name: 'Unemployment Rate', color: '#FF5722', y: currentAllColumns.unemploymentRates[rowIndex] }, // NEW
              //           { name: 'Housing Cost Index', color: '#673AB7', y: currentAllColumns.housingCosts[rowIndex] },       // NEW
              //           { name: 'Education Spending', color: '#00BCD4', y: currentAllColumns.educationSpendings[rowIndex] }  // NEW
              //         ],
              //         dataLabels: { format: '{point.name}: {point.y:,.1f}' }, // Adjusted for decimals
              //         showInLegend: true
              //       }]
              //     });

              //     const closeBtn = document.getElementById('annotation-close-btn');
              //     if (closeBtn) {
              //       closeBtn.addEventListener('click', function () {
              //         pieChart?.destroy();
              //         setTimeout(() => {
              //           chart.removeAnnotation('data-popup');
              //         }, 0);
              //       });
              //     }
              //   };
              // })()
            }, // End of pointClick
            tooltip: { valueSuffix: tooltipSuffix },
            cursor: 'pointer'
          }
        }, {
          name: 'Separators',
          type: 'mapline',
          nullColor: 'silver',
          showInLegend: false,
          enableMouseTracking: false,
          accessibility: { enabled: false }
        }]
      };

      // Update or create chart
      if (this.chart7) {
        this.chart7.update({
          title: options.title,
          subtitle: options.subtitle,
          colorAxis: options.colorAxis,
          series: [{
            data: chartSeriesData,
            name: seriesName,
            tooltip: { valueSuffix: tooltipSuffix },
            dataLabels: {
              formatter: (options.series as any[])[0].dataLabels?.formatter
            }
          }]
        } as any, true, true, true);
      } else {
        // For the initial render, options.series[0].data is already populated
        this.chart7 = Highcharts.mapChart('container7', options);
      }
    })();
  }

  // --- Filter Event Handlers (Update `current` variables and re-render) ---

  onDisplayCategoryChange(event: Event) {
    this.currentDisplayCategory = (event.target as HTMLSelectElement).value as any;
    // Clear other display-modifying filters when changing category, keep time filters
    this.currentSingleStateCode = undefined;
    this.currentTopN = undefined;
    this.currentBottomN = undefined;
    this.currentMinVal = undefined;
    this.currentMaxVal = undefined;
    this.searchStateText = ''; // Clear search input
    this.applyFiltersAndRenderChart();
  }

  filterByMonth(event: any) {
    const yearMonth = event.target.value;
    this.currentMonth = yearMonth === '' ? undefined : yearMonth;
    this.currentSixMonthStartMonth = undefined; // Clear other time filter
    this.applyFiltersAndRenderChart();
  }

  filterBySixMonths(event: any) {
    const startYearMonth = event.target.value
    this.currentSixMonthStartMonth = startYearMonth === '' ? undefined : startYearMonth;
    this.currentMonth = undefined; // Clear other time filter
    this.applyFiltersAndRenderChart();
  }

  // New Filters
  filterByTopN(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.currentTopN = value ? parseInt(value, 10) : undefined;
    this.currentBottomN = undefined; // Ensure only one N filter is active
    this.currentMinVal = undefined; this.currentMaxVal = undefined; // Clear range filter
    this.currentSingleStateCode = undefined; // Clear single state filter
    this.applyFiltersAndRenderChart();
  }

  filterByBottomN(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.currentBottomN = value ? parseInt(value, 10) : undefined;
    this.currentTopN = undefined; // Ensure only one N filter is active
    this.currentMinVal = undefined; this.currentMaxVal = undefined; // Clear range filter
    this.currentSingleStateCode = undefined; // Clear single state filter
    this.applyFiltersAndRenderChart();
  }

  filterByRange() {
    const minInput = document.getElementById('minValInput') as HTMLInputElement;
    const maxInput = document.getElementById('maxValInput') as HTMLInputElement;

    this.currentMinVal = minInput.value ? parseFloat(minInput.value) : undefined;
    this.currentMaxVal = maxInput.value ? parseFloat(maxInput.value) : undefined;

    this.currentTopN = undefined; this.currentBottomN = undefined; // Clear N filters
    this.currentSingleStateCode = undefined; // Clear single state filter
    this.applyFiltersAndRenderChart();
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
    this.currentTopN = undefined; this.currentBottomN = undefined; // Clear N filters
    this.currentMinVal = undefined; this.currentMaxVal = undefined; // Clear range filter
    this.applyFiltersAndRenderChart();
  }

  resetFilters() {
    // Reset all filter states to default
    this.currentDisplayCategory = 'income'; // Reset to default display
    this.currentMonth = undefined;
    this.currentSixMonthStartMonth = undefined;
    this.currentSingleStateCode = undefined;
    this.currentTopN = undefined;
    this.currentBottomN = undefined;
    this.currentMinVal = undefined;
    this.currentMaxVal = undefined;
    this.searchStateText = ''; // Clear search input

    // Reset UI elements (if they are bound to these properties with ngModel)
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
      select.value = ''; // Reset dropdowns
    });
    const minInput = document.getElementById('minValInput') as HTMLInputElement;
    const maxInput = document.getElementById('maxValInput') as HTMLInputElement;
    if (minInput) minInput.value = '';
    if (maxInput) maxInput.value = '';

    // Re-render the chart with all filters cleared
    this.applyFiltersAndRenderChart();
  }

  // Helper for generating month options for dropdowns
  getMonthsForDropdown(): { value: string, viewValue: string }[] {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      const yearMonth = `${year}-${monthNum.toString().padStart(2, '0')}`;
      const monthName = d.toLocaleString('en-US', { month: 'long' });
      months.push({ value: yearMonth, viewValue: `${monthName} ${year}` });
    }
    return months;
  }

}
