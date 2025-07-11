import { RouterOutlet } from '@angular/router';

import { Component, AfterViewInit } from '@angular/core';


declare var Highcharts: any;

interface MonthlyData {
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
}

interface StateInfo {
  name: string;
  income: number;
  gdp_per_capita: number;
  population: number;
  area: number;
  monthlyData: { [key: string]: MonthlyData };
}


@Component({
  selector: 'app-mapchart1',
  imports: [],
  templateUrl: './mapchart1.html',
  styleUrl: './mapchart1.scss'
})
export class Mapchart1 {

  chart7: any;
  chart8: any;
  selectedView: 'margin' | 'postal' | 'state' = 'margin';
  selectedView1: 'digit' | 'postal' | 'gdp' = 'digit';


  stateData: Record<string, StateInfo> = {
    // Keep your full stateData here as defined previously.
    // I'm omitting it for brevity in this example, but it should be present.
    // Example for CA (California) which we'll filter:
    "AL": { "name": "Alabama", "income": 60660, "gdp_per_capita": 67786, "population": 5097000, "area": 52420, "monthlyData": {} },
    "AK": { "name": "Alaska", "income": 113934, "gdp_per_capita": 95147, "population": 733000, "area": 665384, "monthlyData": {} },
    "AZ": { "name": "Arizona", "income": 77315, "gdp_per_capita": 78201, "population": 7431000, "area": 113990, "monthlyData": {} },
    "AR": { "name": "Arkansas", "income": 63250, "gdp_per_capita": 60276, "population": 3067000, "area": 53179, "monthlyData": {} },
    "CA": { "name": "California", "income": 123988, "gdp_per_capita": 104916, "population": 38966000, "area": 163695, "monthlyData": {} },
    "CO": { "name": "Colorado", "income": 97301, "gdp_per_capita": 93026, "population": 5877000, "area": 104094, "monthlyData": {} },
    "CT": { "name": "Connecticut", "income": 114156, "gdp_per_capita": 100235, "population": 3617000, "area": 5543, "monthlyData": {} },
    "DE": { "name": "Delaware", "income": 87173, "gdp_per_capita": 98055, "population": 1032000, "area": 2489, "monthlyData": {} },
    "FL": { "name": "Florida", "income": 73311, "gdp_per_capita": 78918, "population": 22611000, "area": 65758, "monthlyData": {} },
    "GA": { "name": "Georgia", "income": 74632, "gdp_per_capita": 79435, "population": 11019000, "area": 59425, "monthlyData": {} },
    "HI": { "name": "Hawaii", "income": 141832, "gdp_per_capita": 80979, "population": 1431000, "area": 10932, "monthlyData": {} },
    "ID": { "name": "Idaho", "income": 74942, "gdp_per_capita": 68000, "population": 1964000, "area": 83568, "monthlyData": {} },
    "IL": { "name": "Illinois", "income": 80306, "gdp_per_capita": 88000, "population": 12549000, "area": 57914, "monthlyData": {} },
    "IN": { "name": "Indiana", "income": 76910, "gdp_per_capita": 70000, "population": 6862000, "area": 36420, "monthlyData": {} },
    "IA": { "name": "Iowa", "income": 71433, "gdp_per_capita": 68000, "population": 3207000, "area": 56272, "monthlyData": {} },
    "KS": { "name": "Kansas", "income": 70333, "gdp_per_capita": 70000, "population": 2939000, "area": 82278, "monthlyData": {} },
    "KY": { "name": "Kentucky", "income": 61980, "gdp_per_capita": 62000, "population": 4537000, "area": 40408, "monthlyData": {} },
    "LA": { "name": "Louisiana", "income": 57650, "gdp_per_capita": 60000, "population": 4574000, "area": 52378, "monthlyData": {} },
    "ME": { "name": "Maine", "income": 73733, "gdp_per_capita": 70000, "population": 1363000, "area": 35380, "monthlyData": {} },
    "MD": { "name": "Maryland", "income": 124693, "gdp_per_capita": 88000, "population": 6180000, "area": 12406, "monthlyData": {} },
    "MA": { "name": "Massachusetts", "income": 127760, "gdp_per_capita": 110561, "population": 7001000, "area": 10555, "monthlyData": {} },
    "MI": { "name": "Michigan", "income": 76960, "gdp_per_capita": 75000, "population": 10037000, "area": 96716, "monthlyData": {} },
    "MN": { "name": "Minnesota", "income": 86364, "gdp_per_capita": 85000, "population": 5737000, "area": 86936, "monthlyData": {} },
    "MS": { "name": "Mississippi", "income": 55060, "gdp_per_capita": 53061, "population": 2964000, "area": 48432, "monthlyData": {} },
    "MO": { "name": "Missouri", "income": 78290, "gdp_per_capita": 72000, "population": 6196000, "area": 69707, "monthlyData": {} },
    "MT": { "name": "Montana", "income": 70804, "gdp_per_capita": 68000, "population": 1142000, "area": 147039, "monthlyData": {} },
    "NE": { "name": "Nebraska", "income": 74590, "gdp_per_capita": 93145, "population": 1978000, "area": 77348, "monthlyData": {} },
    "NV": { "name": "Nevada", "income": 80366, "gdp_per_capita": 75000, "population": 3177000, "area": 110572, "monthlyData": {} },
    "NH": { "name": "New Hampshire", "income": 110205, "gdp_per_capita": 87000, "population": 1395000, "area": 9349, "monthlyData": {} },
    "NJ": { "name": "New Jersey", "income": 117847, "gdp_per_capita": 89000, "population": 9260000, "area": 8722, "monthlyData": {} },
    "NM": { "name": "New Mexico", "income": 60980, "gdp_per_capita": 61000, "population": 2113000, "area": 121590, "monthlyData": {} },
    "NY": { "name": "New York", "income": 91366, "gdp_per_capita": 117332, "population": 19543000, "area": 54555, "monthlyData": {} },
    "NC": { "name": "North Carolina", "income": 70804, "gdp_per_capita": 75000, "population": 10835000, "area": 53819, "monthlyData": {} },
    "ND": { "name": "North Dakota", "income": 76525, "gdp_per_capita": 95982, "population": 783000, "area": 70698, "monthlyData": {} },
    "OH": { "name": "Ohio", "income": 73770, "gdp_per_capita": 70000, "population": 11799000, "area": 44825, "monthlyData": {} },
    "OK": { "name": "Oklahoma", "income": 67330, "gdp_per_capita": 65000, "population": 4053000, "area": 69899, "monthlyData": {} },
    "OR": { "name": "Oregon", "income": 91100, "gdp_per_capita": 80000, "population": 4280000, "area": 98379, "monthlyData": {} },
    "PA": { "name": "Pennsylvania", "income": 73824, "gdp_per_capita": 75000, "population": 12953000, "area": 46055, "monthlyData": {} },
    "RI": { "name": "Rhode Island", "income": 104252, "gdp_per_capita": 78000, "population": 1096000, "area": 1545, "monthlyData": {} },
    "SC": { "name": "South Carolina", "income": 69100, "gdp_per_capita": 65000, "population": 5370000, "area": 32021, "monthlyData": {} },
    "SD": { "name": "South Dakota", "income": 71810, "gdp_per_capita": 70000, "population": 919000, "area": 77116, "monthlyData": {} },
    "TN": { "name": "Tennessee", "income": 72700, "gdp_per_capita": 68000, "population": 7126000, "area": 42143, "monthlyData": {} },
    "TX": { "name": "Texas", "income": 75780, "gdp_per_capita": 76000, "population": 30504000, "area": 268596, "monthlyData": {} },
    "UT": { "name": "Utah", "income": 89786, "gdp_per_capita": 85000, "population": 3417000, "area": 84897, "monthlyData": {} },
    "VT": { "name": "Vermont", "income": 89695, "gdp_per_capita": 45707, "population": 647000, "area": 9616, "monthlyData": {} },
    "VA": { "name": "Virginia", "income": 89393, "gdp_per_capita": 82000, "population": 8716000, "area": 42774, "monthlyData": {} },
    "WA": { "name": "Washington", "income": 103748, "gdp_per_capita": 108468, "population": 7812000, "area": 71298, "monthlyData": {} },
    "WV": { "name": "West Virginia", "income": 60410, "gdp_per_capita": 60783, "population": 1770000, "area": 24230, "monthlyData": {} },
    "WI": { "name": "Wisconsin", "income": 74631, "gdp_per_capita": 72000, "population": 5911000, "area": 65496, "monthlyData": {} },
    "WY": { "name": "Wyoming", "income": 72415, "gdp_per_capita": 90335, "population": 584000, "area": 97813, "monthlyData": {} }
  };

