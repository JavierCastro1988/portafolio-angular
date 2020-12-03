import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto[] = [];

  constructor( private http: HttpClient ) { 

    this.cargarProductos();

   }

  private cargarProductos(){

    return new Promise( (resolve, reject) => {

      this.http.get('https://angular-html-14156.firebaseio.com/productos_idx.json')
          .subscribe( (resp: Producto[]) => {
            this.productos = resp;
            this.cargando = false;
            resolve();
          });

    });


  }

  getProducto(id: string){

    return this.http.get(`https://angular-html-14156.firebaseio.com/productos/${id}.json`);

  }

  buscarProducto(termino:string){

    if(this.productos.length === 0){
      // Cargar productos
      this.cargarProductos().then( () => {
        // ejecutar despues de tener los productos
        //aplicar filtro
        this.filtrarProductos( termino );
      })
    } else {
      this.filtrarProductos( termino );
    }

  }

  private filtrarProductos(termino:string){

    this.productosFiltrado = []; // Purgamos el arreglo antes de cada busqueda
    termino = termino.toLowerCase(); // Pasamos el termino a minusculas

    this.productos.forEach( producto => {

      const tituloLower = producto.titulo.toLowerCase(); // Pasamos el titulo ha minusculas

      if(producto.categoria.indexOf(termino) >= 0 || tituloLower.indexOf( termino ) >= 0){ // Si el termino que se busca esta contenido en alguna parte de la propiedad categoria o titulo del producto
          this.productosFiltrado.push( producto );
      }

    });


  }

}
