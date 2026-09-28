const defaultProducts = [
  { id: 1, name: "Fresh Milk", category: "Dairy", price: 2.49, stock: 24, limit: 5 },
  { id: 2, name: "Bananas", category: "Fruit", price: 1.99, stock: 8, limit: 5 },
  { id: 3, name: "White Bread", category: "Bakery", price: 2.25, stock: 3, limit: 5 },
  { id: 4, name: "Mineral Water", category: "Beverages", price: 0.99, stock: 40, limit: 10 },
  { id: 5, name: "Potato Chips", category: "Snacks", price: 2.75, stock: 0, limit: 5 },
  { id: 6, name: "Tomatoes", category: "Vegetables", price: 3.25, stock: 14, limit: 5 }
];

let products = JSON.parse(localStorage.getItem("freshmart_products")) || defaultProducts;
let sales = JSON.parse(localStorage.getItem("freshmart_sales")) || [];
let cart = [];

const $ = selector => document.querySelector(selector);

function saveData() {
  localStorage.setItem("freshmart_products", JSON.stringify(products));
  localStorage.setItem("freshmart_sales", JSON.stringify(sales));
}

function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

function todaySales() {
  const today = new Date().toDateString();

  return sales
    .filter(sale => new Date(sale.date).toDateString() === today)
    .reduce((sum, sale) => sum + sale.total, 0);
}

function status(product) {
  if (product.stock === 0) {
    return `<span class="badge out">Out of stock</span>`;
  }

  if (product.stock <= product.limit) {
    return `<span class="badge low">Low stock</span>`;
  }

  return `<span class="badge good">In stock</span>`;
}

function switchPage(pageName) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.querySelector(`#${pageName}`).classList.add("active");

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  const titles = {
    dashboard: "Dashboard",
    inventory: "Inventory",
    pos: "Point of Sale",
    sales: "Sales History",
    reports: "Reports"
  };

  $("#pageTitle").textContent = titles[pageName];
  $(".sidebar").classList.remove("open");

  renderAll();
}

function renderDashboard() {
  const lowStock = products.filter(product => product.stock <= product.limit);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  $("#statProducts").textContent = products.length;
  $("#statStock").textContent = totalStock;
  $("#statLowStock").textContent = lowStock.length;
  $("#statRevenue").textContent = money(todaySales());

  $("#lowStockList").innerHTML = lowStock.length
    ? lowStock.map(product => `
      <div class="alert-item">
        <span>${product.name}</span>
        <strong>${product.stock} remaining</strong>
      </div>
    `).join("")
    : `<div class="empty">No low-stock products.</div>`;

  const recent = sales.slice(-5).reverse();

  $("#recentSales").innerHTML = recent.length
    ? recent.map(sale => `
      <div class="sale-item">
        <span>${sale.receipt}</span>
        <strong>${money(sale.total)}</strong>
      </div>
    `).join("")
    : `<div class="empty">No sales recorded.</div>`;
}

function renderInventory() {
  const search = ($("#inventorySearch").value || "").toLowerCase();
  const category = $("#categoryFilter").value;

  const filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory = !category || product.category === category;

    return matchesSearch && matchesCategory;
  });

  $("#inventoryTable").innerHTML = filtered.length
    ? filtered.map(product => `
      <tr>
        <td><strong>${product.name}</strong></td>
        <td>${product.category}</td>
        <td>${money(product.price)}</td>
        <td>${product.stock}</td>
        <td>${status(product)}</td>
        <td>
          <button class="action-button" onclick="deleteProduct(${product.id})">
            Delete
          </button>
        </td>
      </tr>
    `).join("")
    : `<tr><td colspan="6" class="empty">No products found.</td></tr>`;
}

