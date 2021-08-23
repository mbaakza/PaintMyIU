import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorApiService {

  constructor(private http: HttpClient) { }

  getColorData(hex:string): Observable<any>{
  
  let clean = hex.substring(1); // remove #
  let url:string =
      `http://thecolorapi.com/id?hex=${clean}`;
  url = encodeURIComponent(url);
  url = `https://stylisticweb.com/getColorData.php?url=${url}`;
  console.log(url);

   return this.http.get(url);
  }
}