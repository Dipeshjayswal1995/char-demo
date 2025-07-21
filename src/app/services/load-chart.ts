import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadChart {

  markerSymbols = ['circle', 'square', 'diamond', 'triangle', 'triangle-down'];
  constructor() { }

  getLineChartOptions(
    rawData: any[],
    selectedValueField: string,
    selectedArgumentField: string,
    selectedSeriesFields: string[],
    dataLabel: boolean,
    enableMouseTracking: boolean,
    markerSymbol: string = '',
    zomming: string = ''
  ): any {
    const categories = rawData.map(r => r[selectedArgumentField]);

    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(r => r[field] ?? null),

    }));
    console.log('makerSym', markerSymbol);
    return {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        zooming: {
          type: zomming
        }
      },
      title: {
        text: `Trend of ${selectedValueField}`,
        align: 'left'
      },
      subtitle: {
        text: `By ${selectedArgumentField}`,
        align: 'left'
      },
      // yAxis: {
      //   title: {
      //     text: selectedValueField
      //   }
      // },
      xAxis: {
        categories,
        accessibility: {
          rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
        }
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: dataLabel
          },
          enableMouseTracking: enableMouseTracking
        },
        series: {
          label: {
            connectorAllowed: true
          }
        }
      },
      series,
      responsive: [{
        condition: {
          maxWidth: 500
        },
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
    markerSymbol: string = '',
    zomming: string = '',
  ): any {
    const dataPoints: [number, number][] = data
      .map(d => [Number(d[xField]), Number(d[yField])] as [number, number])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));
    console.log(dataPoints);
    console.log(seriesName);
    return {
      chart: {
        type: 'spline',
        inverted: true,
        backgroundColor: 'transparent',
        zooming: {
          type: zomming
        }
      },

      title: {
        text: chartTitle
      },
      subtitle: {
        text: chartSubtitle
      },
      xAxis: {
        reversed: false,
        title: {
          enabled: true,
          text: xTitle
        },
        labels: {
          format: `{value} ${tooltipXAxisLabel}`
        },
        maxPadding: 0.05,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: yTitle
        },
        labels: {
          format: `{value}${tooltipUnit}`
        },
        accessibility: {
          rangeDescription: `Auto Range`
        },
        lineWidth: 2
      },
      legend: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: `{point.x} ${tooltipXAxisLabel}: {point.y}${tooltipUnit}`
      },
      plotOptions: {
        spline: {
          dataLabels: {
            enabled: dataLabel
          },
          marker: {
            enabled: true,
            symbol: markerSymbol
          }
        }
      },
      series: [{
        name: seriesName,
        data: dataPoints
      }]
    };
  }

  getAreaChartOptions(
    rawData: any[],
    selectedValueField: string,
    selectedArgumentField: string,
    selectedSeriesFields: string[],
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
    markerSymbol: string = 'circle',
    zooming: string = '',
    chartTitle: string = '',
    chartSubtitle: string = '',
    tooltipUnit: string = '',
    tooltipXAxisLabel: string = '',
    isTransparent: boolean = true,
    typeofareaChart: string = ''
  ): any {
    const categories = rawData.map(r => r[selectedArgumentField]);

    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(r => r[field] ?? null)
    }));

    return {
      chart: {
        type: 'area',
        backgroundColor: isTransparent ? 'transparent' : undefined,
        zooming: {
          type: zooming
        }
      },
      title: {
        text: chartTitle || `Trend of ${selectedValueField}`,
        align: 'left'
      },
      subtitle: {
        text: chartSubtitle || `By ${selectedArgumentField}`,
        align: 'left'
      },
      xAxis: {
        categories,
        allowDecimals: false,
        accessibility: {
          rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
        }
      },
      yAxis: {
        title: {
          text: selectedValueField
        },
        labels: {
          format: `{value}${tooltipUnit}`
        }
      },
      tooltip: {
        pointFormat: '{series.name} had <b>{point.y:,.0f}</b>' +
          (tooltipUnit ? ` ${tooltipUnit}` : '') +
          ' in {point.x}'
      },
      legend: {
        enabled: selectedSeriesFields.length > 1,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        area: {
          pointStart: 0,
          stacking: typeofareaChart,
          dataLabels: {
            enabled: dataLabel
          },
          enableMouseTracking: enableMouseTracking,
          marker: {
            enabled: true,
            symbol: markerSymbol,
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        },
        series: {
          label: {
            connectorAllowed: true
          }
        }
      },
      series,
      responsive: [{
        condition: {
          maxWidth: 500
        },
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

  getBarChartOptions(
    chartOption: string = 'bar',
    rawData: any[],
    selectedValueField: string,
    selectedArgumentField: string,
    selectedSeriesFields: string[],
    dataLabel: boolean = true,
    tooltipUnit: string = ' millions',
    chartTitle: string = '',
    chartSubtitle: string = '',
    isTransparent: boolean = true,
    markerSymbol: string = 'circle',
    zooming: string = '',
    typeofareaChart: string = '',
  ): any {
    const categories = rawData.map(item => item[selectedArgumentField]);

    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(item => item[field] ?? null)
    }));
    console.log("serires", series);
    console.log("categoryu", categories);
    return {
      chart: {
        type: chartOption,
        backgroundColor: isTransparent ? 'transparent' : undefined,
        zooming: {
          type: zooming
        }
      },
      title: {
        text: chartTitle || 'Historic World Population by Region'
      },
      subtitle: {
        text:
          chartSubtitle ||
          'Source: <a href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population" target="_blank">Wikipedia.org</a>'
      },
      xAxis: {
        categories,
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: selectedValueField,
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: tooltipUnit
      },
      plotOptions: {
        bar: {
          borderRadius: '50%',
          symbol: markerSymbol,
          dataLabels: {
            enabled: dataLabel
          },
          groupPadding: 0.1,
          stacking: typeofareaChart,
        },
        column: {
          borderRadius: '50%',
          symbol: markerSymbol,
          stacking: typeofareaChart,
          dataLabels: {
            enabled: dataLabel
          },
          groupPadding: 0.1
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: 'var(--highcharts-background-color, #ffffff)',
        shadow: true
      },
      credits: {
        enabled: false
      },
      series
    };
  }

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
    chartType: string = '',
  ): any {

    const categories = rawData.map(d => d[categoryField] ?? '');

    const data: [number, number][] = rawData
      .map(d => [Number(d[lowField]), Number(d[highField])] as [number, number])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));
    console.log(chartType);
    return {
      chart: {
        type: chartType,
        inverted: true,
        backgroundColor: isTransparent ? 'transparent' : undefined,
      },
      accessibility: {
        description: ''
      },
      title: {
        text: chartTitle
      },
      subtitle: {
        text: chartSubtitle
      },
      xAxis: {
        categories: categories,
        title: {
          text: categoryField || undefined
        }
      },
      yAxis: {
        title: {
          text: `${lowField} - ${highField}`
        }
      },
      tooltip: {
        valueSuffix: tooltipUnit
      },
      plotOptions: {
        columnrange: {
          borderRadius: '50%',
          dataLabels: {
            enabled: dataLabel,
            format: `{y}${tooltipUnit}`
          }
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Temperatures',
        data: data
      }]
    };
  }


  getVariwideChartOptions(
    rawData: any[],
    selectedArgumentField: string,
    selectedValueField: string,
    selectedWidthField: string,
    chartTitle: string = '',
    chartSubtitle: string = '',
    tooltipUnit: string = '€/h'
  ): any {
    const data: (string | number)[][] = rawData.map(item => [
      item[selectedArgumentField],   // e.g., 'Norway'
      item[selectedValueField],      // e.g., 51.9
      item[selectedWidthField]       // e.g., 448716
    ]);
    console.log('data', data);
    return {
      chart: {
        type: 'variwide'
      },
      title: {
        text: chartTitle || 'Variwide Chart'
      },
      subtitle: {
        text: chartSubtitle
      },
      xAxis: {
        type: 'category'
      },
      caption: {
        text: 'Column widths are proportional to ' + selectedWidthField
      },
      legend: {
        enabled: false
      },
      series: [{
        type: 'variwide',
        name: selectedValueField,
        data,
        colorByPoint: true,
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          format: `${tooltipUnit}{{point.y:.0f}}`
        },
        tooltip: {
          pointFormat: `${selectedValueField}: <b>${tooltipUnit} {{point.y}}</b><br>` +
            `${selectedWidthField}: <b>{{point.z}}</b><br>`
        }
      }]
    };
  }








}
