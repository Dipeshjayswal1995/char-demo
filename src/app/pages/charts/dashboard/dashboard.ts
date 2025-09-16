import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SplitAreaComponent, SplitAreaSize, SplitComponent, SplitGutterInteractionEvent } from 'angular-split';
import { CommonModule } from '@angular/common';

// Interfaces and default configuration
interface IConfig {
  columns: Array<{
    visible: boolean;
    size: SplitAreaSize;
    rows: Array<{
      visible: boolean;
      size: SplitAreaSize;
      type: string;
    }>;
  }>;
  disabled: boolean;
}

const defaultConfig: IConfig = {
  columns: [
    {
      visible: true,
      size: 25,
      rows: [
        { visible: true, size: 25, type: 'A' },
        { visible: true, size: 75, type: 'B' },
      ],
    },
    {
      visible: true,
      size: 50,
      rows: [
        { visible: true, size: 60, type: 'doc' },
        { visible: true, size: 40, type: 'C' },
      ],
    },
    {
      visible: true,
      size: 25,
      rows: [
        { visible: true, size: 20, type: 'D' },
        { visible: true, size: 30, type: 'E' },
        { visible: true, size: 50, type: 'F' },
      ],
    },
  ],
  disabled: false,
};

@Component({
selector: 'app-dashboard',
  standalone: true,
  imports: [SplitComponent, SplitAreaComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  localStorageName = 'angular-split-ws';
  config: IConfig | null = null;

  ngOnInit() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(this.localStorageName)) {
      try {
        this.config = JSON.parse(localStorage.getItem(this.localStorageName) as string);
      } catch (e) {
        console.error("Could not parse local storage configuration, resetting to default.", e);
        this.resetConfig();
      }
    } else {
      this.resetConfig();
    }
  }

  resetConfig() {
    this.config = structuredClone(defaultConfig);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.localStorageName);
    }
  }

  onDragEnd(columnIndex: number, e: SplitGutterInteractionEvent) {
    if (!this.config) return;

    if (columnIndex === -1) {
      // Horizontal drag (columns)
      this.config.columns.filter((c) => c.visible).forEach((column, index) => (column.size = e.sizes[index]));
    } else {
      // Vertical drag (rows within a column)
      this.config.columns[columnIndex].rows
        .filter((r) => r.visible)
        .forEach((row, index) => (row.size = e.sizes[index]));
    }
    this.saveLocalStorage();
  }

  toggleDisabled() {
    if (!this.config) return;
    this.config.disabled = !this.config.disabled;
    this.saveLocalStorage();
  }

  refreshColumnVisibility(column: IConfig['columns'][number]) {
    column.visible = column.rows.some((row) => row.visible === true);
    this.refreshColumnSizes(column);
    this.saveLocalStorage();
  }

  addWidget(columnIndex: number) {
    if (!this.config) return;

    const column = this.config.columns[columnIndex];
    const newWidget = {
      visible: true,
      size: 0,
      type: `New Widget ${column.rows.length + 1}`
    };
    
    column.rows.push(newWidget);
    this.refreshColumnSizes(column);
    this.saveLocalStorage();
  }

  private refreshColumnSizes(column: IConfig['columns'][number]) {
    const visibleRows = column.rows.filter(r => r.visible);
    if (visibleRows.length > 0) {
      const newSize = 100 / visibleRows.length;
      visibleRows.forEach(r => r.size = newSize);
    }
  }

  saveLocalStorage() {
    if (typeof localStorage !== 'undefined' && this.config) {
      localStorage.setItem(this.localStorageName, JSON.stringify(this.config));
    }
  }
}