import { Injectable } from '@angular/core';
declare const Highcharts: any;

@Injectable({
  providedIn: 'root'
})
export class LoadChart {

  markerSymbols = ['circle', 'square', 'diamond', 'triangle', 'triangle-down'];
  constructor() { }

  getLineChartOptions123(
    rawData: any[],
    title: string = '',
    subTitle: string = '',
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
    console.log('makerSym', selectedSeriesFields);
    return {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        zooming: {
          type: zomming
        }
      },
      title: {
        text: title,
        align: 'left'
      },
      subtitle: {
        text: subTitle,
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
            connectorAllowed: false
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

  getLineChartOptions(
    selectedChartCate: any,
    selectedChartType: any,
    rawData: any[],
    title: string,
    subTitle: string,
    xAxis: string,
    selectedSeriesFields: string[] | string,
    zooming: string,
    showLegend: boolean = false,
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
  ): any {
    const categories = rawData.map(r => r[xAxis]);

    const fieldsArray = Array.isArray(selectedSeriesFields)
      ? selectedSeriesFields
      : [selectedSeriesFields];

    const series = fieldsArray.map(field => ({
      name: field,
      data: rawData.map(r => r[field] ?? null),
    }));

    return {
      chart: {
        type: selectedChartType.type,
        backgroundColor: 'transparent',
        zooming: {
          type: zooming
        }
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
        accessibility: {
          rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
        }
      },
      legend: {
        enabled: showLegend, // show legend only if multiple series
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        [selectedChartType.type]: {
          dataLabels: {
            enabled: dataLabel
          },
          enableMouseTracking: enableMouseTracking
        },
        series: {
          label: {
            connectorAllowed: false
          }
        }
      },
      series
    };
  }

  getInvertedSplineChartOptionsFromJson(
    selectedChartCate: any,
    selectedChartType: any,
    rawData: any[],
    title: string,
    subTitle: string,
    xAxis: string,
    selectedSeriesFields: string,
    zooming: string,
    showLegend: boolean = false,
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
  ): any {
    const dataPoints: [number, number][] = rawData
      .map(d => [Number(d[xAxis]), Number(d[selectedSeriesFields])] as [number, number])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));
    console.log(dataPoints);

    return {
      chart: {
        type: selectedChartType.type,
        inverted: true,
        backgroundColor: 'transparent',
        zooming: {
          type: zooming
        }
      },
      title: {
        text: title
      },
      subtitle: {
        text: subTitle
      },
      xAxis: {
        title: {
          enabled: true,
          text: xAxis
        },
        // labels: {
        //   format: `{value} ${tooltipXAxisLabel}`
        // },
        maxPadding: 0.05,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: selectedSeriesFields
        },
        // labels: {
        //   format: `{value}${tooltipUnit}`
        // },
        accessibility: {
          rangeDescription: `Auto Range`
        },
        lineWidth: 2
      },
      legend: {
        enabled: false
      },
      // tooltip: {
      //   headerFormat: '<b>{series.name}</b><br/>',
      //   pointFormat: `{point.x} ${tooltipXAxisLabel}: {point.y}${tooltipUnit}`
      // },
      plotOptions: {
        spline: {
          dataLabels: {
            enabled: dataLabel
          },
          // marker: {
          //   enabled: true,
          //   symbol: markerSymbol
          // }
        }
      },
      series: [{
        name: selectedSeriesFields,
        data: dataPoints
      }]
    };
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
    let inverted = false;
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

