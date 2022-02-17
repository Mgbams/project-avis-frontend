import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Layout } from '../layout.model';
import { HomePageService } from '../services/home-page.service';
import { Game } from '../model/game.model';
import { Pageable } from '../model/pageable.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  cardsLayout!: Observable<Layout>;
  games: Game[] = [];
  msgError = '';
  totalElements = 0;
  totalPages = 0;
  pageable: Pageable[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private homePageService: HomePageService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getGames();

    this.cardsLayout = merge(
      this.breakpointObserver
        .observe([
          Breakpoints.Handset,
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
        ])
        .pipe(
          map(({ matches }) => {
            if (matches) {
              console.debug('👉🏽 handset layout activated');
              return this.getHandsetLayout();
            }
            return this.getTabletLayout();
          })
        ),
      this.breakpointObserver.observe(Breakpoints.Tablet).pipe(
        map(({ matches }) => {
          if (matches) {
            return this.getTabletLayout();
          }
          return this.getTabletLayout();
        })
      ),
      this.breakpointObserver.observe(Breakpoints.Web).pipe(
        map(({ matches }) => {
          if (matches) {
            return this.getWebLayout();
          }
          return this.getTabletLayout();
        })
      )
    );
  }

  getHandsetLayout(): Layout {
    return {
      name: 'Handset',
      gridColumns: 1,
      cols: 1,
      rows: 1,
    };
  }

  getTabletLayout(): Layout {
    return {
      name: 'Tablet',
      gridColumns: 4,
      cols: 2,
      rows: 1,
    };
  }

  getWebLayout(): Layout {
    return {
      name: 'Web',
      gridColumns: 6,
      cols: 2,
      rows: 1,
    };
  }

  getGames(): void {
    this.homePageService.getGames().subscribe(
      (data) => {
        this.games = data['content'];
        this.pageable = data['pageable'];
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
      },
      (error) => (this.msgError = error)
    );
  }

  moreDetails(id: number): void {
    const updateId = Number(id);
    this.route.navigate(['/gameDescription', updateId]);
  }
}
