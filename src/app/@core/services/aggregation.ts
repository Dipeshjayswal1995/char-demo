import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Aggregation {


  aggregate(values: number[], type: string): number | string {
    switch (type) {
      case "Count":
        return values.length;

      case "Count Distinct":
        return new Set(values).size;

      case "Sum":
        return values.reduce((a: number, b: number) => a + b, 0);

      case "Min":
        return Math.min(...values);

      case "Max":
        return Math.max(...values);

      case "Average":
        return values.reduce((a: number, b: number) => a + b, 0) / values.length;

      case "Median":
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
          ? sorted[mid]
          : (sorted[mid - 1] + sorted[mid]) / 2;

      case "Mode":
        const freq: Record<number, number> = {};
        values.forEach(v => freq[v] = (freq[v] || 0) + 1);
        return Number(Object.keys(freq).reduce((a, b) => freq[Number(a)] > freq[Number(b)] ? a : b));

      case "StdDev":
        const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length;
        const variance = values.reduce((sum: number, val: number) => sum + Math.pow(val - avg, 2), 0) / (values.length - 1);
        return Math.sqrt(variance);

      case "Var":
        const avgVar = values.reduce((a: number, b: number) => a + b, 0) / values.length;
        return values.reduce((sum: number, val: number) => sum + Math.pow(val - avgVar, 2), 0) / (values.length - 1);

      default:
        throw new Error("Unknown aggregation type: " + type);
    }
  }

  setoFData(data: any): void {
    console.log('Mapchart7 Component Initialized', this.aggregate([1, 2, 3, 4, 5], 'Max'));
    // const grouped = this.groupBy(salesData, 'month');

    // for (const [month, records] of Object.entries(grouped)) {
    //   const recs = records as any[];
    //   const revenues = recs.map(r => r.revenue);

    //   console.log(month, {
    //     sum: this.aggregate(revenues, "Sum"),
    //     average: this.aggregate(revenues, "Average"),
    //     max: this.aggregate(revenues, "Max")
    //   });
    // }
  }

  groupBy<T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result: Record<string, T[]>, current: T) => {
      const groupKey = String(current[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(current);
      return result;
    }, {});
  }




}