      inverted = selectedChartType.type === "spline";
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
        inverted,
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
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor ||
          'rgba(201, 123, 123, 0.25)'
      },
      series: series
    }
  }


  getVariwideChartOptions123(
    rawData: any[],
    selectedArgumentField: string,
    selectedValueField: string,
    selectedThirdArgument: string,
    chartTitle: string = '',
    chartSubtitle: string = '',
    tooltipUnit: string = '€/h'
  ): any {
    const data: (string | number)[][] = rawData.map(item => [
      item[selectedValueField],   // e.g., 'Norway'
      item[selectedArgumentField],      // e.g., 51.9
      item[selectedThirdArgument]      // e.g., 448716
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
        text: 'Column widths are proportional to ' + selectedThirdArgument
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
            `${selectedThirdArgument}: <b>{{point.z}}</b><br>`
        }
      }]
    };
  }


  getInvertedSplineChartOptionsFromJson123(
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
    title: string = '',
    subTitle: string = '',
    selectedArgumentField: string,
    selectedSeriesFields: string[],
    dataLabel: boolean = false,
    enableMouseTracking: boolean = true,
    markerSymbol: string = 'circle',
    zooming: string = '',
    typeofareaChart: string = ''
  ): any {
    const categories = rawData.map(r => r[selectedArgumentField]);

    const series = selectedSeriesFields.map(field => ({
      name: field,
      data: rawData.map(r => r[field] ?? null)
    }));

    return {
      chart: {
        type: 'area', // streamgraph, areaspline
        // inverted: true, // streamgraph 
        backgroundColor: 'transparent',
        zooming: {
          type: zooming
        }
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
        allowDecimals: false,
        accessibility: {
          rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
        }
      },
      yAxis: {
        // title: {
        //   text: selectedValueField
        // },
        labels: {
          format: `{value}`
        }
      },
      areaspline: {
        stacking: 'percent',
        lineColor: '#666666',
        pointInterval: 100,
        lineWidth: 1,
        marker: {
          enabled: false,
          symbol: 'circle',
          fillColor: '#666666',
          lineColor: '#666666',
          radius: 1,
          states: {
            hover: {
              enabled: false
            }
          }
        },
        label: {
          style: {
            fontSize: '16px'
          }
        },
        states: {
          hover: {
            halo: {
              size: 0
            }
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name} had <b>{point.y:,.0f}</b>' +
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

  getAreaRangeChartOptions(
    rawData: any[],
    argumentField: string,        // typically a date/time field
    minValueField: string,        // e.g. "minTemp"
    maxValueField: string,        // e.g. "maxTemp"
    chartTitle: string = '',
    chartSubtitle: string = '',
    tooltipUnit: string = '°C',
    isTransparent: boolean = true,
    xAxisType: string = ''
  ): any {
    // const caregory = rawData.map(row => [
    //   new Date(row[argumentField]).getTime(), // x-axis datetime
    // ]);
    // const categories = rawData.map(r => r[argumentField]);
    // let categories: any[] = [];
    const categories = this.getCategoriesFromRaw(rawData, argumentField, xAxisType)
    // if (xAxisType === 'datetime') {
    //   categories = rawData.map(r => new Date(r[argumentField]).getTime());
    // } else if (xAxisType === 'numeric' || xAxisType === 'linear' || xAxisType === 'logarithmic') {
    //   categories = rawData.map(r => parseFloat(r[argumentField]));
    // } else {
    //   categories = rawData.map(r => r[argumentField]); // category (default)
    // }
    console.log('argumentField', argumentField);
    const seriesData = rawData.map(row => [
      row[minValueField],
      row[maxValueField]
    ]);
    console.log(seriesData);
    return {
      chart: {
        type: 'arearange',
        // inverted: true,
        zooming: {
          type: 'x'
        },
        backgroundColor: isTransparent ? 'transparent' : undefined,
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
        }
      },
      title: {
        text: chartTitle || 'Temperature variation by day',
        align: 'left'
      },
      subtitle: {
        text: chartSubtitle || '',
        align: 'left'
      },
      xAxis: {
        type: xAxisType,
        categories,
        accessibility: {
          rangeDescription: 'Range based on selected date field'
        }
      },
      labels: {
        format: '{value:%b %Y}' // This will show "Jan 2023", "Feb 2023", etc.
      },
      dateTimeLabelFormats: {
        month: '%b %Y',
        year: '%Y'
      },
      yAxis: {
        title: {
          text: null
        }
      },
      tooltip: {
        shared: true,
        valueSuffix: tooltipUnit,
        crosshairs: true,
        xDateFormat: '%A, %b %e'
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Temperatures',
        data: seriesData,
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, '#ff6666'],
            [1, '#6666ff']
          ]
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
    const categories = rawData.map(item => item[selectedValueField]);

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
        // min: 0,
        title: {
          text: selectedArgumentField,
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
            enabled: dataLabel,
            rotation: -90,
            color: '#FFFFFF',
            inside: true,
            verticalAlign: 'top',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
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

  getPieChartOption(
    type: string = '',
    title: string = '',
    subTitle: string = '',
    rawData: any[],
    selectedArgumentField: string,
    selectedValueField: string,
    innerSize: string = '',
    showLengend: boolean = false,
    startAngle: number = 0,
    endAngle: number = 0
  ) {
    console.log(startAngle);
    console.log(endAngle);
    const self = this;
    return {
      chart: {
        type: type,
        backgroundColor: 'transparent',
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
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      series: [{
        innerSize: innerSize === '' ? 0 : innerSize + '%',
        name: selectedValueField,
        colorByPoint: true,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        },
        startAngle: startAngle,
        endAngle: endAngle,
        showInLegend: showLengend,
        data: rawData.map(item => ({
          name: item[selectedArgumentField],
          y: Number(item[selectedValueField])
        }))
      }]
    };
  }

  pieChartSliceAnimation(chart: any) {
    const series = chart.series[0];
    series.points.forEach((point: any, index: any) => {
      if (point.graphic) {
        point.graphic.attr({
          opacity: 0,
          scaleX: 0.5,
          scaleY: 0.5
        });
        setTimeout(() => {
          if (point.graphic) {
            point.graphic.animate(
              {
                opacity: 1,
                scaleX: 1,
                scaleY: 1
              },
              {
                duration: 600,
                easing: 'easeOutBounce'
              }
            );
          }
        }, index * 150);
      }
    });
  }

  bubbleChartSetup(
    type: string = '',
    title: string = '',
    subTitle: string = '',
    rawData: any[],
    selectedArgumentField: string,
    selectedValueField: string,
    selectedThirdArgument: string,
    passedInSideDisplayName: string,
  ) {

    const categories = rawData.map(item => item[selectedArgumentField]);
    // Prepare Highcharts data format: { x: index, y, z, name }
    const bubbleData = rawData.map((item, index) => ({
      x: item[selectedArgumentField], // numeric position
      y: item[selectedValueField],
      z: item[selectedThirdArgument],
      name: item[passedInSideDisplayName] // use category label for tooltip/label
    }));
    console.log(bubbleData);
    return {
      chart: {
        type: type,
        plotBorderWidth: 1,
        zooming: { type: 'xy' }
      },
      title: { text: title, align: 'left' },
      subtitle: {
        text: subTitle,
        align: 'left'
      },

      xAxis: {
        title: { text: selectedArgumentField },
        // tickInterval: 1,
        labels: {
          format: '{value}'
          // formatter: function (this: any) {
          //   return categories;
          // }
        }
      },
      yAxis: {
        title: { text: selectedValueField },
        labels: {
          format: '{value}'
        },
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





  getCategoriesFromRaw(rawData: any[], argumentField: string, xAxisType: string): any[] {
    if (xAxisType === 'datetime') {
      return rawData.map(r => new Date(r[argumentField]).getTime());
    } else if (xAxisType === 'numeric' || xAxisType === 'linear' || xAxisType === 'logarithmic') {
      return rawData.map(r => parseFloat(r[argumentField]));
    } else {
      return rawData.map(r => r[argumentField]);
    }
  }

}
