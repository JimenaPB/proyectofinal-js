const productList = document.getElementById('product-list');
const cart = document.getElementById('cart');
const checkoutButton = document.getElementById('checkout-button');
checkoutButton.addEventListener('click', handleCheckout);
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(product => {
      const productItem = createProductItem(product);
      productList.appendChild(productItem);
    });
  });
function createProductItem(product) {
  const productItem = document.createElement('div');
  productItem.className = 'product';
  const image = document.createElement('img');
  image.src = product.image;
  productItem.appendChild(image);
  const title = document.createElement('h3');
  title.textContent = product.name;
  productItem.appendChild(title);
  const price = document.createElement('p');
  price.textContent = `Precio: $${product.price}`;
  productItem.appendChild(price);
  const addButton = document.createElement('button');
  addButton.textContent = 'Añadir al carrito';
  addButton.addEventListener('click', () => addToCart(product));
  productItem.appendChild(addButton);
  return productItem;
}
function addToCart(product) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const existingItem = cartItems.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCart();
}
function removeFromCart(itemId) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    cartItems[itemIndex].quantity--;
    if (cartItems[itemIndex].quantity === 0) {
      cartItems.splice(itemIndex, 1);
    }
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCart();
}
function updateCart() {
  cart.innerHTML = '';
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  if (cartItems.length === 0) {
    const emptyCart = document.createElement('p');
    emptyCart.textContent = 'No hay productos en el carrito.';
    cart.appendChild(emptyCart);
  } else {
    cartItems.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      const itemInfo = document.createElement('div');
      const title = document.createElement('h4');
      title.textContent = item.name;
      itemInfo.appendChild(title);
      const quantity = document.createElement('p');
      quantity.textContent = `Cantidad: ${item.quantity}`;
      itemInfo.appendChild(quantity);
      cartItem.appendChild(itemInfo);
      const price = document.createElement('p');
      price.textContent = `Precio: $${item.price * item.quantity}`;
      cartItem.appendChild(price);
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Eliminar';
      removeButton.addEventListener('click', () => removeFromCart(item.id));
      cartItem.appendChild(removeButton);
      cart.appendChild(cartItem);
    });
  }
  updateTotal();
}
function updateTotal() {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalElement = document.createElement('p');
  totalElement.className = 'total';
  totalElement.textContent = `Total: $${totalPrice}`;
  cart.appendChild(totalElement);
}
updateCart();
function handleCheckout() {
  localStorage.removeItem('cartItems');
  updateCart();
  Swal.fire({
    title: '¡Compra finalizada!',
    text: '¡Gracias por tu compra!',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}
const clearCartButton = document.getElementById('clear-cart-button');
clearCartButton.addEventListener('click', () => {
  localStorage.removeItem('cartItems');
  updateCart();
});



