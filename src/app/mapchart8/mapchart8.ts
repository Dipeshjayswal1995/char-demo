import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as XLSX from 'xlsx';

declare const Highcharts: any;


@Component({
  selector: 'app-mapchart8',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './mapchart8.html',
  styleUrl: './mapchart8.scss'
})
export class Mapchart8 {
    apiUrl = '';
  isLoading = false;
  rawData: any[] = [];
  xFields: string[] = [];
  yFields: string[] = [];

  selectedXField = '';
  selectedSeries: { yField: string; chartType: string; yAxisIndex: number }[] = [];

  availableChartTypes = ['line', 'column', 'spline'];

  showLoadOptions = true;
  showBuilder = false;

  // Load from API
  fetchData(): void {
    if (!this.apiUrl) return;

    this.isLoading = true;
    fetch(this.apiUrl)
      .then(res => res.json())
      .then(data => {
        this.prepareData(data);
        this.isLoading = false;
        this.showLoadOptions = false;
        this.showBuilder = true;
      })
      .catch(err => {
        console.error('API Error:', err);
        this.isLoading = false;
      });
  }

  // Load from Excel
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      this.prepareData(jsonData);
      this.showLoadOptions = false;
      this.showBuilder = true;
    };
    reader.readAsArrayBuffer(file);
  }

  prepareData(data: any[]): void {
    if (!data.length) return;
    this.rawData = data;
    this.xFields = Object.keys(data[0]);
    this.yFields = this.xFields.slice(); // Clone for Y-field dropdown
    this.selectedXField = this.xFields[0];
  }

  addSeries(yField: string, chartType: string): void {
    const yAxisIndex = this.selectedSeries.length; // One Y axis per series
    this.selectedSeries.push({ yField, chartType, yAxisIndex });
  }

  loadChart(): void {
    const xCategories = this.rawData.map(d => d[this.selectedXField]);

    const yAxes = this.selectedSeries.map((s, i) => ({
      title: { text: s.yField },
      opposite: i % 2 === 1 // alternate left/right
    }));

    const series = this.selectedSeries.map((s, i) => ({
      name: s.yField,
      type: s.chartType,
      yAxis: i,
      data: this.rawData.map(d => parseFloat(d[s.yField]) || 0)
    }));

    Highcharts.chart('chartContainer', {
      chart: { zoomType: 'xy' },
      title: { text: 'Dynamic Multi-Axis Chart' },
      xAxis: { categories: xCategories },
      yAxis: yAxes,
      series
    });
  }

  reset(): void {
    this.rawData = [];
    this.selectedSeries = [];
    this.xFields = [];
    this.yFields = [];
    this.selectedXField = '';
    this.showLoadOptions = true;
    this.showBuilder = false;
  }
}
