import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [Header, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  sidebarVisible = true;

  constructor(public router: Router) {
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

 


}