function renderPOS() {
  const search = ($("#posSearch").value || "").toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(search)
  );

  $("#posProducts").innerHTML = filtered.map(product => `
    <button
      class="product-card"
      onclick="addToCart(${product.id})"
      ${product.stock === 0 ? "disabled" : ""}
    >
      <strong>${product.name}</strong>
      <span>${money(product.price)}</span>
      <small>${product.stock} available</small>
    </button>
  `).join("");

  renderCart();
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product || product.stock === 0) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    if (existing.quantity >= product.stock) {
      alert("There is not enough stock available.");
      return;
    }

    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  if (!cart.length) {
    $("#cartItems").innerHTML = `<div class="empty">Cart is empty.</div>`;
  } else {
    $("#cartItems").innerHTML = cart.map(item => `
      <div class="cart-item">
        <span>
          <strong>${item.name}</strong><br>
          ${item.quantity} × ${money(item.price)}
        </span>
        <span>
          <strong>${money(item.quantity * item.price)}</strong>
          <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        </span>
      </div>
    `).join("");
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  $("#cartSubtotal").textContent = money(subtotal);
  $("#cartTax").textContent = money(tax);
  $("#cartTotal").textContent = money(total);
}

function completeSale() {
  if (!cart.length) {
    alert("Add products to the cart first.");
    return;
  }

  cart.forEach(item => {
    const product = products.find(product => product.id === item.id);
    product.stock -= item.quantity;
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  sales.push({
    receipt: `FM-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
    items: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: subtotal * 1.08
  });

  cart = [];
  saveData();
  renderAll();

  alert("Sale completed successfully.");
}

function renderSales() {
  $("#salesTable").innerHTML = sales.length
    ? sales.slice().reverse().map(sale => `
      <tr>
        <td>${sale.receipt}</td>
        <td>${new Date(sale.date).toLocaleString()}</td>
        <td>${sale.items}</td>
        <td><strong>${money(sale.total)}</strong></td>
      </tr>
    `).join("")
    : `<tr><td colspan="4" class="empty">No sales recorded.</td></tr>`;
}

function renderReports() {
  const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  $("#reportSales").textContent = sales.length;
  $("#reportRevenue").textContent = money(revenue);
  $("#reportAverage").textContent = money(sales.length ? revenue / sales.length : 0);
  $("#reportInventory").textContent = money(inventoryValue);

  const productSales = {};

  sales.forEach(sale => {
    sale.productNames?.forEach(name => {
      productSales[name] = (productSales[name] || 0) + 1;
    });
  });

  const best = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  $("#bestSellers").innerHTML = best.length
    ? best.map(([name, count]) => `
      <div class="sale-item">
        <span>${name}</span>
        <strong>${count} sold</strong>
      </div>
    `).join("")
    : `<div class="empty">Complete sales to see best sellers.</div>`;
}

function addProduct(event) {
  event.preventDefault();

  products.push({
    id: Date.now(),
    name: $("#productName").value.trim(),
    category: $("#productCategory").value,
    price: Number($("#productPrice").value),
    stock: Number($("#productStock").value),
    limit: Number($("#productLimit").value)
  });

  saveData();
  $("#productForm").reset();
  $("#productModal").classList.add("hidden");
  renderAll();

  alert("Product added successfully.");
}

function deleteProduct(id) {
  const product = products.find(item => item.id === id);

  if (!confirm(`Delete ${product.name}?`)) return;

  products = products.filter(item => item.id !== id);
  saveData();
  renderAll();
}

function renderAll() {
  renderDashboard();
  renderInventory();
  renderPOS();
  renderSales();
  renderReports();
}

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => switchPage(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => switchPage(button.dataset.go));
});

$("#inventorySearch").addEventListener("input", renderInventory);
$("#categoryFilter").addEventListener("change", renderInventory);
$("#posSearch").addEventListener("input", renderPOS);
$("#completeSale").addEventListener("click", completeSale);

$("#clearCart").addEventListener("click", () => {
  cart = [];
  renderCart();
});

$("#openProductModal").addEventListener("click", () => {
  $("#productModal").classList.remove("hidden");
});

$("#closeProductModal").addEventListener("click", () => {
  $("#productModal").classList.add("hidden");
});

$("#productForm").addEventListener("submit", addProduct);

$("#menuButton").addEventListener("click", () => {
  $(".sidebar").classList.toggle("open");
});

$("#currentDate").textContent = new Date().toLocaleDateString(
  undefined,
  {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }
);

renderAll();
