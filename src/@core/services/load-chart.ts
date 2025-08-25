import { Injectable } from '@angular/core';
declare const Highcharts: any;

@Injectable({
  providedIn: 'root'
})
export class LoadChart {

  constructor() { }


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
    console.log(selectedChartCate);
    console.log(selectedChartType);
    // CATEGORY CHARTS: line, column, bar
    if ([1].includes(selectedChartCate.id)) {
      if (selectedChartType.type === 'pie') {
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
          data: rawData.map(item => ({
            name: item[xAxis],
            y: Number(item[yAxis])
          }))
        }];
        tooltip = {
          pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y})'
        };
      } else {
        console.log(yAxis)
        categories = rawData.map(r => r[xAxis]);
        // const fieldsArray = Array.isArray(yAxis)
        //   ? yAxis
        //   : [yAxis];

        series = [{
          type: selectedChartType.type,
          stacking: stacking || undefined,
          name: yAxis,
          dataLabels: { enabled: dataLabel },
          enableMouseTracking,
          data: rawData.map(r => r[yAxis] ?? null)
        }];

        xAxisConfig = {
          categories,
          accessibility: {
            rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
          }
        };
        yAxisConfig = undefined; // default yAxis
      }

      // XY CHARTS: spline, scatter
    } else if ([6].includes(selectedChartCate.id)) {
      console.log(selectedSeriesFields)
      categories = rawData.map(r => r[xAxis]);
      if (!selectedSeriesFields) {
        return { series: [] }; // or return early
      }

      series = selectedSeriesFields.map(field => ({
        type: selectedChartType.type,
        stacking: stacking || undefined,
        name: field?.field,
        dataLabels: { enabled: dataLabel },
        enableMouseTracking,
        color: field?.color,
        data: rawData.map(r => r[field.field] ?? null),
      }));

      xAxisConfig = {
        categories,
        accessibility: {
          rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
        }
      };
      yAxisConfig = undefined; // default yAxis
    } else if ([2].includes(selectedChartCate.id)) {
      const field = Array.isArray(yAxis)
        ? yAxis[0]
        : yAxis;

      const dataPoints: [number, number][] = rawData
        .map(d => [Number(d[xAxis]), Number(d[field])] as [number, number])
        .filter(([x, y]) => !isNaN(x) && !isNaN(y));

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
      }
    } else if ([3].includes(selectedChartCate.id)) {
      const data: (string | number)[][] = rawData.map(item => [
        item[xAxis],
        item[yAxis],
        item[thirdArgument as string]
      ]);

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

    // FINAL RETURN OBJECT
    return {
      chart: {
        backgroundColor: 'transparent',
        zooming: { type: zooming }
      },
      title: { text: title, align: 'left' },
      subtitle: { text: subTitle, align: 'left' },
      xAxis: xAxisConfig,
      yAxis: yAxisConfig,
      tooltip,
      legend: {
        enabled: showLegend,
      },
      series
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
    const categories = rawData.map(item => item[selectedArgumentField]);
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
      data: rawData.map(r => r[field.field] ?? null),
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
        zooming: {
          type: zooming
        }
      },
      title: { text: chatTitle },
      subtitle: { text: subTitle },
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
    zooming: string,
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
        backgroundColor: 'transparent'
      },
      title: { text: title, align: 'left' },
      subtitle: { text: subTitle, align: 'left' },
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
