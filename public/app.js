let products = [];
let cart = [];

// Sample products
products = [
  { id: "pp-1", name: "Product", price: 1000, category: "Clothing", image: "images/Product.jpg" },
  { id: "pp-2", name: "Product", price: 1500, category: "Beauty", image: "images/Product.jpg" },
  { id: "pp-3", name: "Product", price: 3000, category: "Accessories", image: "images/Product.jpg" }
];

// Render products
renderProducts(products);

// PRODUCTS
function renderProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  list.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img class="product-img" src="${p.image || 'images/Product.jpg'}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${(p.price/100).toFixed(2)}</p>
        <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
      </div>
    `;
  });
} 

function showCategory(cat) {
  toggleMenu(); // close menu on selection
  if(cat === "All") renderProducts(products);
  else renderProducts(products.filter(p=>p.category===cat));
}

// MENU (LEFT)

const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
if (menuBtn) {
  menuBtn.addEventListener("click", toggleMenu);
}

function toggleMenu() {
  menu.classList.toggle("show");
}

// CART (RIGHT)
function toggleCart() {
  document.getElementById("cart").classList.toggle("show");
}

// CART LOGIC
function addToCart(product) {
  const item = cart.find(i=>i.id===product.id);
  if(item) item.quantity++;
  else cart.push({...product, quantity:1});
  updateCart();
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.quantity += delta;
  if(item.quantity <=0) cart = cart.filter(i=>i.id!==id);
  updateCart();
}

function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  updateCart();
}

function updateCart(){
  const cartDiv = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const totalDiv = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  const itemCount = cart.reduce((sum,i)=>sum+i.quantity,0);
  count.innerText = itemCount;

  if(cart.length===0){
    cartDiv.innerHTML = `<p class="empty-cart"><img src='images/bag-icon.png' alt='' class='menu-icon'> Your cart is empty</p>`;
    totalDiv.innerText = "$0.00";
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  cartDiv.innerHTML="";
  let total = 0;
  cart.forEach(i=>{
    total += i.price*i.quantity;
    cartDiv.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-title">${i.name}</div>
        <div class="cart-controls">
          <button onclick="changeQty('${i.id}',-1)">−</button>
          <span>${i.quantity}</span>
          <button onclick="changeQty('${i.id}',1)">+</button>
          <button class="remove-btn" onclick="removeItem('${i.id}')">✕</button>
        </div>
      </div>
    `;
  });
  totalDiv.innerText = `$${(total/100).toFixed(2)}`;
}

async function checkout(){
  if(cart.length===0) return;
  const res = await fetch("/create-checkout-session",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({cart})
  });
  const data = await res.json();
  window.location.href = data.url;
}

