let arrayProductos;
let arrayProductosFiltrados;
const container = document.getElementById("product_container");
const containerCards = document.querySelector(".container-cards");
const menu = document.querySelector(".menu");
const cartCount = document.querySelector(".cart-count");

const formBusqueda = document.querySelector("#form-busqueda");

getCartProducts = window.localStorage.getItem("cartProducts");
let productosExists = getCartProducts ? JSON.parse(getCartProducts) : [];

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
        <button onclick="functionAddItemToCart(${JSON.stringify(producto)
          .replace(/'/g, "")
          .replace(
            /"/g,
            "'"
          )})" id="btnAgregarAlCarrito">Agregar al carrito</button>
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

//load cart content
const cartContainer = document.getElementById("carrito");
const cartItemList = document.getElementById("lista-carrito");
const cartElementsContainer = document.getElementById("cartElements");
const btnDeleteCartItems = document.getElementById("vaciar-carrito");

const formatNameArticleCart = (name) => {
  const shortValue = name.slice(0, 35);
  if (shortValue.length > 34) {
    return shortValue + "...";
  } else {
    return name;
  }
};

const listarElementosCarrito = (array) =>
  array?.map((item) => {
    const { id, image, name, price } = item;
    return `
      <tr>
        <th><img src="${image}"></th>
        <th><h3>${formatNameArticleCart(name)}</h3></th>
        <th><p>$${price}</p></th>
        <th><button onclick="deleteItemInCart(${id})" id="deleteItemCart"><i class="fa-solid fa-trash"></i></button></th>
      </tr>
      `;
  });

const itemsCart = listarElementosCarrito(productosExists);
cartElementsContainer.innerHTML = itemsCart.join("");

const btnDeleteItemCart = document.getElementById("deleteItemCart");

const deleteItemInCart = (value) => {
  for (let i = 0; i < productosExists.length; i++) {
    if (productosExists[i].id === value) {
      productosExists.splice(i, 1);
    }
  }
  localStorage.setItem("cartProducts", JSON.stringify(productosExists));
  const respuesta = listarElementosCarrito(productosExists);
  cartElementsContainer.innerHTML = respuesta.join("");

  return productosExists;
};

btnDeleteCartItems.addEventListener("click", () => {
  const respuesta = [];
  cartElementsContainer.innerHTML = respuesta.join("");
  window.localStorage.setItem("cartProducts", JSON.stringify([]));
  return (productosExists = []);
});

const functionAddItemToCart = (producto) => {
  const productosExists = window.localStorage.getItem("cartProducts");
  const products = productosExists ? JSON.parse(productosExists) : [];
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === producto.id) return;
  }
  const newArrayValues = [...products, producto];
  window.localStorage.setItem("cartProducts", JSON.stringify(newArrayValues));

  const respuesta = listarElementosCarrito(newArrayValues);
  cartElementsContainer.innerHTML = respuesta.join("");
};

document.addEventListener("DOMContentLoaded", async () => {
  formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();
    const busqueda = document.querySelector("#busqueda").value;
    valorBusqueda = busqueda;
    renderizarProductos();
  });
  renderizarProductos();
});
