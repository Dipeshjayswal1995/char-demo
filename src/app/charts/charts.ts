import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../pages/shared/components/sidebar/sidebar';
import { Header } from '../pages/shared/components/header/header';

@Component({
  selector: 'app-charts',
    imports: [],
  templateUrl: './charts.html',
  styleUrl: './charts.scss'
})
export class Charts {

  ngOnInit() {
    console.log('Charts - ngOnInit');
  }
}
