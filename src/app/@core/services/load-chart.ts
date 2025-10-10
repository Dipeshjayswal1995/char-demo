import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { LOCAL_STORAGE_KEYS } from '../utils/local-storage-key.utility';
import { ChartEventService } from './chart-event-service';

declare var Highcharts: any;

@Injectable({
  providedIn: 'root'
})
export class LoadChart {
  projectData: any = null;
  constructor(private readonly storage: StorageService, private readonly chartEventService: ChartEventService) {
    this.projectData = this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION) ? JSON.parse(this.storage.getPersistentItem(LOCAL_STORAGE_KEYS.PROJECTCONFIGURATION)) : null;
  }

  getChartOptions(
    selectedChartCate: any,
    selectedChartType: any,
    rawData: any[],
    title: string,
    subTitle: string,
    titleAlign: string,
    subTitleAlign: string,
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
    selectedSeriesFields?: { field: string; color: string }[],
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
              format: '<b>{point.name}</b>: {point.percentage:.1f}%',
              style: {
                color: this.projectData?.textColor || '#000000', // label text color
                textOutline: 'none', // optional: removes white stroke around text
                fontSize: '12px'
              }
            },
            startAngle,
            endAngle,
            showInLegend: showLegend,
            data
          }];
          tooltip = {
            pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y})',
            style: {
              color: this.projectData?.textColor || '#000000', // tooltip text color
              fontSize: '13px'
            },
            backgroundColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff', // optional
            borderColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff'
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
            dataLabels: {
              enabled: dataLabel,
              style: {
                color: this.projectData?.textColor || '#000000', // label text color
                fontSize: '12px'
              }
            },
            enableMouseTracking,
            data: seriesData,
          }];
          xAxisConfig = {
            categories,
            title: {
              // text: xAxis,
              style: {
                color: this.projectData?.textColor,
                fontWeight: 'bold'
              }
            },
            labels: {
              style: {
                color: this.projectData?.textColor,
                fontSize: '12px'
              }
            },
            lineColor: this.projectData.textColor,
            tickColor: this.projectData.textColor,
            accessibility: {
              rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
            }
          };
          yAxisConfig = {
            title: {
              // text: yAxis,
              style: {
                color: this.projectData?.textColor,
                fontWeight: 'bold'
              }
            },
            labels: {
              style: {
                color: this.projectData?.textColor,
                fontSize: '12px'
              }
            },
          };
          tooltip = {
            style: {
              color: this.projectData?.textColor || '#000000', // tooltip text color
              fontSize: '13px'
            },
            backgroundColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff', // optional
            borderColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff'
          }
        }

        // XY CHARTS: spline, scatter
      } else if ([6].includes(selectedChartCate.id)) {
        // console.log('x- aixi', x)
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
          dataLabels: {
            enabled: dataLabel,
            style: {
              color: this.projectData?.textColor || '#000000', // label text color
              fontSize: '12px'
            }
          },
          enableMouseTracking,
          color: field?.color,
          data: categories.map(c => grouped[c][field.field] ?? 0),
        }));
        xAxisConfig = {
          categories,
          title: {
            // text: xAxis,
            style: {
              color: this.projectData?.textColor,
              fontWeight: 'bold'
            }
          },
          labels: {
            style: {
              color: this.projectData?.textColor,
              fontSize: '12px'
            }
          },
          lineColor: this.projectData?.textColor,
          tickColor: this.projectData?.textColor,
          accessibility: {
            rangeDescription: `Range: ${categories[0]} to ${categories[categories.length - 1]}`
          }
        };
        yAxisConfig = {
          title: {
            // text: yAxis,
            style: {
              color: this.projectData?.textColor,
              fontWeight: 'bold'
            }
          },
          labels: {
            style: {
              color: this.projectData?.textColor,
              fontSize: '12px'
            }
          },
        };
        tooltip = {
          style: {
            color: this.projectData?.textColor || '#000000', // tooltip text color
            fontSize: '13px'
          },
          backgroundColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff', // optional
          borderColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff'
        }

      } else if ([2].includes(selectedChartCate.id)) {
        const field = Array.isArray(yAxis) ? yAxis[0] : yAxis;
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
            style: {
              color: this.projectData?.textColor || '#000000', // tooltip text color

            },
            format: `{point.y}`
          },
          enableMouseTracking,
          label: { enabled: true },
          data: dataPoints
        }];

        xAxisConfig = {
          reversed: false,
          title: {
            text: xAxis,
            style: {
              color: this.projectData?.textColor,
              fontWeight: 'bold'
            }
          },
          labels: {
            style: {
              color: this.projectData?.textColor,
              fontSize: '12px'
            }
          },
          lineColor: this.projectData?.textColor,
          tickColor: this.projectData?.textColor,
        };
        yAxisConfig = {
          title: {
            text: field,
            style: {
              color: this.projectData?.textColor,
              fontWeight: 'bold'
            }
          },
          labels: {
            style: {
              color: this.projectData?.textColor,
              fontSize: '12px'
            }
          },
          lineWidth: 2
        };
        tooltip = {
          headerFormat: `<b>${xAxis} : ${Array.isArray(yAxis) ? yAxis.join(', ') : yAxis}</b><br/>`,
          pointFormat: '{point.x} : {point.y}',
          style: {
            color: this.projectData?.textColor || '#000000', // tooltip text color
            fontSize: '13px'
          },
          backgroundColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff', // optional
          borderColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff'
        };

      } else if ([3].includes(selectedChartCate.id)) {

        if (!thirdArgument || !yAxis || !xAxis) {
          console.warn("⚠️ X, Y or Third argument missing for  chart");
          return this.getNoDataChart("⚠️ X, Y or Third argument missing for  chart");
        }
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
            format: `{point.y:.0f}`,
            style: {
              color: this.projectData?.textColor || '#000000', // tooltip text color

            },
          }
        }];
        tooltip = {
          pointFormat: `${yAxis}: <b>{point.y}</b><br>` +
            `${thirdArgument}: <b>{point.z}</b><br>`,
          style: {
            color: this.projectData?.textColor || '#000000', // tooltip text color
            fontSize: '13px'
          },
          backgroundColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff', // optional
          borderColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff'
        }

        xAxisConfig = {
          type: 'category',
          title: {

            // text: xAxis,
            style: {
              color: this.projectData?.textColor,
              fontWeight: 'bold'
            }
          },
          labels: {
            style: {
              color: this.projectData?.textColor,
              fontSize: '12px'
            }
          },
          lineColor: this.projectData?.textColor,
          tickColor: this.projectData?.textColor,
        };
        yAxisConfig = {
          title: {
            // text: field,
            style: {
              color: this.projectData?.textColor,
              fontWeight: 'bold'
            }
          },
          labels: {
            style: {
              color: this.projectData?.textColor,
              fontSize: '12px'
            }
          },
          // lineWidth: 2
        };
      }
    } catch (err) {
      console.error("❌ Error building chart options:", err);
      return this.getNoDataChart("Chart configuration error");
    }

    // ✅ Final Safe Return
    return {
      chart: {
        backgroundColor: this.projectData?.chartBackgroundColor ? this.projectData?.chartBackgroundColor : 'transparent',
        zooming: { type: zooming }
      },
      title: { text: title || '', align: titleAlign, style: { color: this.projectData?.textColor } },
      subtitle: { text: subTitle || '', align: subTitleAlign, style: { color: this.projectData?.textColor } },
      xAxis: xAxisConfig,
      yAxis: yAxisConfig,
      tooltip,
      legend: {
        enabled: showLegend,
        title: {
          style: {
            color: this.projectData?.textColor,
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          color: this.projectData?.textColor, // ✅ Legend text color
          fontWeight: 'normal',              // Optional: make normal or bold
          fontSize: '12px'                   // Optional: set font size
        },
        itemHoverStyle: {
          color: this.projectData?.textColor // ✅ Color when hovering legend items
        }
      },
      series: series.length > 0 ? series : [],
      credits: {
        enabled: false,
      },
      exporting: {
        buttons: {
          contextButton: {
            align: 'left',
            verticalAlign: 'bottom',
            // menuClassName: 'highcharts-scrollable-menu', // 👈 custom class
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'separator',
              'downloadCSV',
              'downloadXLS'
            ]
          },
        }
      },
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
      chart: { backgroundColor: this.projectData?.chartBackgroundColor ? this.projectData?.chartBackgroundColor : 'transparent', },
      title: { text: '', align: 'left' },
      series: [],
      lang: { noData: message },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '14px',
          color: this.projectData?.textColor ? this.projectData?.textColor : '#666'
        }
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
        buttons: {
          contextButton: {
            align: 'left',
            verticalAlign: 'bottom',
          }
        }
      },
    };
  }


  multiDiminonalChart(
    chatTitle: string,
    subTitle: string,
    titleAlign: string,
    subTitleAlign: string,
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
        backgroundColor: this.projectData?.chartBackgroundColor ? this.projectData?.chartBackgroundColor : 'transparent',
        zooming: {
          type: zooming
        }
      },
      title: { text: chatTitle || '', align: titleAlign, style: { color: this.projectData?.textColor } },
      subtitle: { text: subTitle || '', align: subTitleAlign, style: { color: this.projectData?.textColor } },
      xAxis: [{
        categories: categories,
        title: {
          style: {
            color: this.projectData?.textColor,
            fontWeight: 'bold'
          }
        },
        labels: {
          style: {
            color: this.projectData?.textColor,
            fontSize: '12px'
          }
        },
        crosshair: true
      }],
      yAxis: yAxisData,
      tooltip: {
        shared: true,
        style: {
          color: this.projectData?.textColor || '#000000', // tooltip text color
          fontSize: '13px'
        },
        backgroundColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff', // optional
        borderColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff'
      },
      legend: {
        enabled: showLegend,
        title: {
          style: {
            color: this.projectData?.textColor,
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          color: this.projectData?.textColor, // ✅ Legend text color
          fontWeight: 'normal',              // Optional: make normal or bold
          fontSize: '12px'                   // Optional: set font size
        },
        itemHoverStyle: {
          color: this.projectData?.textColor // ✅ Color when hovering legend items
        }
      },
      series: series,
      credits: {
        enabled: false,
      },
      exporting: {
        buttons: {
          contextButton: {
            align: 'left',
            verticalAlign: 'bottom',
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'separator',
              'downloadCSV',
              'downloadXLS'
            ]
          },
        }
      },
    }
  }

  async renderMapChart123(
    selectedChartCate: any,
    selectedMapOption: any,
    selectedMatchValue: any,
    rawData: any[],
    title: string,
    subTitle: string,
    titleAlign: string,
    subTitleAlign: string,
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
    console.log("mapData===>", mapData);
    console.log(selectedMapOption?.uniqueValueMatch)
    console.log(mapData);
    console.log(topology);
    return {
      chart: {
        map: topology,
        backgroundColor: this.projectData?.chartBackgroundColor ? this.projectData?.chartBackgroundColor : 'transparent',
      },
      title: { text: title || '', align: titleAlign, style: { color: this.projectData?.textColor } },
      subtitle: { text: subTitle || '', align: subTitleAlign, style: { color: this.projectData?.textColor } },
      mapNavigation: {
        enabled: true
      },
      // colorAxis: {
      //   min: 1,
      //   type: 'logarithmic',
      //   minColor: '#EEEEFF',
      //   maxColor: '#000022',
      //   stops: [
      //     [0, '#EFEFFF'],
      //     [0.67, '#4444FF'],
      //     [1, '#000022']
      //   ]
      // },
      series: [{
        data: rawData,
        colorByPoint: true,
        joinBy: [selectedMapOption?.uniqueValueMatch, selectedMatchValue],
        name: xAxis,
        dataLabels: {
          enabled: true,
          title: {
            style: {
              color: this.projectData?.textColor,
              fontWeight: 'bold'
            }
          },
          labels: {
            style: {
              color: this.projectData?.textColor,
              fontSize: '12px'
            }
          },
          formatter: function (this: any) {
            return `${this.point[xAxis] ? this.point[xAxis] : ''}`;
          },

        },
        tooltip: {
          formatter: function (this: any) {
            console.log(this.point);
            return `${this.point[selectedMatchValue]}: ${this.point[xAxis]}`;
          },

        }
      }],
      credits: {
        enabled: false,
      },
      exporting: {
        buttons: {
          contextButton: {
            align: 'left',
            verticalAlign: 'bottom',
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'separator',
              'downloadCSV',
              'downloadXLS'
            ]
          },
        }
      },
    }
  }

  async renderMapChart(
    selectedChartCate: any,
    selectedMapOption: any,
    selectedMatchValue: any, // e.g., 'code' or 'postal-code'
    rawData: any[],
    title: string,
    subTitle: string,
    titleAlign: string,
    subTitleAlign: string,
    xAxis: string, // e.g., 'RevenueQTD'
    showLegend: boolean = false,
    dataLabel: boolean = true,
    enableMouseTracking: boolean = true,
  ) {
    const mapUrl: any = selectedMapOption?.json_file;
    const topology = await fetch(mapUrl).then(response => response.json());

    // ✅ Create simplified map data
    const mapData = rawData.map((row, index) => ({
      [selectedMatchValue]: (row[selectedMatchValue] || '').toUpperCase(),
      value: row[xAxis],
      color: Highcharts.getOptions().colors[index % Highcharts.getOptions().colors.length], // distinct colors
    }));
    console.log("mapData =>", mapData);
    return {
      chart: {
        map: topology,
        backgroundColor: this.projectData?.chartBackgroundColor || 'transparent',
      },

      title: {
        text: title || '',
        align: titleAlign,
        style: { color: this.projectData?.textColor },
      },
      subtitle: {
        text: subTitle || '',
        align: subTitleAlign,
        style: { color: this.projectData?.textColor },
      },

      mapNavigation: { enabled: true },
      colorAxis: {
        showInLegend: false,
        min: 1,
        type: 'logarithmic',
        minColor: '#EEEEFF',
        maxColor: '#000022',
        stops: [
          [0, '#EFEFFF'],
          [0.67, '#4444FF'],
          [1, '#000022']
        ],
      },

      // ✅ Tooltip should be at chart level
      tooltip: {
        enabled: true,
        useHTML: true,
        backgroundColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff', // optional
        borderColor: this.projectData?.sidebarColor ? this.projectData?.sidebarColor : '#ffffff',
        style: { color: this.projectData?.textColor ? this.projectData?.textColor : '#fff' },
      },
      series: [
        {
          data: mapData,
          joinBy: [selectedMapOption?.uniqueValueMatch, selectedMatchValue],
          name: xAxis,
          enableMouseTracking: true,
          showInLegend: false,

          // ✅ Enable and style data labels
          dataLabels: {
            enabled: true,
            formatter: function (this: any) {
              return this.point.value ? this.point.value : '';
            },
            style: {
              color: this.projectData?.textColor || '#fff',
              fontSize: '10px',
              fontWeight: 'bold',
            },
          },
        },
      ],

      credits: { enabled: false },
      exporting: {
        buttons: {
          contextButton: {
            align: 'left',
            verticalAlign: 'bottom',
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'separator',
              'downloadCSV',
              'downloadXLS',
            ],
          },
        },
      },
    };
  }




}
