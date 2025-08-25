import { Injectable } from '@angular/core';

declare const Highcharts: any;

interface MapOption {
  name: string;
  json_file: string;
  uniqueValueMatch: string;
}

interface YAxis {
  title: string;
  field: string;
  chartType: string;
  unit: string;
  opposite: boolean;
  color: string;
}


@Injectable({
  providedIn: 'root'
})
export class ChartServices {
  private readonly markerSymbols = ['circle', 'square', 'diamond', 'triangle', 'triangle-down'];

  constructor() {}

    multiDiminonalChart(
    chatTitle: string,
    subTitle: string,
    rawData: any[],
    selectedArgumentField: string,
    yAxis: any[]
  ) {
    const categories = rawData.map(item => item[selectedArgumentField]);
    const series = yAxis.map((field, index) => ({
      name: field.title,
      type: field.chartType,
      dataLabels: { enabled: true },
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
          type: 'xy'
        }
      },
      title: {
        text: chatTitle
      },
      subtitle: {
        text: subTitle
      },
      xAxis: [{
        categories: categories,
        crosshair: true
      }],
      yAxis: yAxisData,
      tooltip: {
        shared: true
      },
      legend: {
        enabled: true,
      },
      // legend: {
      //   enalbe
      //   // layout: 'vertical',
      //   // align: 'left',
      //   // x: 80,
      //   // verticalAlign: 'top',
      //   // y: 55,
      //   // floating: true,
      //   // backgroundColor:
      //   //   Highcharts.defaultOptions.legend.backgroundColor ||
      //   //   'rgba(201, 123, 123, 0.25)'
      // },
      series: series
    }
  }


