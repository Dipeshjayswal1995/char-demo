import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartComponent, } from 'highcharts-angular';

import { LoadChart } from '../services/load-chart';
import * as XLSX from 'xlsx';

declare const Highcharts: any;

@Component({
  selector: 'app-mapchart9',
  imports: [ FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './mapchart9.html',
  styleUrl: './mapchart9.scss'
})
export class Mapchart9 {

  // onFileChange(event: any): void {
  //   const target: DataTransfer = <DataTransfer>(event.target);

  //   if (target.files.length !== 1) {
  //     console.error('Please select a single Excel file.');
  //     return;
  //   }

  //   const file: File = target.files[0];
  //   const reader: FileReader = new FileReader();

  //   reader.onload = (e: any) => {
  //     const bstr: string = e.target.result;
  //     const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //     // Assuming data is in the first worksheet
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];

  //     // Read sheet as raw 2D array (header + rows)
  //     const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  //     // Remove completely empty rows
  //     const filteredRows = data.filter(row => row.some(cell => cell !== ''));

  //     // Separate headers from rows
  //     const [headerRow, ...rows] = filteredRows;

  //     // Build clean JSON
  //     const cleanJson = rows.map(row => {
  //       const obj: any = {};
  //       headerRow.forEach((header, i) => {
  //         obj[header] = row[i];
  //       });
  //       return obj;
  //     });

  //     // console.log('✅ Clean Excel JSON:', cleanJson);
  //     this.uploadedExcelData = cleanJson;
  //     // this.handleLoadedData(cleanJson);
  //     // Now you can use `cleanJson` to display, upload, etc.
  //   };

  //   reader.readAsBinaryString(file);
  // }

  // resetOptions() {
  //   this.showOptions = true;
  //   this.rawData = [];
  //   // this.apiUrl = '';
  // }

  // changeChart() {
  //   console.log(this.selectedChartType);
  // }

  // async fetchAndConvertCSVtoJSON123(csvUrl: string): Promise<any[]> {
  //   const response = await fetch(csvUrl);
  //   let csvText = await response.text();

  //   // Clean up the CSV
  //   csvText = csvText.replace(/\n\n/g, '\n');

  //   const [headerLine, ...lines] = csvText.trim().split('\n');
  //   const headers = headerLine.split(',');

  //   const json = lines.map(line => {
  //     const values = line.split(',');

  //     // Declare entry as an object with string keys and any values
  //     const entry: { [key: string]: any } = {};

  //     headers.forEach((header, i) => {
  //       const value = values[i];
  //       // Parse numeric values, keep strings as-is
  //       entry[header] = isNaN(Number(value)) ? value : Number(value);
  //     });

  //     return entry;
  //   });

  //   return json;
  // }

  // async fetchAndConvertCSVtoJSON(csvUrl: string): Promise<any[]> {
  //   const response = await fetch(csvUrl);
  //   let csvText = await response.text();

  //   csvText = csvText.replace(/\n\n/g, '\n').trim();
  //   const lines = csvText.split('\n');

  //   if (lines.length < 2) {
  //     throw new Error('CSV has no data rows');
  //   }

  //   const headers = lines[0].split(',').map(h => h.trim());

  //   const data = lines.slice(1).map((line, index) => {
  //     const values = line.split(',');

  //     if (values.length !== headers.length) {
  //       console.warn(`Row ${index + 2} column count mismatch.`);
  //       return null;
  //     }

  //     const entry: { [key: string]: any } = {};
  //     headers.forEach((h, i) => {
  //       const val = values[i]?.trim();
  //       entry[h] = isNaN(Number(val)) ? val : Number(val);
  //     });

  //     return entry;
  //   }).filter(e => e !== null);

  //   return data;
  // }

  // fetchData() {
  //   this.isLoading = true;

  //   if (this.uploadedExcelData) {
  //     this.handleLoadedData(this.uploadedExcelData);
  //     this.isLoading = false;
  //     return;
  //   }

  //   // Check file type by extension
  //   const isCSV = this.apiUrl.trim().toLowerCase().endsWith('.csv');
  //   const isJSON = this.apiUrl.trim().toLowerCase().endsWith('.json');

  //   if (isCSV) {
  //     this.fetchAndConvertCSVtoJSON(this.apiUrl).then(data => {
  //       this.handleLoadedData(data);
  //     }).catch(error => {
  //       this.isLoading = false;
  //       console.error('CSV Load Error:', error);
  //     });
  //   } else if (isJSON) {
  //     this.http.get<any[]>(this.apiUrl).subscribe(data => {
  //       this.handleLoadedData(data);
  //     }, error => {
  //       this.isLoading = false;
  //       console.error('JSON Load Error:', error);
  //     });
  //   } else {
  //     // fallback if unknown file type
  //     this.isLoading = false;
  //     console.error('Unsupported file type. Only .csv or .json allowed.');
  //   }
  // }

  // handleLoadedData(data: any[]) {
  //   this.isLoading = false;
  //   this.showOptions = false;
  //   this.rawData = data;
  //   console.log(this.rawData);
  //   if (!data || data.length === 0) {
  //     console.error('No data found');
  //     return;
  //   }
  //   this.allFields = Object.keys(data[0]);
  //   this.valueFields = this.allFields;
  //   this.argumentFields = this.allFields;
  //   this.seriesFields = this.allFields;
  //   this.selectedValueField = this.valueFields[0] || '';
  //   this.selectedArgumentField = this.argumentFields[0] || '';
  //   this.selectedSeriesField = '';
  // }

}