  constructor() {
    this.generateMonthlyData();
  }

  generateMonthlyData() {
    const today = new Date();
    for (const stateCode in this.stateData) {
      if (this.stateData.hasOwnProperty(stateCode)) {
        const state = this.stateData[stateCode];
        for (let i = 0; i < 12; i++) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          state.monthlyData[yearMonth] = {
            income: state.income * (1 + (Math.random() - 0.5) * 0.1),
            gdp_per_capita: state.gdp_per_capita * (1 + (Math.random() - 0.5) * 0.1),
            population: Math.round(state.population * (1 + (Math.random() - 0.5) * 0.02)),
            area: state.area
          };
        }
      }
    }
    console.log("this.stateData", this.stateData);
  }




  // ngAfterViewInit() {
  //   Highcharts.chart('container', {
  //     chart: { type: 'column' },
  //     title: { text: 'External JS Chart' },
  //     series: [{
  //       data: [1, 3, 2, 4]
  //     }]
  //   });
  // }

  //   ngAfterViewInit(): void {
  //   const chart = Highcharts.chart('container', {
  //     chart: {
  //       type: 'pie',
  //       events: {
  //         render() {
  //           const chart = this as Highcharts.Chart & {
  //             customLabel?: Highcharts.SVGElement;
  //           };
  //           const series = chart.series[0];

  //           if (!chart.customLabel) {
  //             chart.customLabel = chart.renderer.label(
  //               'Total<br/><strong>2 877 820</strong>',
  //               0, // x (will be adjusted later)
  //               0, // y
  //               undefined,
  //               undefined,
  //               undefined,
  //               false
  //             )
  //               .css({
  //                 color: 'var(--highcharts-neutral-color-100, #000)',
  //                 textAlign: 'center'
  //               })
  //               .add();
  //           }

  //           const x = series.center[0] + chart.plotLeft;
  //           const y = series.center[1] + chart.plotTop - chart.customLabel.getBBox().height / 2;

  //           chart.customLabel.attr({ x, y });
  //           chart.customLabel.css({
  //             fontSize: `${series.center[2] / 12}px`
  //           });
  //         }
  //       }
  //     },
  //     accessibility: {
  //       point: {
  //         valueSuffix: '%'
  //       }
  //     },
  //     title: {
  //       text: '2023 Norway car registrations'
  //     },
  //     subtitle: {
  //       text: 'Source: <a href="https://www.ssb.no/">SSB</a>'
  //     },
  //     tooltip: {
  //       pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
  //     },
  //     legend: {
  //       enabled: false
  //     },
  //     plotOptions: {
  //       pie: {
  //         allowPointSelect: true,
  //         cursor: 'pointer',
  //         borderRadius: 8,
  //         innerSize: '75%',
  //         dataLabels: [
  //           {
  //             enabled: true,
  //             distance: 20,
  //             format: '{point.name}'
  //           },
  //           {
  //             enabled: true,
  //             distance: -15,
  //             format: '{point.percentage:.0f}%',
  //             style: {
  //               fontSize: '0.9em'
  //             }
  //           }
  //         ]
  //       }
  //     },
  //     series: [{
  //       type: 'pie',
  //       name: 'Registrations',
  //       colorByPoint: true,
  //       data: [
  //         { name: 'EV', y: 23.9 },
  //         { name: 'Hybrids', y: 12.6 },
  //         { name: 'Diesel', y: 37.0 },
  //         { name: 'Petrol', y: 26.4 }
  //       ]
  //     }]
  //   });
  // }

  ngAfterViewInit() {
    this.chartOne();
    this.chartTwo();
    this.chartTree();
    this.chartForth();
    this.chartFive();
    this.chartSix();
    this.chartSeven('income');
    this.chartEight();
    // this.chartOne('container4');
    // this.chartOne('container5');
    // this.chartOne('container6');
    // this.chartOne2();
  }

  chartFive() {
    const registrationDateWiseDates = ['Jul 1', 'Jul 2', 'Jul 3', 'Jul 4', 'Jul 5'];
    const registrationDateWiseData = [
      {
        name: 'Approved',
        data: [5, 7, 6, 9, 8],
        color: '#2ca153',
        total: 35
      },
      {
        name: 'Pending',
        data: [2, 3, 4, 2, 1],
        color: '#f7b731',
        total: 12
      },
      {
        name: 'Rejected',
        data: [1, 0, 2, 1, 0],
        color: '#eb3b5a',
        total: 4
      }
    ];

    Highcharts.chart('container5', {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 400
      },
      title: {
        text: '',
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#243857'
        }
      },
      xAxis: {
        categories: registrationDateWiseDates,
        crosshair: true,
        title: {
          text: 'Date',
          style: {
            fontSize: '14px',
            color: '#000000',
            fontWeight: '600',
          },
          align: 'low',
          x: 0,
          y: 10,
        },
        labels: {
          style: {
            fontSize: '12px',
            color: '#70798c',
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Registration',
          style: {
            fontSize: '14px',
            color: '#000000',
            fontWeight: '600',
          }
        },
        labels: {
          style: {
            fontSize: '12px',
            color: '#70798c',
          }
        }
      },
      tooltip: {
        shared: true,
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderRadius: 6,
        shadow: true,
        style: {
          fontSize: '12px'
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderWidth: 0,
          pointPadding: 0.1,
          groupPadding: 0.1
        }
      },
      legend: {
        className: "general-pie-chart-legend",
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        symbolRadius: 4,
        symbolHeight: 6,
        symbolWidth: 16,
        squareSymbol: false,
        itemWidth: 160,
        itemStyle: {
          fontSize: '12px',
          color: '#70798c'
        },
        labelFormatter: function (this: any) {
          return `${this.name} <b style="color: #243857;">(${this.userOptions.total})</b>`;
        }
      },
      exporting: {
        enabled: true,
        filename: 'Registration_Bar_Chart'
      },
      credits: {
        enabled: false
      },
      series: registrationDateWiseData
    });
  }

  chartForth() {
    Highcharts.chart('container4', {
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      chart: {
        type: 'bar',
        height: '210',
        spacingTop: 0,
        spacingBottom: 0,
        marginBottom: 0,
        marginTop: 175,
      },
      title: {
        useHTML: true,
        text: `<div style="line-height: 1.2;">
             <span style="font-size: 2.5rem; color: #243857;">113<span style="font-size: 0.938rem;color: #243857;margin-left: 0.4rem;">Total Registrations</span></span><br>
           </div>`,
        align: 'left',
        style: {
          fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
        }
      },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          const point = this.point;
          const count = point.custom?.count || '';
          const status = point.custom?.status || '';
          const percent = point.percentage?.toFixed(1) + '%' || '';
          return `<strong>${status}</strong><br/>
              Count: ${count}<br/>
              Percent: ${percent}`;
        }
      },
      exporting: {
        enabled: true,
        filename: 'Event_Attendance'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          grouping: false,
          pointPadding: 0.5,
          groupPadding: 0.1,
          borderWidth: 5
        },
        bar: {
          stacking: 'percent',
          pointWidth: 20,
          pointPadding: 0.5,
          groupPadding: 0.05,
          dataLabels: {
            enabled: true,
            useHTML: true,
            align: 'left',
            crop: false,
            overflow: 'allow',
            verticalAlign: 'top',
            y: -104,
            x: -3,
            formatter: function (this: any) {
              const count = this.point.custom?.count || '';
              const percent = this.y + '%';
              const status = this.point.custom?.status || '';
              return `<div style="text-align:left;border-left: 2px solid #d8d8d8;padding-left:0.6rem;line-height:1;bottom: 0.9rem;position: relative;padding-bottom: 0.6rem;">
                    <span class="fonts-28 txt-243857">  ${count} </span> <br/><br/><br/><br/></br>
                     <span class="fonts-20 txt-243857 semibold">${percent}</span><br/>
                      <span class="fonts-12 txt-243857 regular" style="line-height:1.5;letter-spacing: 0.4px;">${status}</span>
                  </div>`;
            },
            style: {
              fontSize: '10px',
              color: '#000'
            }
          },
          accessibility: {
            exposeAsGroupOnly: true
          }
        }
      },
      yAxis: {
        reversedStacks: false,
        opposite: true,
        labels: {
          enabled: false
        },
        gridLineWidth: 0,
        title: null,
        stackLabels: {
          enabled: false
        },
        startOnTick: false,
        endOnTick: false
      },
      xAxis: {
        visible: false,
        title: null,
        lineWidth: 1,
      },
      legend: {
        enabled: false
      },
      series: [
        {
          name: 'Attended',
          color: '#00C49F',
          data: [{
            y: 70,
            custom: {
              count: 79,
              status: 'Attended'
            }
          }]
        },
        {
          name: 'Not Attended',
          color: '#FF7F50',
          data: [{
            y: 30,
            custom: {
              count: 34,
              status: 'Not Attended'
            }
          }]
        }
      ]
    });

  }

  chartTwo() {
    Highcharts.chart('container2', {
      chart: {
        type: 'pie',
        events: {
          render: function () {
            const chart = this as any;

            // Calculate total value from all points
            const total = chart.series[0].data.reduce((sum: any, point: any) => sum + point.y, 0);

            // Create the label if it doesn't exist
            if (!chart.customLabel) {
              chart.customLabel = chart.renderer
                .label('', 0, 0)
                .css({
                  color: '#000',
                  textAlign: 'center'
                })
                .add();
            }

            // Position label in center of donut
            const series = chart.series[0];
            const x = series.center[0] + chart.plotLeft;
            const y = series.center[1] + chart.plotTop - chart.customLabel.getBBox().height / 2;

            // chart.customLabel.attr({
            //   x: x,
            //   y: y,
            //   text: 'Total<br/><strong>' + Highcharts.numberFormat(total, 0, '.', ' ') + '</strong>'
            // });

            chart.customLabel.css({
              fontSize: (series.center[2] / 12) + 'px'
            });
          }
        }
      },

      title: {
        text: '2023 Norway car registrations'
      },

      // subtitle: {
      //   text: 'Source: <a href="https://www.ssb.no/">SSB</a>'
      // },
      credits: {
        enabled: false
      },

      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
      },

      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },

      legend: {
        enabled: false
      },

      plotOptions: {
        pie: {
          // allowPointSelect: true,
          cursor: 'pointer',
          borderRadius: 8,
          innerSize: '75%',
          dataLabels: [
            {
              enabled: true,
              distance: 20,
              format: '{point.name}'
            },
            {
              enabled: true,
              distance: -15,
              format: '{point.percentage:.0f}%',
              style: {
                fontSize: '0.9em'
              }
            }
          ]
        }
      },

      series: [{
        name: 'Registrations',
        colorByPoint: true,
        data: [
          { name: 'EV', y: 23.9 },
          { name: 'Hybrids', y: 12.6 },
          { name: 'Diesel', y: 37.0 },
          { name: 'Petrol', y: 26.4 }
        ]
      }]
    });
  }

  chartTree() {
    Highcharts.chart('container3', {
      chart: {
        type: 'pie',
        zooming: {
          type: 'xy'
        },
        panning: {
          enabled: true,
          type: 'xy'
        },
        panKey: 'shift'
      },
      title: {
        text: 'Egg Yolk Composition'
      },
      tooltip: {
        valueSuffix: '%'
      },
      // subtitle: {
      //   text:
      //     'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
      // },
      plotOptions: {
        pie: {
          // allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [{
            enabled: true,
            distance: 20
          }, {
            enabled: true,
            distance: -40,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          }]
        }
      },
      series: [
        {
          name: 'Percentage',
          colorByPoint: true,
          data: [
            {
              name: 'Water',
              y: 55.02
            },
            {
              name: 'Fat',
              sliced: true,
              selected: true,
              y: 26.71
            },
            {
              name: 'Carbohydrates',
              y: 1.09
            },
            {
              name: 'Protein',
              y: 15.5
            },
            {
              name: 'Ash',
              y: 1.68
            }
          ]
        }
      ]
    });
  }

  chartOne() {
    const thisTemp = this;

    const staticTicketWiseData = [
      { name: 'Attendee Ticket', y: 51 },
      { name: 'Sunmi Badge Tickets', y: 12 },
      { name: 'Exhibiting Company Ticket', y: 11 },
      { name: 'Sponser Ticket', y: 8 },
      { name: 'Speaker Ticket', y: 7 },
      { name: 'Exhibitor Ticket', y: 5 },
      { name: 'Team Member Ticket', y: 5 },
      { name: 'Attendee Ticket Replicate', y: 5 },
      { name: 'Liaison Ticket', y: 3 }
    ];

    Highcharts.chart('container1', {
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 350,
        events: {
          render() {
            thisTemp.updatePieChartTotal(this, 'All Tickets');
          },
          load() {
            thisTemp.updatePieChartTotal(this, 'All Tickets');
            thisTemp.pieChartSliceAnimation(this);
          }
        }
      },
      title: {
        text: '',
        useHTML: true,
        verticalAlign: 'middle',
        align: 'center',
        floating: true
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)',
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderRadius: 6,
        shadow: true,
        style: {
          fontSize: '12px'
        }
      },
      plotOptions: {
        pie: {
          innerSize: '75%',
          showInLegend: true,
          dataLabels: { enabled: false },
          borderWidth: 0,
          point: {
            events: {
              legendItemClick: function (this: any) {
                const chart = this.series.chart;
                setTimeout(() => thisTemp.updatePieChartTotal(chart, 'All Tickets'), 10);
              }
            }
          }
        }
      },
      exporting: {
        enabled: true,
        filename: 'Ticket_Wise'
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: true,
        className: "general-pie-chart-legend",
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        itemMarginBottom: 10,
        symbolRadius: 4,
        symbolHeight: 6,
        symbolWidth: 16,
        squareSymbol: false,
        itemWidth: 160,
        itemStyle: {
          fontSize: '12px',
          color: '#8999b3'
        },
        labelFormatter: function (this: any) {
          return `${this.name} <b style="color: #243857;">(${this.y})</b>`;
        }
      },
      series: [{
        name: 'Tickets',
        colorByPoint: true,
        data: staticTicketWiseData
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            chart: {
              height: '450px',
            },
            legend: {
              enabled: true,
              align: 'center',   
              verticalAlign: 'bottom',
              layout: 'horizontal',
              itemWidth: 300,
            }
          }
        }]
      }
    });
  }


  updatePieChartTotal(chart: any, labelText = '', xValMinus = 39) {
    const series = chart.series[0];
    // Get visible points only
    const total = series.points
      .filter((point: any) => point.visible)
      .reduce((sum: any, point: any) => sum + point.y, 0);
    const centerX = series.center[0] + chart.plotLeft - xValMinus;
    const centerY = series.center[1] + chart.plotTop;
    const htmlText = `<div style="font-size: 1rem; color: #8999b3;">${labelText}</div><br/><br/><div style="font-size: 1.375rem; font-weight: bold; color:#243857;">${total.toLocaleString()}</div>`;
    // If label doesn't exist, create it
    if (!chart.customLabel) {
      chart.customLabel = chart.renderer.label(htmlText, centerX, centerY, 'center')
        .css({
          color: '#000',
          textAlign: 'center',
          fontSize: `${series.center[2] / 16}px`
        })
        .add();
    } else {
      // Update existing label
      chart.customLabel.attr({
        text: htmlText,
        x: centerX,
        y: centerY - chart.customLabel.getBBox().height / 2
      });
    }
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

  chartSix() {

    (async () => {
      const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
      ).then(response => response.json());

      const data = [
        // state, demVotes, repVotes, libVotes, grnVotes, sumVotes,
        // winner, offset config for pies
        ['Alabama', 729547, 1318255, 44467, 9391, 2101660, -1],
        ['Alaska', 116454, 163387, 18725, 5735, 304301, -1],
        ['Arizona', 1161167, 1252401, 106327, 34345, 2554240, -1],
        ['Arkansas', 380494, 684782, 29829, 9473, 1104578, -1],
        [
          'California', 8577206, 4390272, 467370, 271047, 13705895, 1,
          { lon: -1, drawConnector: false }
        ],
        ['Colorado', 1338870, 1202484, 144121, 38437, 2723912, 1],
        [
          'Connecticut', 897572, 673215, 48676, 22841, 1642304, 1,
          { lat: -1.5, lon: 1 }
        ],
        [
          'Delaware', 235603, 185127, 14757, 6103, 441590, 1,
          { lat: -1.3, lon: 2 }
        ],
        [
          'District of Columbia', 282830, 12723, 4906, 4258, 304717, 1,
          { lat: -2, lon: 2 }
        ],
        ['Florida', 4504975, 4617886, 207043, 64399, 9394303, -1],
        ['Georgia', 1877963, 2089104, 125306, 0, 4092373, -1],
        [
          'Hawaii', 266891, 128847, 15954, 12737, 424429, 1,
          { lat: -0.5, lon: 0.5, drawConnector: false }
        ],
        ['Idaho', 189765, 409055, 28331, 8496, 635647, -1],
        ['Illinois', 2977498, 2118179, 208682, 74112, 5378471, 1],
        ['Indiana', 1039126, 1557286, 133993, 7841, 2738246, -1],
        ['Iowa', 653669, 800983, 59186, 11479, 1525317, -1],
        ['Kansas', 427005, 671018, 55406, 23506, 1176935, -1],
        ['Kentucky', 628854, 1202971, 53752, 13913, 1899490, -1],
        ['Louisiana', 780154, 1178638, 37978, 14031, 2010801, -1],
        ['Maine', 352156, 332418, 37578, 13995, 736147, 1],
        [
          'Maryland', 1502820, 878615, 78225, 33380, 2493040, 1,
          { lon: 0.6, drawConnector: false }
        ],
        [
          'Massachusetts', 1995196, 1090893, 138018, 47661, 3271768, 1,
          { lon: 3 }
        ],
        ['Michigan', 2268839, 2279543, 172136, 51463, 4771981, -1],
        [
          'Minnesota', 1367716, 1322951, 112972, 36985, 2840624, 1,
          { lon: -1, drawConnector: false }
        ],
        ['Mississippi', 462127, 678284, 14411, 3595, 1158417, -1],
        ['Missouri', 1054889, 1585753, 96404, 25086, 2762132, -1],
        ['Montana', 174281, 273879, 28036, 7868, 484064, -1],
        ['Nebraska', 273185, 485372, 38746, 8337, 805640, -1],
        ['Nevada', 539260, 512058, 37384, 0, 1088702, 1],
        ['New Hampshire', 348526, 345790, 30694, 6465, 731475, 1],
        [
          'New Jersey', 1967444, 1509688, 72143, 37131, 3586406, 1,
          { lat: -1, lon: 1.2 }
        ],
        ['New Mexico', 380923, 316134, 74544, 9797, 781398, 1],
        ['New York', 4145376, 2638135, 162273, 100110, 7045894, 1],
        ['North Carolina', 2169496, 2345235, 130021, 1038, 4645790, -1],
        ['North Dakota', 93758, 216794, 21434, 378, 332364, -1],
        ['Ohio', 2320596, 2776683, 174266, 44310, 5315855, -1],
        ['Oklahoma', 420375, 949136, 83481, 0, 1452992, -1],
        ['Oregon', 991580, 774080, 93875, 49247, 1908782, 1],
        ['Pennsylvania', 2874136, 2945302, 144826, 49334, 6013598, -1],
        [
          'Rhode Island', 227062, 166454, 14700, 6171, 414387, 1,
          { lat: -0.7, lon: 1.7 }
        ],
        ['South Carolina', 855373, 1155389, 49204, 13034, 2073000, -1],
        ['South Dakota', 117442, 227701, 20845, 0, 365988, -1],
        ['Tennessee', 868853, 1519926, 70286, 15952, 2475017, -1],
        ['Texas', 3877868, 4685047, 283492, 71558, 8917965, -1],
        ['Utah', 222858, 375006, 39608, 7695, 645167, -1],
        ['Vermont', 178573, 95369, 10078, 6758, 290778, 1, { lat: 2 }],
        ['Virginia', 1981473, 1769443, 118274, 27638, 3896828, 1],
        ['Washington', 1727840, 1210370, 160356, 57571, 3156137, 1],
        ['West Virginia', 187519, 486304, 22958, 8016, 704797, -1],
        ['Wisconsin', 1382947, 1407028, 106470, 31016, 2927461, -1],
        ['Wyoming', 55973, 174419, 13287, 2515, 246194, -1]
      ],
        demColor = 'rgba(74,131,240,0.80)',
        repColor = 'rgba(220,71,71,0.80)',
        libColor = 'rgba(240,190,50,0.80)',
        grnColor = 'rgba(90,200,90,0.80)';


      // Compute max votes to find relative sizes of bubbles
      const maxVotes = data.reduce((max, row: any) => Math.max(max, row[5]), 0);

      // Build the chart
      const chart = Highcharts.mapChart('container6', {

        chart: {
          animation: false // Disable animation, especially for zooming
        },
        credits: {
          enabled: false
        },

        accessibility: {
          description: 'Complex map demo showing voting results for US ' +
            'states, where each state has a pie chart overlaid showing ' +
            'the vote distribution.'
        },

        colorAxis: {
          dataClasses: [{
            from: -1,
            to: 0,
            color: 'rgba(244,91,91,0.5)',
            name: 'Republican'
          }, {
            from: 0,
            to: 1,
            color: 'rgba(124,181,236,0.5)',
            name: 'Democrat'
          }, {
            from: 2,
            to: 3,
            name: 'Libertarian',
            color: libColor
          }, {
            from: 3,
            to: 4,
            name: 'Green',
            color: grnColor
          }]
        },

        mapNavigation: {
          enabled: true
        },

        title: {
          text: 'USA 2016 Presidential Election Results',
          align: 'center'
        },

        // Default options for the pies
        plotOptions: {
          pie: {
            borderWidth: 1,
            clip: true,
            dataLabels: {
              enabled: false
            },
            states: {
              hover: {
                halo: {
                  size: 5
                }
              }
            },
            tooltip: {
              headerFormat: ''
            }
          }
        },

        series: [{
          mapData,
          data: data,
          name: 'States',
          accessibility: {
            point: {
              descriptionFormatter(point: any) {
                const party = point.value > 0 ?
                  'democrat' : 'republican';
                return point.name +
                  ', ' + party + '. Total votes: ' + point.sumVotes +
                  '. Democrat votes: ' + point.demVotes +
                  '. Republican votes: ' + point.repVotes +
                  '. Libertarian votes: ' + point.libVotes +
                  '. Green votes: ' + point.grnVotes + '.';
              }
            }
          },
          borderColor: 'var(--highcharts-background-color, white)',
          joinBy: ['name', 'id'],
          keys: [
            'id', 'demVotes', 'repVotes', 'libVotes', 'grnVotes',
            'sumVotes', 'value', 'pieOffset'
          ],
          tooltip: {
            headerFormat: '',
            pointFormatter(this: any) {
              const hoverVotes = this.hoverVotes; // Used by pie only
              return '<b>' + this.id + ' votes</b><br/>' +
                [
                  ['Democrats', this.demVotes, demColor],
                  ['Republicans', this.repVotes, repColor],
                  ['Libertarians', this.libVotes, libColor],
                  ['Green', this.grnVotes, grnColor]
                ]
                  .sort((a, b) => b[1] - a[1]) // Sort tooltip by
                  // most votes
                  .map(
                    line => '<span style="color:' + line[2] +
                      // Colorized bullet
                      '">\u25CF</span> ' +
                      // Party and votes
                      (line[0] === hoverVotes ? '<b>' : '') +
                      line[0] + ': ' +
                      Highcharts.numberFormat(line[1], 0) +
                      (line[0] === hoverVotes ? '</b>' : '') +
                      '<br/>'
                  )
                  .join('') +
                '<hr/>Total: ' +
                Highcharts.numberFormat(this.sumVotes, 0);
            }
          }
        }, {
          name: 'Connectors',
          type: 'mapline',
          color: 'rgba(130, 130, 130, 0.5)',
          zIndex: 5,
          showInLegend: false,
          enableMouseTracking: false,
          accessibility: {
            enabled: false
          }
        }]
      });

      // When clicking legend items, also toggle connectors and pies
      chart.legend.allItems.forEach((item: any) => {
        const setVisible = item.setVisible;

        item.setVisible = function () {
          const item = this;

          setVisible.call(item);

          chart.series[0].points.forEach((point: any) => {
            if (
              chart.colorAxis[0].dataClasses[point.dataClass].name ===
              item.name
            ) {
              // Find this state's pie and set visibility
              Highcharts.find(chart.series, function (item: any) {
                return item.name === point.id;
              }).setVisible(item.visible, false);

              // Do the same for the connector point if it exists
              const connector = Highcharts.find(
                chart.series[2].points,
                (item: any) => item.name === point.id
              );

              if (connector) {
                connector.setVisible(item.visible, false);
              }
            }
          });
          chart.redraw();
        };
      });

      // Add the pies after chart load, optionally with offset and connectors
      chart.series[0].points.forEach((state: any) => {
        // Add the pie for this state
        chart.addSeries({
          type: 'pie',
          name: state.id,
          zIndex: 6, // Keep pies above connector lines
          minSize: 15,
          maxSize: 55,
          onPoint: {
            id: state.id,
            z: (() => {
              const mapView = chart.mapView,
                zoomFactor = mapView.zoom / mapView.minZoom;

              return Math.max(
                chart.chartWidth / 45 * zoomFactor, // Min size
                chart.chartWidth /
                11 * zoomFactor * state.sumVotes / maxVotes
              );
            })()
          },
          states: {
            inactive: {
              enabled: false
            }
          },
          accessibility: {
            enabled: false
          },
          tooltip: {
            // Use the state tooltip for the pies as well
            pointFormatter(this: any) {
              return state.series.tooltipOptions.pointFormatter.call({
                id: state.id,
                hoverVotes: this.name,
                demVotes: state.demVotes,
                repVotes: state.repVotes,
                libVotes: state.libVotes,
                grnVotes: state.grnVotes,
                sumVotes: state.sumVotes
              });
            }
          },
          data: [{
            name: 'Democrats',
            y: state.demVotes,
            color: demColor
          }, {
            name: 'Republicans',
            y: state.repVotes,
            color: repColor
          }, {
            name: 'Libertarians',
            y: state.libVotes,
            color: libColor
          }, {
            name: 'Green',
            y: state.grnVotes,
            color: grnColor
          }]
        }, false);
      });

      // Only redraw once all pies and connectors have been added
      chart.redraw();
    })();

  }

  // chartSeven() {
  //   (async () => {
  //     const mapData = await fetch(
  //       'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
  //     ).then(response => response.json());

  //     const columns = [
  //       // State postal codes
  //       ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  //         "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  //         "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
  //         "VA", "WA", "WV", "WI", "WY"],
  //       // State names
  //       ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  //         "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  //         "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  //         "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  //         "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  //         "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  //         "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  //         "Wisconsin", "Wyoming"],
  //       // Clinton votes (dummy)
  //       [600000, 55000, 800000, 400000, 9000000, 1200000, 750000, 250000, 4500000, 1400000, 230000,
  //         250000, 2600000, 1200000, 700000, 500000, 900000, 800000, 360000, 1000000, 1400000, 2000000,
  //         1800000, 600000, 1200000, 100000, 300000, 700000, 400000, 900000, 450000, 5500000, 1400000,
  //         25000, 1000000, 1300000, 600000, 1300000, 200000, 900000, 150000, 1000000, 130000, 650000,
  //         900000, 350000, 200000, 900000, 700000, 350000, 140000],
  //       // Trump votes (dummy)
  //       [700000, 60000, 900000, 450000, 4500000, 1100000, 650000, 200000, 4800000, 1500000, 300000,
  //         300000, 2300000, 1300000, 650000, 600000, 950000, 900000, 330000, 900000, 1200000, 2200000,
  //         1900000, 550000, 1100000, 120000, 400000, 800000, 380000, 850000, 430000, 5200000, 1500000,
  //         20000, 1050000, 1250000, 650000, 1200000, 150000, 850000, 160000, 980000, 140000, 600000,
  //         920000, 300000, 250000, 880000, 750000, 300000, 120000],
  //       // Empty dummy placeholders for columns 4–7
  //       [], [], [], [],
  //       // Republican margin % (Trump – Clinton)
  //       [10, 10, 12, 5, -20, -4, -8, -6, 3, 7, 10, 20, -6, 8, -5, 4, 3, 12, -8, -10, -15, 10, 5, -8,
  //         -4, 2, -4, 14, -5, -6, -5, -6, -8, 5, -4, 12, -5, -10, -5, 7, 10, -5, -8, 4, -2, -10,
  //         -6, -15, 6, -10]
  //     ];

  //     const pointClick = function (this: any) {
  //       const row = this.options.row;
  //       const chart = this.series.chart;

  //       chart.removeAnnotation('election-popup');

  //       chart.addAnnotation({
  //         id: 'election-popup',
  //         labelOptions: {
  //           useHTML: true,
  //           backgroundColor: '#fff'
  //         },
  //         labels: [{
  //           point: {
  //             x: chart.plotWidth / 2,
  //             y: chart.plotHeight / 10
  //           },
  //           text: `
  //          <div id="annotation-container" style="width: 300px; padding: 10px; font-family: Arial;">
  //   <div id="annotation-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
  //     <span style="font-weight: bold; font-size: 14px;">${this.name}</span>
  //     <button id="annotation-close-btn" style="background: none; border: none; font-weight: bold; font-size: 16px; cursor: pointer;">✕</button>
  //   </div>
  //   <div id="popup-pie" style="width: 280px; height: 200px;"></div>
  // </div>
  //         `,
  //           shape: 'rect'
  //         }],
  //         zIndex: 10
  //       });

  //       const pieChart = Highcharts.chart('popup-pie', {
  //         chart: { type: 'pie' },
  //         // credits: {
  //         //   enabled: false
  //         // },
  //         title: { text: null },
  //         legend: { enabled: true, reversed: true },
  //         navigation: { buttonOptions: { enabled: false } },
  //         series: [{
  //           name: 'Votes',
  //           data: [
  //             { name: 'Trump', color: '#C40401', y: columns[3][row] },
  //             { name: 'Clinton', color: '#0200D0', y: columns[2][row] }
  //           ],
  //           dataLabels: { format: '{point.percentage:.1f}%' },
  //           showInLegend: true
  //         }]
  //       });

  //       const closeBtn = document.getElementById('annotation-close-btn');
  //       if (closeBtn) {
  //         closeBtn.addEventListener('click', function () {
  //           pieChart?.destroy();
  //           setTimeout(() => {
  //             chart.removeAnnotation('election-popup');
  //           }, 0);
  //         });
  //       }
  //     };



  //     let keys = columns[0].map((key: any) => key.toUpperCase());
  //     const names = columns[1];
  //     const percent = columns[8];

  //     const options = {
  //       style: {
  //         fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
  //       },
  //       chart: {
  //         type: 'map',
  //         map: mapData,
  //         renderTo: 'container7',
  //         borderWidth: 1,
  //         spacingBottom: 1,
  //         pinchType: '',  // disables pinch-to-zoom on mobile
  //         zoomType: ''    // disables drag-to-zoom on desktop
  //       },
  //       title: {
  //         text: 'US presidential election 2016 results',
  //         align: 'left'
  //       },
  //       subtitle: {
  //         text: 'Static data sample',
  //         align: 'left'
  //       },
  //       legend: {
  //         align: 'right',
  //         verticalAlign: 'top',
  //         x: -100,
  //         y: 70,
  //         floating: true,
  //         layout: 'vertical',
  //         valueDecimals: 0,
  //         backgroundColor: `color-mix(in srgb, var(--highcharts-background-color, white), transparent 15%)`
  //       },
  //       mapNavigation: {
  //         enabled: false,
  //         enableButtons: false
  //       },
  //       colorAxis: {
  //         dataClasses: [{
  //           from: -100,
  //           to: 0,
  //           color: '#0200D0',
  //           name: 'Clinton'
  //         }, {
  //           from: 0,
  //           to: 100,
  //           color: '#C40401',
  //           name: 'Trump'
  //         }]
  //       },
  //       credits: {
  //         enabled: false
  //       },
  //       series: [{
  //         data: [] as any[],
  //         joinBy: 'postal-code',
  //         dataLabels: {
  //           enabled: true,
  //           color: '#FFFFFF',
  //           // format: '{point.labelText }',
  //           style: { textTransform: 'uppercase' },
  //           formatter: function (this: any) {
  //             return this.point.labelText || this.point.value || '';
  //           }
  //         },
  //         name: 'Republicans margin',
  //         // point: { events: { click: pointClick } },
  //         tooltip: { ySuffix: ' %' },
  //         cursor: 'pointer'
  //       }, {
  //         name: 'Separators',
  //         type: 'mapline',
  //         nullColor: 'silver',
  //         showInLegend: false,
  //         enableMouseTracking: false,
  //         accessibility: { enabled: false }
  //       }]
  //     };

  //     // Populate map data with static columns
  //     if (mapData?.objects?.default?.geometries) {
  //       mapData.objects.default.geometries.forEach((geometry: any) => {
  //         if (geometry?.properties?.['postal-code']) {
  //           const postalCode = geometry.properties['postal-code'];
  //           const i = keys.indexOf(postalCode);
  //           if (i >= 0) {
  //             (options.series[0].data as any[]).push(Highcharts.extend({
  //               value: percent[i],
  //               name: names[i],
  //               'postal-code': postalCode,
  //               labelText: percent[i],
  //               row: i
  //             }, geometry));
  //           }
  //         }
  //       });
  //     }

  //     this.chart7 = Highcharts.mapChart('container7', options);
  //   })();
  // }


  // --- Main Chart Rendering Function ---
  chartSeven(
    displayCategory: 'income' | 'population' | 'area' | 'gdp',
    month?: string,
    sixMonthStartMonth?: string,
    singleStateCode?: string
  ) {
    (async () => {
      const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
      ).then(response => response.json());

      const postalCodes = Object.keys(this.stateData) as Array<keyof typeof this.stateData>;
      const stateNames = postalCodes.map(code => this.stateData[code].name);

      let currentIncomeData: number[] = [];
      let currentGdpData: number[] = [];
      let currentPopulationData: number[] = [];
      let currentAreaData: number[] = [];

      if (month) {
        postalCodes.forEach(code => {
          const monthly = this.stateData[code].monthlyData[month];
          currentIncomeData.push(monthly ? monthly.income : this.stateData[code].income);
          currentGdpData.push(monthly ? monthly.gdp_per_capita : this.stateData[code].gdp_per_capita);
          currentPopulationData.push(monthly ? monthly.population : this.stateData[code].population);
          currentAreaData.push(monthly ? monthly.area : this.stateData[code].area);
        });
        // --- ADD THIS CONSOLE LOG FOR DATA REPLACEMENT DEMO ---
        const caData = this.stateData['CA'].monthlyData[month];
        if (caData) {
          console.log(`--- Data for California (CA) for ${month} ---`);
          console.log(`Income: ${caData.income.toLocaleString()}`);
          console.log(`Population: ${caData.population.toLocaleString()}`);
          console.log(`GDP per Capita: ${caData.gdp_per_capita.toLocaleString()}`);
          console.log('-------------------------------------------');
        }
        // --- END CONSOLE LOG ---
      } else if (sixMonthStartMonth) {
        const startDate = new Date(sixMonthStartMonth);
        postalCodes.forEach(code => {
          let sumIncome = 0; let sumGdp = 0; let sumPop = 0; let sumArea = 0; let count = 0;
          for (let i = 0; i < 6; i++) {
            const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthly = this.stateData[code].monthlyData[yearMonth];
            if (monthly) {
              sumIncome += monthly.income; sumGdp += monthly.gdp_per_capita;
              sumPop += monthly.population; sumArea += monthly.area;
              count++;
            }
          }
          currentIncomeData.push(count > 0 ? sumIncome / count : this.stateData[code].income);
          currentGdpData.push(count > 0 ? sumGdp / count : this.stateData[code].gdp_per_capita);
          currentPopulationData.push(count > 0 ? sumPop / count : this.stateData[code].population);
          currentAreaData.push(count > 0 ? sumArea / count : this.stateData[code].area);
        });
      } else {
        currentIncomeData = postalCodes.map(code => this.stateData[code].income);
        currentGdpData = postalCodes.map(code => this.stateData[code].gdp_per_capita);
        currentPopulationData = postalCodes.map(code => this.stateData[code].population);
        currentAreaData = postalCodes.map(code => this.stateData[code].area);
      }

      const allColumns: {
        postalCodes: string[],
        stateNames: string[],
        incomes: number[],
        gdps: number[],
        populations: number[],
        areas: number[]
      } = {
        postalCodes: postalCodes,
        stateNames: stateNames,
        incomes: currentIncomeData,
        gdps: currentGdpData,
        populations: currentPopulationData,
        areas: currentAreaData
      };

      let displayValue: number[];
      let seriesName: string;
      let tooltipSuffix: string;
      let dataClasses: any[];
      let subtitleText: string = (month ? `Data for ${month}` : (sixMonthStartMonth ? `Average for ${sixMonthStartMonth} to ${new Date(new Date(sixMonthStartMonth).getFullYear(), new Date(sixMonthStartMonth).getMonth() + 5, 1).toISOString().substring(0, 7)}` : 'Current Snapshot')) + '<br>Click on a state for detailed data';


      switch (displayCategory) {
        case 'income':
          displayValue = allColumns.incomes;
          seriesName = 'Median Household Income';
          tooltipSuffix = ' USD';
          dataClasses = [{ from: 0, to: 65000, color: '#E0F2F7', name: '< $65k (Income)' }, { from: 65001, to: 80000, color: '#B2EBF2', name: '$65k - $80k (Income)' }, { from: 80001, to: 95000, color: '#80DEEA', name: '$80k - $95k (Income)' }, { from: 95001, to: 200000, color: '#4DD0E1', name: '> $95k (Income)' }];
          break;
        case 'population':
          displayValue = allColumns.populations;
          seriesName = 'Population';
          tooltipSuffix = ' People';
          dataClasses = [{ from: 0, to: 2000000, color: '#F8E0E0', name: '< 2M People' }, { from: 2000001, to: 5000000, color: '#F0B2B2', name: '2M - 5M People' }, { from: 5000001, to: 10000000, color: '#E88484', name: '5M - 10M People' }, { from: 10000001, to: 40000000, color: '#E05555', name: '> 10M People' }];
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
          dataClasses = [{ from: 0, to: 65000, color: '#F8E0F8', name: '< $65k (GDP)' }, { from: 65001, to: 80000, color: '#F0B2F0', name: '$65k - $80k (GDP)' }, { from: 80001, to: 95000, color: '#E884E8', name: '$80k - $95k (GDP)' }, { from: 95001, to: 120000, color: '#E055E0', name: '> $95k (GDP)' }];
          break;
      }

      const pointClick = (function (this: any) {
        const currentAllColumns = allColumns;
        return function (this: any) {
          const postalCode = this['postal-code'];
          const rowIndex = currentAllColumns.postalCodes.indexOf(postalCode);
          if (rowIndex === -1) return;

          const chart = this.series.chart;
          chart.removeAnnotation('data-popup');

          chart.addAnnotation({
            id: 'data-popup',
            labelOptions: { useHTML: true, backgroundColor: '#fff' },
            labels: [{
              point: { x: chart.plotWidth / 2, y: chart.plotHeight / 10 },
              text: `
                <div id="annotation-container" style="width: 300px; padding: 10px; font-family: Arial;">
                  <div id="annotation-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 14px;">${this.name}</span>
                    <button id="annotation-close-btn" style="background: none; border: none; font-weight: bold; font-size: 16px; cursor: pointer;">✕</button>
                  </div>
                  <div id="popup-data" style="width: 280px; height: 200px;"></div>
                </div>
              `,
              shape: 'rect'
            }],
            zIndex: 10
          });

          const pieChart = Highcharts.chart('popup-data', {
            chart: { type: 'pie' },
            title: { text: null },
            legend: { enabled: true, reversed: false },
            navigation: { buttonOptions: { enabled: false } },
            series: [{
              name: 'Data',
              data: [
                { name: 'Median Income', color: '#4CAF50', y: currentAllColumns.incomes[rowIndex] },
                { name: 'GDP per Capita', color: '#2196F3', y: currentAllColumns.gdps[rowIndex] },
                { name: 'Population', color: '#FFC107', y: currentAllColumns.populations[rowIndex] },
                { name: 'Area (sq mi)', color: '#9E9E9E', y: currentAllColumns.areas[rowIndex] }
              ],
              dataLabels: { format: '{point.name}: {point.y:,.0f}' },
              showInLegend: true
            }]
          });

          const closeBtn = document.getElementById('annotation-close-btn');
          if (closeBtn) {
            closeBtn.addEventListener('click', function () {
              pieChart?.destroy();
              setTimeout(() => {
                chart.removeAnnotation('data-popup');
              }, 0);
            });
          }
        };
      })();

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
          text: subtitleText, // Subtitle already includes the date and click instruction
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
          data: [],
          joinBy: 'postal-code',
          dataLabels: {
            enabled: true,
            color: 'contrast',
            style: { textTransform: 'uppercase' },
            formatter: function (this: any) {
              if (this.point.value === null) return '';
              let formattedValue: string;
              if (displayCategory === 'income' || displayCategory === 'gdp') {
                formattedValue = `${(this.point.value / 1000).toFixed(0)}k`;
              } else if (displayCategory === 'population') {
                formattedValue = `${(this.point.value / 1000000).toFixed(1)}M`;
              } else if (displayCategory === 'area') {
                formattedValue = `${(this.point.value / 1000).toFixed(0)}k`;
              } else {
                formattedValue = this.point.value.toString();
              }
              return formattedValue;
            }
          },
          name: seriesName,
          point: { events: { click: pointClick } },
          tooltip: { valueSuffix: tooltipSuffix },
          cursor: 'pointer'
        }, {
          name: 'Separators',
          type: 'mapline',
          nullColor: 'silver',
          showInLegend: false,
          enableMouseTracking: false,
          accessibility: { enabled: false }
        }]
      };

      const chartSeriesData: any[] = [];
      if (mapData?.objects?.default?.geometries) {
        mapData.objects.default.geometries.forEach((geometry: any) => {
          if (geometry?.properties?.['postal-code']) {
            const postalCode = geometry.properties['postal-code'];
            const i = allColumns.postalCodes.indexOf(postalCode);
            if (i >= 0) {
              if (singleStateCode && postalCode !== singleStateCode) {
                chartSeriesData.push(Highcharts.extend({
                  value: null,
                  name: allColumns.stateNames[i],
                  'postal-code': postalCode,
                  labelText: '',
                  row: i
                }, geometry));
              } else {
                chartSeriesData.push(Highcharts.extend({
                  value: displayValue[i],
                  name: allColumns.stateNames[i],
                  'postal-code': postalCode,
                  labelText: '',
                  row: i
                }, geometry));
              }
            }
          }
        });
      }

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
        options.series[0].data = chartSeriesData;
        this.chart7 = Highcharts.mapChart('container7', options);
      }
    })();
  }

  // Your existing filter functions remain the same
  displaySingleStateData(stateCode: string) {
    this.chartSeven('income', undefined, undefined, stateCode);
  }

  filterByQuery(queryType: 'top_income' | 'high_population' | 'all') {
    let filteredStateCodes: string[] = [];
    let querySpecificCategory: 'income' | 'population' | 'area' | 'gdp' = 'income';

    switch (queryType) {
      case 'top_income':
        filteredStateCodes = Object.keys(this.stateData)
          .sort((a, b) => this.stateData[b].income - this.stateData[a].income)
          .slice(0, 5);
        querySpecificCategory = 'income';
        break;
      case 'high_population':
        filteredStateCodes = Object.keys(this.stateData)
          .filter(code => this.stateData[code].population > 10000000);
        querySpecificCategory = 'population';
        break;
      case 'all':
      default:
        this.chartSeven('income');
        return;
    }
    this.chartSeven(querySpecificCategory);
  }

  filterByMonth(events: any) {
    const yearMonth = events.target.value;
    this.chartSeven('income', yearMonth);
  }

  filterBySixMonths(startYearMonth: string) {
    this.chartSeven('income', undefined, startYearMonth);
  }

  toggleLabels(type: 'margin' | 'state' | 'postal') {
    this.selectedView = type;
    if (!this.chart7) return;

    this.chart7.series[0].points.forEach((p: any) => {
      let newLabel = '';

      if (type === 'margin') {
        newLabel = p.options?.value?.toString() ?? '';
      } else if (type === 'state') {
        newLabel = p.options?.name ?? '';
      } else if (type === 'postal') {
        newLabel = p.options?.['postal-code'] ?? '';
      }

      p.update({ labelText: newLabel }, false); // batch update
    });

    this.chart7.redraw();
  }

  toggleLabels1(type: 'digit' | 'postal' | 'gdp') {
    this.selectedView1 = type;
    if (!this.chart8) return;

    this.chart8.series[0].points.forEach((p: any) => {
      let newLabel = '';

      if (type === 'digit') {
        newLabel = p.options?.value?.toString() ?? '';
      } else if (type === 'postal') {
        newLabel = p.options?.['postal-code'] ?? '';
      } else if (type === 'gdp') {
        newLabel = p.options?.['gdpValue'] ?? '';
      }

      p.update({ labelText: newLabel }, false); // batch update
    });

    this.chart8.redraw();
  }

  chartEight() {
    (async () => {
      const mapData = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
      ).then(response => response.json());

      interface StateInfo {
        name: string;
        income: number;
        gdp_per_capita: number;
      }

      const stateData: Record<string, StateInfo> = {
        "AL": { "name": "Alabama", "income": 60660, "gdp_per_capita": 67786 },
        "AK": { "name": "Alaska", "income": 113934, "gdp_per_capita": 95147 },
        "AZ": { "name": "Arizona", "income": 77315, "gdp_per_capita": 78201 },
        "AR": { "name": "Arkansas", "income": 63250, "gdp_per_capita": 60276 },
        "CA": { "name": "California", "income": 123988, "gdp_per_capita": 104916 },
        "CO": { "name": "Colorado", "income": 97301, "gdp_per_capita": 93026 },
        "CT": { "name": "Connecticut", "income": 114156, "gdp_per_capita": 100235 },
        "DE": { "name": "Delaware", "income": 87173, "gdp_per_capita": 98055 },
        "FL": { "name": "Florida", "income": 73311, "gdp_per_capita": 78918 },
        "GA": { "name": "Georgia", "income": 74632, "gdp_per_capita": 79435 },
        "HI": { "name": "Hawaii", "income": 141832, "gdp_per_capita": 80979 },
        "ID": { "name": "Idaho", "income": 74942, "gdp_per_capita": 68000 },
        "IL": { "name": "Illinois", "income": 80306, "gdp_per_capita": 88000 },
        "IN": { "name": "Indiana", "income": 76910, "gdp_per_capita": 70000 },
        "IA": { "name": "Iowa", "income": 71433, "gdp_per_capita": 68000 },
        "KS": { "name": "Kansas", "income": 70333, "gdp_per_capita": 70000 },
        "KY": { "name": "Kentucky", "income": 61980, "gdp_per_capita": 62000 },
        "LA": { "name": "Louisiana", "income": 57650, "gdp_per_capita": 60000 },
        "ME": { "name": "Maine", "income": 73733, "gdp_per_capita": 70000 },
        "MD": { "name": "Maryland", "income": 124693, "gdp_per_capita": 88000 },
        "MA": { "name": "Massachusetts", "income": 127760, "gdp_per_capita": 110561 },
        "MI": { "name": "Michigan", "income": 76960, "gdp_per_capita": 75000 },
        "MN": { "name": "Minnesota", "income": 86364, "gdp_per_capita": 85000 },
        "MS": { "name": "Mississippi", "income": 55060, "gdp_per_capita": 53061 },
        "MO": { "name": "Missouri", "income": 78290, "gdp_per_capita": 72000 },
        "MT": { "name": "Montana", "income": 70804, "gdp_per_capita": 68000 },
        "NE": { "name": "Nebraska", "income": 74590, "gdp_per_capita": 93145 },
        "NV": { "name": "Nevada", "income": 80366, "gdp_per_capita": 75000 },
        "NH": { "name": "New Hampshire", "income": 110205, "gdp_per_capita": 87000 },
        "NJ": { "name": "New Jersey", "income": 117847, "gdp_per_capita": 89000 },
        "NM": { "name": "New Mexico", "income": 60980, "gdp_per_capita": 61000 },
        "NY": { "name": "New York", "income": 91366, "gdp_per_capita": 117332 },
        "NC": { "name": "North Carolina", "income": 70804, "gdp_per_capita": 75000 },
        "ND": { "name": "North Dakota", "income": 76525, "gdp_per_capita": 95982 },
        "OH": { "name": "Ohio", "income": 73770, "gdp_per_capita": 70000 },
        "OK": { "name": "Oklahoma", "income": 67330, "gdp_per_capita": 65000 },
        "OR": { "name": "Oregon", "income": 91100, "gdp_per_capita": 80000 },
        "PA": { "name": "Pennsylvania", "income": 73824, "gdp_per_capita": 75000 },
        "RI": { "name": "Rhode Island", "income": 104252, "gdp_per_capita": 78000 },
        "SC": { "name": "South Carolina", "income": 69100, "gdp_per_capita": 65000 },
        "SD": { "name": "South Dakota", "income": 71810, "gdp_per_capita": 70000 },
        "TN": { "name": "Tennessee", "income": 72700, "gdp_per_capita": 68000 },
        "TX": { "name": "Texas", "income": 75780, "gdp_per_capita": 76000 },
        "UT": { "name": "Utah", "income": 89786, "gdp_per_capita": 85000 },
        "VT": { "name": "Vermont", "income": 89695, "gdp_per_capita": 45707 },
        "VA": { "name": "Virginia", "income": 89393, "gdp_per_capita": 82000 },
        "WA": { "name": "Washington", "income": 103748, "gdp_per_capita": 108468 },
        "WV": { "name": "West Virginia", "income": 60410, "gdp_per_capita": 60783 },
        "WI": { "name": "Wisconsin", "income": 74631, "gdp_per_capita": 72000 },
        "WY": { "name": "Wyoming", "income": 72415, "gdp_per_capita": 90335 }
      };

      const postalCodes = Object.keys(stateData) as Array<keyof typeof stateData>;
      const stateNames = postalCodes.map(code => stateData[code].name);
      const medianIncomes = postalCodes.map(code => stateData[code].income);
      const gdpPerCapitas = postalCodes.map(code => stateData[code].gdp_per_capita);

      const columns = [
        postalCodes,
        stateNames,
        medianIncomes,
        gdpPerCapitas,
        [], [], [], [],
        []
      ];

      const pointClick = function (this: any) {
        const row = this.options.row;
        const chart = this.series.chart;

        chart.removeAnnotation('data-popup'); // Changed ID for clarity

        chart.addAnnotation({
          id: 'data-popup', // Changed ID for clarity
          labelOptions: {
            useHTML: true,
            backgroundColor: '#fff'
          },
          labels: [{
            point: {
              x: chart.plotWidth / 2,
              y: chart.plotHeight / 10
            },
            text: `
            <div id="annotation-container" style="width: 300px; padding: 10px; font-family: Arial;">
              <div id="annotation-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-weight: bold; font-size: 14px;">${this.name}</span>
                <button id="annotation-close-btn" style="background: none; border: none; font-weight: bold; font-size: 16px; cursor: pointer;">✕</button>
              </div>
              <div id="popup-data" style="width: 280px; height: 200px;"></div>
            </div>
          `,
            shape: 'rect'
          }],
          zIndex: 10
        });

        const pieChart = Highcharts.chart('popup-data', { // Changed ID for clarity
          chart: { type: 'pie' },
          title: { text: null },
          legend: { enabled: true, reversed: false }, // Reversed for better legend order
          navigation: { buttonOptions: { enabled: false } },
          series: [{
            name: 'Data',
            data: [
              { name: 'Median Income', color: '#4CAF50', y: columns[2][row] }, // Green for income
              { name: 'GDP per Capita', color: '#2196F3', y: columns[3][row] } // Blue for GDP
            ],
            dataLabels: { format: '{point.name}: {point.y:,.0f}' }, // Format as number with thousands separator
            showInLegend: true
          }]
        });

        const closeBtn = document.getElementById('annotation-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', function () {
            pieChart?.destroy();
            setTimeout(() => {
              chart.removeAnnotation('data-popup'); // Changed ID for clarity
            }, 0);
          });
        }
      };

      let keys = columns[0].map((key: any) => key.toUpperCase());
      const names = columns[1];
      const displayValue = columns[2];
      const gdpPerCapitasValue = columns[3];

      const options = {
        style: {
          fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
        },

        chart: {
          type: 'map',
          map: mapData,
          renderTo: 'container8',
          borderWidth: 1,
          spacingBottom: 1,
          pinchType: '',
          zoomType: '',
        },
        title: {
          text: 'US State Data: Median Income & GDP per Capita (2024)', // Updated title
          align: 'center'
        },
        subtitle: {
          text: 'Click on a state for detailed income and revenue data', // Updated subtitle
          align: 'center'
        },
        legend: {
          align: 'right',
          verticalAlign: 'top',
          x: -50,
          y: 0,
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
          dataClasses: [{
            from: 0,
            to: 65000,
            color: '#E0F2F7', // Very Light Cyan/Blue (lowest income)
            name: '< $65k (Income)'
          }, {
            from: 65001,
            to: 80000,
            color: '#B2EBF2', // Light Cyan/Blue
            name: '$65k - $80k (Income)'
          }, {
            from: 80001,
            to: 95000,
            color: '#80DEEA', // Medium Cyan/Blue
            name: '$80k - $95k (Income)'
          }, {
            from: 95001,
            to: 200000,
            color: '#4DD0E1', // Darker Cyan/Blue (highest income)
            name: '> $95k (Income)'
          }]
        },
        // credits: {
        //   enabled: false
        // },
        series: [{
          data: [] as any[],
          joinBy: 'postal-code',
          dataLabels: {
            enabled: true,
            color: 'contrast',
            style: { textTransform: 'uppercase' },
            formatter: function (this: any) {
              return this.point.labelText || '';
            }
          },
          name: 'Median Household Income',
          // point: { events: { click: pointClick } },
          tooltip: { valueSuffix: ' USD' },
          cursor: 'pointer'
        }, {
          name: 'Separators',
          type: 'mapline',
          nullColor: 'silver',
          showInLegend: true,
          enableMouseTracking: false,
          accessibility: { enabled: false }
        }]
      };

      if (mapData?.objects?.default?.geometries) {
        mapData.objects.default.geometries.forEach((geometry: any) => {
          if (geometry?.properties?.['postal-code']) {
            const postalCode = geometry.properties['postal-code'];
            const i = keys.indexOf(postalCode);
            if (i >= 0) {
              (options.series[0].data as any[]).push(Highcharts.extend({
                value: displayValue[i],
                name: names[i],
                gdpValue: gdpPerCapitasValue[i],
                'postal-code': postalCode,
                labelText: `${displayValue[i]}`,
                row: i
              }, geometry));
            }
          }
        });
      }

      this.chart8 = Highcharts.mapChart('container8', options);
    })();

  }

}
