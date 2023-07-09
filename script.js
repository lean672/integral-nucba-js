
let arrayProductos 
let arrayProductosFiltrados
const container = document.getElementById("product_container");
const containerCards = document.querySelector(".container-cards");

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const cartCount = document.querySelector(".cart-count");

const formBusqueda = document.querySelector("#form-busqueda")

let cartItems = 0;

const url = "https://shoes-collections.p.rapidapi.com/shoes/";
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": "af56895e11msh39ccf3991e02f47p140f9cjsn9071d5e96093",
  },
};
const request = new Request(url, options);

let valorBusqueda



const obtenerProducto = () => {
  if (localStorage.getItem("productos")) {
    const productos = JSON.parse(localStorage.getItem("productos"))
    return arrayProductos = productos

  } else {
    fetch(request)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        // Manipular la respuesta en formato JSON
        console.log({data});
        localStorage.setItem("productos", JSON.stringify(data));
         arrayProductos = data
      })
      .catch((error) => {
        // Manejar errores
        console.error(error);
      });
    
  }
};



const listarProducto = (array) => (
  array?.map((producto) => {
    return (`
      <div class="zapatilla_p" >
        <img  src="${producto.image}">
        <div class="zapatilla-content"></div>       
        <h3>${producto.name}</h3>
        <p>$${producto.price}</p>
      </div>
      `
    )
  })
)


const renderizarProductos = () => {
  obtenerProducto()

  if(!valorBusqueda){
    arrayProductosFiltrados = arrayProductos
    listarProducto(arrayProductosFiltrados)
  } else {
    arrayProductosFiltrados = arrayProductos.filter((producto) => producto.name.toLowerCase().includes(valorBusqueda.toLowerCase()))
    listarProducto(arrayProductosFiltrados)
  }
  let respuesta

  if(arrayProductosFiltrados.length < 1) {
    respuesta = `<h2>No hay productos</h2>`
    return containerCards.innerHTML = respuesta
  } else {
     respuesta = listarProducto(arrayProductosFiltrados)
     return containerCards.innerHTML = respuesta.join("")
  }
}




document.addEventListener("DOMContentLoaded", async () => {
  formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault()
    const busqueda = document.querySelector("#busqueda").value
     valorBusqueda = busqueda
     renderizarProductos()
  })
  renderizarProductos()
});
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open");
  menu.classList.toggle("open");
});



menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Simular la adición de un producto al carrito
function addToCart() {
  cartItems++;
  cartCount.textContent = cartItems;
}



const zapatillaItems = document.querySelectorAll(".zapatilla-item");

zapatillaItems.forEach((item) => {
  const description = item.querySelector("h4");

  item.addEventListener("mouseover", () => {
    zapatillaItems.forEach((item) => {
      item.classList.remove("active");
      const description = item.querySelector("h4");
      description.style.display = "none";
    });

    if (item.classList.contains("active")) {
      item.classList.remove("active");
      description.style.display = "none";
    } else {
      item.classList.add("active");
      description.style.display = "block";
      item.addEventListener("mouseout", () => {
        item.classList.remove("active");
        const description = item.querySelector("h4");
        description.style.display = "none";
      });
    }
  });
});

//carrito
const carrito = document.getElementById("carrito");
const elementos = document.getElementById("lista");
const elementos2 = document.getElementById("lista-2");
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

cargarEventListeners();

function cargarEventListeners() {
  elementos.addEventListener("click", comprarElemento);
  elementos2.addEventListener("click", comprarElemento);

  carrito.addEventListener("click", eliminarElemento);

  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

  document.addEventListener("DOMContentLoaded", leerLocalStorage)
}

function comprarElemento(e) {
  e.preventDefault();
  if(e.target.classList.contains("agregar-carrito")){
    const elemento = e.target.parentElement.parentElement;
    leerDatosElemento(elemento);
  }
}

function leerDatosElemento(elemento) {
  const infoElemento = {
    imagen : elemento.querySelector("img").src,
    titulo: elemento.querySelector("h3").textContent,
    precio: elemento.querySelector(".precio").textContent,
    id: elemento.querySelector("a").getAttribute("data-id")
  }
  insertarCarrito(infoElemento);
}
function insertarCarrito(infoElemento) {
  const row = document.createElement("tr");
  row.innerHTML = `
  <td>
   <img src="${elemento.imagen}" width=100>
  </td>

  <td>
    ${elemento.titulo}
  </td>
  <td>
   ${elemento.precio}
  </td>
  <td>
   <a href="#" class="borrar" data-id="${elemento.id}>x</a>
  </td>

  `;
  lista.appendChild(row);
  guardarElementoLocalStorage(elemento);

}

function eliminarElemento(e) {
  e.preventDefault();

  let elemento,
    elementoId;
    if (e.target.classList.contains("borrar")){
      e.target.parentElement.parentElement.remove();
      elemento = e.target.parentElement.parentElement;
      elementoId = elemento.querySelector("a").getAttribute("data-id");

    }

    eliminarElementoLocalStorage(elementoId)

}

function vaciarCarrito(){
  while(lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }

  vaciarLocalStorage();
  return false;
}

function guardarElementoLocalStorage(elemento){
  let elementos;
  elementos = obtenerElementoLocalStorage();
  elementos.push(elemento);
  localStorage.setItem("elementos", JSON.stringify(elementos));
}

function obtenerElementoLocalStorage(){
  let elementosLS;
  if(localStorage.getItem("elementos") === null ) {
    elementosLS = [];

  } else {
    elementosLS = JSON.parse(localStorage.getItem("elementos"));
    return elementosLS;
  }
}
function leerLocalStorage(){
  let elementosLS;
  elementosLS = obtenerElementoLocalStorage();
  elementosLS.forEach(function(elemento){
    const row = document.createElement("tr");
  row.innerHTML = `
  <td>
   <img src="${elemento.imagen}" width=100>
  </td>

  <td>
    ${elemento.titulo}
  </td>
  <td>
   ${elemento.precio}
  </td>
  <td>
   <a href="#" class="borrar" data-id="${elemento.id}>x</a>
  </td>

  `;
  lista.appendChild(row);
  })
}

function eliminarElementoLocalStorage(elemento){
  let elementosLS
  elementosLS = obtenerElementoLocalStorage();
  elementosLS.forEach(function(elementosLS, index){
    if(elementosLS.id === elemento){
      elementosLS.splice(index, 1);
    }
    
  } );
  localStorage.setItem("elementos", JSON.stringify(elementosLS) );

}

function vaciarLocalStorage(){
  localStorage.clear();
}