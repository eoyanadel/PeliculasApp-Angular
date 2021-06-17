import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { MovieResponse } from '../interfaces/movie-response';
import { CreditsResponse, Cast } from '../interfaces/credits-response';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  public cargando = false;

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  get params() {
    return {
      api_key: 'ENTER_HERE_YOUR_APIKEY',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    };
  }


  resetCarteleraPage(): void {
    this.carteleraPage = 1;
  }


  getCartelera(): Observable<Movie[]> {

    if (this.cargando) {
      // Cargando peliculas
      return of([]);
    }

    this.cargando = true;

    return this.http.get<CarteleraResponse>(`${ this.baseUrl }/movie/now_playing`, {
      params: this.params
    }).pipe(
      map( (resp) => resp.results),
      tap( () => {
        this.carteleraPage += 1;
        this.cargando = false;
      })
    );
  }


  buscarPeliculas(texto: string): Observable<Movie[]> {

    const params = { ...this.params, page: '1', query: texto };

    // https://api.themoviedb.org/3/search/movie
    return this.http.get<CarteleraResponse>(`${ this.baseUrl }/search/movie`, {
      params
    }).pipe(
      map(resp => resp.results)
    );

  }


  getPeliculaDetalle(id: string): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${ this.baseUrl }/movie/${ id }`, {
      params: this.params
    }).pipe(
      catchError(err => of(null))
    );
  }


  getCast(id: string): Observable<Cast[]> {

    return this.http.get<CreditsResponse>(`${ this.baseUrl }/movie/${ id }/credits`, {
      params: this.params
    }).pipe(
      map(resp => resp.cast),
      catchError(err => of([]))
    );
  }


}
