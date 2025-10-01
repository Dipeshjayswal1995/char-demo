import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { LOCAL_STORAGE_KEYS } from '../utils/local-storage-key.utility';
import { color } from 'highcharts';
import { ChartEventService } from './chart-event-service';


@Injectable({
  providedIn: 'root'
})
export class LoadChart {
  projectData: any = null;
  constructor(private readonly storage: StorageService, private readonly chartEventService: ChartEventService) {
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
    this.chartEventService.updateProjectConfig.subscribe((data) => {
      // if (data) {
      //   console.log('🔥 New chart mode activated!', data);
      //   this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
      // }
    });
  }



  getChartOptions(
    selectedChartCate: any,
    selectedChartType: any,
    rawData: any[],
    title: string,
    subTitle: string,
    xAxis: string,
    yAxis: string,
    zooming: string,
    showLegend: boolean = false,
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
    thirdArgument?: string,
    innerSize: string = '',
    startAngle: number = 0,
    endAngle: number = 0,
    stacking?: string,
    selectedSeriesFields?: { field: string; color: string }[]
  ): any {
    let categories: any[] = [];
    let series: any[] = [];
    let xAxisConfig: any = {};
    let yAxisConfig: any = {};
    let tooltip: any = {};

    // 🚨 Validate required inputs
    if (!selectedChartCate || !selectedChartCate.id) {
      console.warn("⚠️ Chart Category is missing!");
      return this.getNoDataChart("Chart Category not provided");
    }
    if (!selectedChartType || !selectedChartType.type) {
      console.warn("⚠️ Chart Type is missing!");
      return this.getNoDataChart("Chart Type not provided");
    }
    if (!rawData || rawData.length === 0) {
      console.warn("⚠️ No raw data provided!");
      return this.getNoDataChart("No data available");
    }

    try {
      // CATEGORY CHARTS: line, column, bar
      if ([1].includes(selectedChartCate.id)) {
        if (!xAxis || !yAxis) {
          console.warn("⚠️ Missing xAxis or yAxis for chart!");
          return this.getNoDataChart("xAxis or yAxis not provided");
        }
        if (selectedChartType.type === 'pie') {
          const grouped = rawData.reduce((acc, r) => {
            const key = r[xAxis];
            if (!acc[key]) acc[key] = 0;
            acc[key] += r[yAxis] ?? 0;
            return acc;
          }, {});

          // ✅ Convert to Highcharts [{ name, y }] format
          const data = Object.entries(grouped).map(([key, value]) => ({
            name: key,
            y: Number(value)
          }));
          series = [{
            type: selectedChartType.type,
            innerSize: innerSize === '' ? 0 : innerSize + '%',
            name: yAxis,
            colorByPoint: true,
            allowPointSelect: true,
            cursor: 'pointer',
            enableMouseTracking,
            dataLabels: {
              enabled: dataLabel,
              format: '<b>{point.name}</b>: {point.percentage:.1f}%'
            },
            startAngle,
            endAngle,
            showInLegend: showLegend,
            data
          }];
          tooltip = {
            pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y})'
          };
          console.log("series==>", series);
        } else {
          const grouped = rawData.reduce((acc, r) => {
            const key = r[xAxis];
            if (!acc[key]) acc[key] = 0;
            acc[key] += r[yAxis] ?? 0;
            return acc;
          }, {});
          const categories = Object.keys(grouped);
          const seriesData = Object.values(grouped);
          series = [{
            type: selectedChartType.type,
            stacking: stacking || undefined,
            name: yAxis,
            dataLabels: { enabled: dataLabel },
            enableMouseTracking,
            data: seriesData
          }];
          xAxisConfig = {
            categories,
            // type: 'datetime',
            accessibility: {
              rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
            }
          };
          yAxisConfig = undefined;

        }

        // XY CHARTS: spline, scatter
      } else if ([6].includes(selectedChartCate.id)) {

        if (!xAxis) {
          console.warn("⚠️ Missing xAxis  for  chart!");
          return this.getNoDataChart("xAxis not provided");
        } else if (!selectedSeriesFields || selectedSeriesFields.length === 0) {
          console.warn("⚠️ No series fields selected for XY Chart!");
          return this.getNoDataChart("No series fields selected");
        }
        const yFields = selectedSeriesFields.map(f => f.field);
        const grouped = rawData.reduce((acc, r) => {
          const key = r[xAxis];
          if (!acc[key]) acc[key] = {};
          yFields.forEach(f => {
            acc[key][f] = (acc[key][f] || 0) + (r[f] ?? 0);
          });
          return acc;
        }, {});
        const categories = Object.keys(grouped);
        series = selectedSeriesFields.map(field => ({
          type: selectedChartType.type,
          stacking: stacking || undefined,
          name: field?.field,
          dataLabels: { enabled: dataLabel },
          enableMouseTracking,
          color: field?.color,
          data: categories.map(c => grouped[c][field.field] ?? 0),
        }));
        xAxisConfig = {
          categories,
          accessibility: {
            rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
          }
        };
        yAxisConfig = undefined;

      } else if ([2].includes(selectedChartCate.id)) {
        // const field = Array.isArray(yAxis) ? yAxis[0] : yAxis;
        // const dataPoints: [number, number][] = rawData
        //   .map(d => [Number(d[xAxis]), Number(d[field])] as [number, number])
        //   .filter(([x, y]) => !isNaN(x) && !isNaN(y));

        const field = Array.isArray(yAxis) ? yAxis[0] : yAxis;

        // ✅ Group by xAxis
        const grouped = rawData.reduce((acc: Record<number, number>, d) => {
          const x = Number(d[xAxis]);
          const y = Number(d[field]);
          if (!isNaN(x) && !isNaN(y)) {
            acc[x] = (acc[x] || 0) + y;
          }
          return acc;
        }, {});

        // ✅ Convert to Highcharts datapoints
        const dataPoints: [number, number][] = Object.entries(grouped).map(
          ([x, y]) => [Number(x), y]
        );

        if (dataPoints.length === 0) {
          console.warn("⚠️ Invalid or missing numeric values for chart");
          return this.getNoDataChart("Invalid numeric values for chart");
        }
        series = [{
          type: selectedChartType.type,
          name: field,
          dataLabels: {
            enabled: dataLabel,
            format: `{point.y}`
          },
          enableMouseTracking,
          label: { enabled: true },
          data: dataPoints
        }];
        xAxisConfig = {
          reversed: false,
          title: { enabled: true, text: xAxis },
        };
        yAxisConfig = {
          title: { text: field },
          lineWidth: 2
        };
        tooltip = {
          headerFormat: `<b>${xAxis} : ${Array.isArray(yAxis) ? yAxis.join(', ') : yAxis}</b><br/>`,
          pointFormat: '{point.x} : {point.y}'
        };

      } else if ([3].includes(selectedChartCate.id)) {

        if (!thirdArgument || !yAxis || !xAxis) {
          console.warn("⚠️ X, Y or Third argument missing for  chart");
          return this.getNoDataChart("⚠️ X, Y or Third argument missing for  chart");
        }
        // const data: (string | number)[][] = rawData.map(item => [
        //   item[xAxis],
        //   item[yAxis],
        //   item[thirdArgument]
        // ]);

        // ✅ Strong typing for accumulator
        const grouped: Record<string, { y: number; z: number }> = {};

        rawData.forEach(row => {
          const key = row[xAxis];
          if (!grouped[key]) {
            grouped[key] = { y: 0, z: 0 };
          }
          grouped[key].y += Number(row[yAxis] ?? 0);
          if (thirdArgument) {
            grouped[key].z += Number(row[thirdArgument] ?? 0);
          }
        });

        // ✅ Correctly type Object.entries()
        const data: (string | number)[][] = Object.entries(grouped).map(
          ([x, vals]) =>
            thirdArgument ? [x, vals.y, vals.z] : [x, vals.y]
        );

        series = [{
          type: selectedChartType.type,
          name: xAxis,
          data,
          colorByPoint: true,
          borderRadius: 3,
          enableMouseTracking,
          dataLabels: {
            enabled: dataLabel,
            format: `{point.y:.0f}`
          },
          tooltip: {
            pointFormat: `${yAxis}: <b>{point.y}</b><br>` +
              `${thirdArgument}: <b>{point.z}</b><br>`
          }
        }];
        xAxisConfig = { type: 'category' };
      }
    } catch (err) {
      console.error("❌ Error building chart options:", err);
      return this.getNoDataChart("Chart configuration error");
    }

    // ✅ Final Safe Return
    return {
      chart: {
        backgroundColor: this.projectData.chartBackgroundColor ? this.projectData.chartBackgroundColor : 'transparent',
        zooming: { type: zooming }
      },
      title: { text: title || '', align: 'left', style: { color: this.projectData.textColor } },
      subtitle: { text: subTitle || '', align: 'left', style: { color: this.projectData.textColor } },
      xAxis: xAxisConfig,
      yAxis: yAxisConfig,
      tooltip,
      legend: { enabled: showLegend },
      series: series.length > 0 ? series : [],
      lang: { noData: "No data available" },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#666'
        }
      }
    };
  }

  // ✅ Helper for "no data" charts
  getNoDataChart(message: string) {
    return {
      chart: { backgroundColor: 'transparent' },
      title: { text: '', align: 'left' },
      series: [],
      lang: { noData: message },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#666'
        }
      }
    };
  }


  multiDiminonalChart(
    chatTitle: string,
    subTitle: string,
    rawData: any[],
    selectedArgumentField: string,
    yAxis: any[],
    zooming: string,
    showLegend: boolean = false,
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
  ) {
    if (!selectedArgumentField || !yAxis || yAxis.length === 0) {
      console.warn("⚠️ Missing argument or yAxis fields for multi-dimensional chart!");
      return this.getNoDataChart("⚠️ Missing argument or yAxis fields for multi-dimensional chart!");
    }
    const grouped: Record<string, Record<string, number>> = {};
    rawData.forEach(row => {
      const key = row[selectedArgumentField];
      if (!grouped[key]) grouped[key] = {};

      yAxis.forEach(y => {
        grouped[key][y.field] = (grouped[key][y.field] ?? 0) + Number(row[y.field] ?? 0);
      });
    });

    // ✅ Categories (unique X values)
    const categories = Object.keys(grouped);

    // const categories = rawData.map(item => item[selectedArgumentField]);
    const series = yAxis.map((field, index) => ({
      name: field.title,
      type: field.chartType,
      dataLabels: { enabled: dataLabel },
      enableMouseTracking,
      yAxis: index,
      tooltip: {
        valueSuffix: ' ' + field.unit,
      },
      color: field.color,
      data: categories.map(c => grouped[c][field.field] ?? 0),
    }));
    const yAxisData = yAxis.map((series, index) => ({
      title: {
        text: series.title,
        style: {
          color: series.color
        }
      },
      labels: {
        format: '{value}' + series.unit,
        style: {
          color: series.color
        }
      },
      opposite: series.opposite
    }));
    console.log("yAxisData ===> ", yAxisData);


    console.log(categories);
    console.log(series);
    return {
      chart: {
        backgroundColor: this.projectData.chartBackgroundColor ? this.projectData.chartBackgroundColor : 'transparent',
        zooming: {
          type: zooming
        }
      },
      title: { text: chatTitle || '', align: 'left', style: { color: this.projectData.textColor } },
      subtitle: { text: subTitle || '', align: 'left', style: { color: this.projectData.textColor } },
      xAxis: [{
        categories: categories,
        crosshair: true
      }],
      yAxis: yAxisData,
      tooltip: {
        shared: true
      },
      legend: {
        enabled: showLegend,
      },
      series: series
    }
  }

  async renderMapChart(
    selectedChartCate: any,
    selectedMapOption: any,
    selectedMatchValue: any,
    rawData: any[],
    title: string,
    subTitle: string,
    xAxis: string,
    showLegend: boolean = false,
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
  ) {
    const mapUrl: any = selectedMapOption?.json_file;
    console.log(mapUrl);
    const topology = await fetch(mapUrl).then(response => response.json());
    const mapData = rawData.map(row => ({
      code: (row[selectedMatchValue] || '').toUpperCase(),
      value: row[xAxis]
    }));

    console.log(selectedMapOption?.uniqueValueMatch)
    console.log(mapData);
    console.log(topology);
    return {
      chart: {
        map: topology,
        backgroundColor: this.projectData.chartBackgroundColor ? this.projectData.chartBackgroundColor : 'transparent',
      },
      title: { text: title || '', align: 'left', style: { color: this.projectData.textColor } },
      subtitle: { text: subTitle || '', align: 'left', style: { color: this.projectData.textColor } },
      mapNavigation: {
        enabled: true
      },
      colorAxis: {
        min: 1,
        type: 'logarithmic',
        minColor: '#EEEEFF',
        maxColor: '#000022',
        stops: [
          [0, '#EFEFFF'],
          [0.67, '#4444FF'],
          [1, '#000022']
        ]
      },
      series: [{
        data: rawData,
        colorByPoint: true,
        joinBy: [selectedMapOption?.uniqueValueMatch, selectedMatchValue],
        name: xAxis,
        dataLabels: {
          enabled: true,
          formatter: function (this: any) {
            return `${this.point[xAxis] ? this.point[xAxis] : ''}`;
          }
        },
        tooltip: {
          formatter: function (this: any) {
            console.log(this.point);
            return `${this.point[selectedMatchValue]}: ${this.point[xAxis]}`;
          }
        }
      }]
    }
  }



}