  // Line Chart Configuration
  getLineChartOptions(
    rawData: any[],
    title: string = '',
    subTitle: string = '',
    selectedArgumentField: string,
    selectedSeriesFields: string[],
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
    markerSymbol: string = 'circle',
    zooming: string = ''
  ): any {
    const categories = rawData.map(r => r[selectedArgumentField]);
    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(r => r[field] ?? null),
      marker: {
        symbol: markerSymbol || 'circle'
      }
    }));

    return {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        zooming: zooming ? { type: zooming } : undefined
      },
      title: {
        text: title,
        align: 'left',
        style: { fontSize: '18px', fontWeight: 'bold' }
      },
      subtitle: {
        text: subTitle,
        align: 'left'
      },
      xAxis: {
        categories,
        title: { text: selectedArgumentField },
        accessibility: {
          rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
        }
      },
      yAxis: {
        title: { text: 'Values' }
      },
      legend: {
        enabled: selectedSeriesFields.length > 1,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      },
      plotOptions: {
        line: {
          dataLabels: { enabled: dataLabel },
          enableMouseTracking,
          marker: {
            enabled: true,
            symbol: markerSymbol || 'circle'
          }
        },
        series: {
          label: { connectorAllowed: true }
        }
      },
      series,
      tooltip: {
        shared: true,
        crosshairs: true
      },
      responsive: [{
        condition: { maxWidth: 500 },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    };
  }

  // Inverted Spline Chart
  getInvertedSplineChartOptionsFromJson(
    data: any[],
    xField: string,
    yField: string,
    seriesName: string,
    xTitle: string,
    yTitle: string,
    chartTitle: string,
    chartSubtitle: string,
    tooltipUnit: string = '',
    tooltipXAxisLabel: string = '',
    dataLabel: boolean = false,
    markerSymbol: string = 'circle',
    zooming: string = ''
  ): any {
    const dataPoints: [number, number][] = data
      .map(d => [Number(d[xField]), Number(d[yField])] as [number, number])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));

    return {
      chart: {
        type: 'spline',
        inverted: true,
        backgroundColor: 'transparent',
        zooming: zooming ? { type: zooming } : undefined
      },
      title: { text: chartTitle },
      subtitle: { text: chartSubtitle },
      xAxis: {
        reversed: false,
        title: { enabled: true, text: xTitle },
        labels: { format: `{value} ${tooltipXAxisLabel}` },
        maxPadding: 0.05,
        showLastLabel: true
      },
      yAxis: {
        title: { text: yTitle },
        labels: { format: `{value}${tooltipUnit}` },
        lineWidth: 2
      },
      legend: { enabled: false },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: `{point.x} ${tooltipXAxisLabel}: {point.y}${tooltipUnit}`
      },
      plotOptions: {
        spline: {
          dataLabels: { enabled: dataLabel },
          marker: {
            enabled: true,
            symbol: markerSymbol || 'circle'
          }
        }
      },
      series: [{
        name: seriesName,
        data: dataPoints
      }]
    };
  }

  // Area Chart Configuration
  getAreaChartOptions(
    rawData: any[],
    title: string = '',
    subTitle: string = '',
    selectedArgumentField: string,
    selectedSeriesFields: string[],
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
    markerSymbol: string = 'circle',
    zooming: string = '',
    stackingType: string = ''
  ): any {
    const categories = rawData.map(r => r[selectedArgumentField]);
    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(r => r[field] ?? null)
    }));

    return {
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        zooming: zooming ? { type: zooming } : undefined
      },
      title: {
        text: title,
        align: 'left'
      },
      subtitle: {
        text: subTitle,
        align: 'left'
      },
      xAxis: {
        categories,
        title: { text: selectedArgumentField }
      },
      yAxis: {
        title: { text: 'Values' },
        labels: { format: '{value}' }
      },
      tooltip: {
        shared: true,
        pointFormat: '{series.name}: <b>{point.y:,.0f}</b><br/>'
      },
      legend: {
        enabled: selectedSeriesFields.length > 1
      },
      plotOptions: {
        area: {
          stacking: stackingType || undefined,
          dataLabels: { enabled: dataLabel },
          enableMouseTracking,
          marker: {
            enabled: true,
            symbol: markerSymbol || 'circle',
            radius: 2
          }
        }
      },
      series
    };
  }

  // Area Range Chart
  getAreaRangeChartOptions(
    rawData: any[],
    argumentField: string,
    minValueField: string,
    maxValueField: string,
    chartTitle: string = '',
    chartSubtitle: string = '',
    tooltipUnit: string = '°C',
    isTransparent: boolean = true,
    xAxisType: string = 'category'
  ): any {
    const categories = this.getCategoriesFromRaw(rawData, argumentField, xAxisType);
    const seriesData = rawData.map(row => [
      row[minValueField],
      row[maxValueField]
    ]);

    return {
      chart: {
        type: 'arearange',
        backgroundColor: isTransparent ? 'transparent' : undefined,
        zooming: { type: 'x' }
      },
      title: {
        text: chartTitle || 'Range Chart',
        align: 'left'
      },
      subtitle: {
        text: chartSubtitle,
        align: 'left'
      },
      xAxis: {
        type: xAxisType,
        categories,
        title: { text: argumentField }
      },
      yAxis: {
        title: { text: `${minValueField} - ${maxValueField}` }
      },
      tooltip: {
        shared: true,
        valueSuffix: tooltipUnit,
        crosshairs: true
      },
      legend: { enabled: false },
      series: [{
        name: 'Range',
        data: seriesData,
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#ff6666'],
            [1, '#6666ff']
          ]
        }
      }]
    };
  }

  // Bar/Column Chart Configuration
  getBarChartOptions(
    chartType: string = 'column',
    rawData: any[],
    selectedValueField: string,
    selectedArgumentField: string,
    selectedSeriesFields: string[],
    dataLabel: boolean = true,
    tooltipUnit: string = '',
    chartTitle: string = '',
    chartSubtitle: string = '',
    isTransparent: boolean = true,
    markerSymbol: string = 'circle',
    zooming: string = '',
    stackingType: string = ''
  ): any {
    const categories = rawData.map(item => item[selectedValueField]);
    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(item => item[field] ?? null)
    }));

    return {
      chart: {
        type: chartType,
        backgroundColor: isTransparent ? 'transparent' : undefined,
        zooming: zooming ? { type: zooming } : undefined
      },
      title: { text: chartTitle || 'Bar Chart' },
      subtitle: { text: chartSubtitle },
      xAxis: {
        categories,
        title: { text: selectedValueField },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        title: { text: selectedArgumentField },
        labels: { overflow: 'justify' },
        gridLineWidth: 0
      },
      tooltip: { valueSuffix: tooltipUnit },
      plotOptions: {
        [chartType]: {
          borderRadius: 4,
          dataLabels: { enabled: dataLabel },
          stacking: stackingType || undefined,
          groupPadding: 0.1
        }
      },
      legend: {
        enabled: selectedSeriesFields.length > 1
      },
      series
    };
  }

  // Column Range Chart
  getColumnRangeChartOptions(
    rawData: any[],
    lowField: string,
    highField: string,
    categoryField: string = '',
    dataLabel: boolean = true,
    tooltipUnit: string = '',
    chartTitle: string = '',
    chartSubtitle: string = '',
    isTransparent: boolean = true,
    zooming: string = '',
    chartType: string = 'columnrange'
  ): any {
    const categories = rawData.map(d => d[categoryField] ?? '');
    const data: [number, number][] = rawData
      .map(d => [Number(d[lowField]), Number(d[highField])] as [number, number])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));

    return {
      chart: {
        type: chartType,
        inverted: true,
        backgroundColor: isTransparent ? 'transparent' : undefined
      },
      title: { text: chartTitle },
      subtitle: { text: chartSubtitle },
      xAxis: {
        categories,
        title: { text: categoryField || undefined }
      },
      yAxis: {
        title: { text: `${lowField} - ${highField}` }
      },
      tooltip: { valueSuffix: tooltipUnit },
      plotOptions: {
        columnrange: {
          borderRadius: 4,
          dataLabels: {
            enabled: dataLabel,
            format: `{y}${tooltipUnit}`
          }
        }
      },
      legend: { enabled: false },
      series: [{
        name: 'Range',
        data: data
      }]
    };
  }

  // Variable Width Chart
  getVariwideChartOptions(
    rawData: any[],
    selectedArgumentField: string,
    selectedValueField: string,
    selectedThirdArgument: string,
    chartTitle: string = '',
    chartSubtitle: string = '',
    tooltipUnit: string = ''
  ): any {
    const data: (string | number)[][] = rawData.map(item => [
      item[selectedValueField],
      item[selectedArgumentField],
      item[selectedThirdArgument]
    ]);

    return {
      chart: { type: 'variwide' },
      title: { text: chartTitle || 'Variable Width Chart' },
      subtitle: { text: chartSubtitle },
      xAxis: { type: 'category' },
      legend: { enabled: false },
      series: [{
        type: 'variwide',
        name: selectedValueField,
        data,
        colorByPoint: true,
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          format: `{point.y:.0f}${tooltipUnit}`
        },
        tooltip: {
          pointFormat: `${selectedValueField}: <b>{point.y}${tooltipUnit}</b><br>` +
                      `${selectedThirdArgument}: <b>{point.z}</b><br>`
        }
      }]
    };
  }

  // Pie Chart Configuration
  getPieChartOption(
    type: string = 'pie',
    title: string = '',
    subTitle: string = '',
    rawData: any[],
    selectedArgumentField: string,
    selectedValueField: string,
    innerSize: string = '',
    showLegend: boolean = false,
    startAngle: number = 0,
    endAngle: number = 360
  ): any {
    return {
      chart: {
        type: type,
        backgroundColor: 'transparent'
      },
      title: {
        text: title,
        align: 'left'
      },
      subtitle: {
        text: subTitle,
        align: 'left'
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y})'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f}%'
          },
          startAngle,
          endAngle,
          showInLegend: showLegend,
          innerSize: innerSize ? `${innerSize}%` : '0%'
        }
      },
      series: [{
        name: selectedValueField,
        colorByPoint: true,
        data: rawData.map(item => ({
          name: item[selectedArgumentField],
          y: Number(item[selectedValueField])
        }))
      }]
    };
  }

  // Bubble Chart Configuration
  bubbleChartSetup(
    type: string = 'bubble',
    title: string = '',
    subTitle: string = '',
    rawData: any[],
    selectedArgumentField: string,
    selectedValueField: string,
    selectedThirdArgument: string,
    passedInSideDisplayName: string
  ): any {
    const bubbleData = rawData.map(item => ({
      x: item[selectedArgumentField],
      y: item[selectedValueField],
      z: item[selectedThirdArgument],
      name: item[passedInSideDisplayName]
    }));

    return {
      chart: {
        type: type,
        plotBorderWidth: 1,
        zooming: { type: 'xy' }
      },
      title: { text: title, align: 'left' },
      subtitle: { text: subTitle, align: 'left' },
      xAxis: {
        title: { text: selectedArgumentField },
        labels: { format: '{value}' }
      },
      yAxis: {
        title: { text: selectedValueField },
        labels: { format: '{value}' }
      },
      tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: `
          <tr><th colspan="2"><h3>{point.name}</h3></th></tr>
          <tr><th><b>${selectedValueField}:</b></th><td>{point.y}</td></tr>
          <tr><th><b>${selectedArgumentField}:</b></th><td>{point.x}</td></tr>
          <tr><th><b>${selectedThirdArgument}:</b></th><td>{point.z}</td></tr>
        `,
        footerFormat: '</table>',
        followPointer: true
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }
      },
      series: [{
        data: bubbleData,
        colorByPoint: true
      }]
    };
  }

  // Multi-Dimensional Chart
  multiDimensionalChart(
    chartTitle: string,
    subTitle: string,
    rawData: any[],
    selectedArgumentField: string,
    yAxes: YAxis[]
  ): any {
    const categories = rawData.map(item => item[selectedArgumentField]);
    
    const series = yAxes.map((axis, index) => ({
      name: axis.title,
      type: axis.chartType,
      yAxis: index,
      tooltip: { valueSuffix: ` ${axis.unit}` },
      color: axis.color,
      data: rawData.map(r => r[axis.field] ?? null)
    }));

    const yAxisData = yAxes.map((axis, index) => ({
      title: {
        text: axis.title,
        style: { color: axis.color }
      },
      labels: {
        format: `{value}${axis.unit}`,
        style: { color: axis.color }
      },
      opposite: axis.opposite
    }));

    return {
      chart: {
        zooming: { type: 'xy' }
      },
      title: { text: chartTitle },
      subtitle: { text: subTitle },
      xAxis: [{
        categories,
        crosshair: true
      }],
      yAxis: yAxisData,
      tooltip: { shared: true },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor: 'rgba(255,255,255,0.25)'
      },
      series
    };
  }

  // Scatter Chart Configuration
  getScatterChartOptions(
    rawData: any[],
    title: string = '',
    subTitle: string = '',
    selectedArgumentField: string,
    selectedSeriesFields: string[]
  ): any {
    const categories = rawData.map(r => r[selectedArgumentField]);
    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(r => r[field] ?? null)
    }));

    return {
      chart: {
        type: 'scatter',
        backgroundColor: 'transparent',
        zooming: { type: 'xy' }
      },
      title: {
        text: title,
        align: 'left'
      },
      subtitle: {
        text: subTitle,
        align: 'left'
      },
      xAxis: {
        categories,
        labels: { format: '{value}' },
        title: { text: selectedArgumentField }
      },
      yAxis: {
        labels: { format: '{value}' },
        title: { text: 'Values' }
      },
      legend: {
        enabled: selectedSeriesFields.length > 1
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 2.5,
            symbol: 'circle',
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          jitter: { x: 0.005 }
        }
      },
      series
    };
  }

  // Map Chart Rendering
  renderMapChart(
    selectedMapOption: MapOption,
    filteredData: any[],
    selectedValueField: string,
    selectedMatchValue: string,
    selectedArgumentField: string
  ): Promise<any> {
    return fetch(selectedMapOption.json_file)
      .then(res => res.json())
      .then(topology => {
        const mapData = filteredData.map(row => ({
          code: (row[selectedMatchValue] || '').toUpperCase(),
          value: row[selectedValueField]
        }));

        return {
          chart: {
            map: topology,
            backgroundColor: 'transparent'
          },
          title: {
            text: `Map of ${selectedValueField} by ${selectedArgumentField}`
          },
          mapNavigation: { enabled: true },
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
            data: mapData,
            joinBy: [selectedMapOption.uniqueValueMatch, 'code'],
            name: selectedValueField,
            dataLabels: {
              enabled: true,
              formatter: function (this: any) {
                return this.point.value ? this.point.value : '';
              }
            },
            tooltip: {
              pointFormat: '{point.code}: {point.value}'
            }
          }]
        };
      });
  }

  // Utility method for category processing
  private getCategoriesFromRaw(rawData: any[], argumentField: string, xAxisType: string): any[] {
    switch (xAxisType) {
      case 'datetime':
        return rawData.map(r => new Date(r[argumentField]).getTime());
      case 'numeric':
      case 'linear':
      case 'logarithmic':
        return rawData.map(r => parseFloat(r[argumentField]));
      default:
        return rawData.map(r => r[argumentField]);
    }
  }
  
}
