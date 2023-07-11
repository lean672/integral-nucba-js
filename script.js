let arrayProductos;
let arrayProductosFiltrados;
const container = document.getElementById("product_container");
const containerCards = document.querySelector(".container-cards");
const menu = document.querySelector(".menu");
const cartCount = document.querySelector(".cart-count");

const formBusqueda = document.querySelector("#form-busqueda");

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

let valorBusqueda;

const obtenerProducto = () => {
  if (localStorage.getItem("productos")) {
    const productos = JSON.parse(localStorage.getItem("productos"));
    return (arrayProductos = productos);
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
        console.log({ data });
        localStorage.setItem("productos", JSON.stringify(data));
        arrayProductos = data;
      })
      .catch((error) => {
        // Manejar errores
        console.error(error);
      });
  }
};

const listarProducto = (array) =>
  array?.map((producto) => {
    return `
      <div class="zapatilla_p" >
        <img  src="${producto.image}">
        <div class="zapatilla-content"></div>       
        <h3>${producto.name}</h3>
        <p>$${producto.price}</p>
        <button id="btnAgregarAlCarrito">Agregar al carrito</button>
      </div>
      `;
  });

const renderizarProductos = () => {
  obtenerProducto();

  if (!valorBusqueda) {
    arrayProductosFiltrados = arrayProductos;
    listarProducto(arrayProductosFiltrados);
  } else {
    arrayProductosFiltrados = arrayProductos.filter((producto) =>
      producto.name.toLowerCase().includes(valorBusqueda.toLowerCase())
    );
    listarProducto(arrayProductosFiltrados);
  }
  let respuesta;

  if (arrayProductosFiltrados.length < 1) {
    respuesta = `<h2>No hay productos</h2>`;
    return (containerCards.innerHTML = respuesta);
  } else {
    respuesta = listarProducto(arrayProductosFiltrados);
    return (containerCards.innerHTML = respuesta.join(""));
  }
};

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

const arrayCartItems = [
  {
    id: 1,
    imagen: "",
    nombre: "no se",
    precio: 50,
  },
  {
    id: 2,
    imagen: "",
    nombre: "no se 2",
    precio: 30,
  },
  {
    id: 3,
    imagen: "",
    nombre: "no se 3",
    precio: 10,
  },
];

//load cart content
const cartContainer = document.getElementById("carrito");
const cartItemList = document.getElementById("lista-carrito");
const cartElementsContainer = document.getElementById("cartElements");
const btnDeleteItemCart = document.querySelectorAll("#deleteItemCart");

cartContainer.addEventListener("mouseover", () => {
  console.log({ cartContainer });
});

const listarElementosCarrito = (array) =>
  array?.map((item) => {
    const { id, imagen, nombre, precio } = item;
    return `
      <tr>
        <th><img src="${imagen}"></th>
        <th><h3>${nombre}</h3></th>
        <th><p>$${precio}</p></th>
        <th><button id="deleteItemCart"><i class="fa-solid fa-trash"></i></button></th>
      </tr>
      `;
  });

const itemsCart = listarElementosCarrito(arrayCartItems);
cartElementsContainer.innerHTML = itemsCart.join("");

document.addEventListener("DOMContentLoaded", async () => {
  formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    const busqueda = document.querySelector("#busqueda").value;
    valorBusqueda = busqueda;
    renderizarProductos();
  });
  renderizarProductos();
});
