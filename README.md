# 🥬 FreshMart Management System

A simple, browser-based management system for a grocery store. It covers inventory, point-of-sale checkout, sales history and store reports, all in plain HTML, CSS and JavaScript. No installation, backend or database is needed.

---


### Dashboard
Store overview with total products, total stock, low-stock count, today's revenue, low-stock alerts and recent sales.

<img width="1465" height="851" alt="Screenshot 2026-09-28 065954" src="https://github.com/user-attachments/assets/ff484fd3-c6c5-4a78-8736-1b3a44d0c396" />


### Inventory
Product table with search, category filter, stock status badges and a delete option.



### Add Product
Pop-up form for adding a new product.

<img width="1461" height="846" alt="Screenshot 2026-09-28 070105" src="https://github.com/user-attachments/assets/f5d59ba2-9671-48ec-a71f-d15c9004b726" />


### Point of Sale
Click products to build a cart, see subtotal, tax and total, then complete the sale.

<img width="1470" height="845" alt="Screenshot 2026-09-28 070028" src="https://github.com/user-attachments/assets/23fb280d-cee0-4f0d-a666-68173e8a3bbd" />


### Sales History
A list of every completed transaction with receipt number, date, items and total.

<img width="1470" height="841" alt="Screenshot 2026-09-28 070038" src="https://github.com/user-attachments/assets/d5a40ebc-e260-46fe-a190-ceca1026c383" />


### Reports
Total sales, revenue, average sale and inventory value.

<img width="1463" height="840" alt="Screenshot 2026-09-28 070052" src="https://github.com/user-attachments/assets/ccda865c-d88d-403b-9dbb-7bde4ed09d5e" />


---

## ✨ Features

- **Dashboard**: live stats for products, stock, low-stock items and today's revenue
- **Inventory management**: add and delete products, search by name or category, filter by category
- **Stock status badges**: *In stock*, *Low stock* and *Out of stock*, based on each product's low-stock limit
- **Point of Sale**: product search, cart with quantities, automatic 8% tax, and stock checks so you can't sell more than is available
- **Automatic stock updates**: completing a sale reduces stock right away
- **Sales history**: every sale gets a receipt number (e.g. `FM-123456`) and a timestamp
- **Reports**: total sales, total revenue, average sale value and inventory value
- **Responsive layout**: sidebar collapses behind a menu button on small screens
- **Saved in the browser**: data is stored with `localStorage`, so it stays after a refresh

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks or libraries)

## 📁 Project Structure

```
FreshMart-management-system-/
├── index.html        # App layout and all pages
├── css/
│   └── style.css     # Styling
├── js/
│   └── app.js        # App logic (inventory, POS, sales, reports)
├── images/           # README screenshots
└── README.md
```

## 🚀 How to Run

1. Clone the repository
   ```bash
   git clone https://github.com/UsmanAhmad581/FreshMart-management-system-.git
   ```
2. Open the folder and double-click `index.html` to open it in your browser.

That's it. No build step or server required.

## 📝 Notes

- Data is saved only in your own browser (`localStorage`). Clearing site data will reset the app to its default sample products.
- The app starts with six sample products (Fresh Milk, Bananas, White Bread, Mineral Water, Potato Chips, Tomatoes).

## 🔮 Future Improvements

- Edit existing products
- Best-selling products report
- Login and user roles
- Export sales and reports to CSV or PDF
- Connect to a real backend and database

## 👤 Author

**Usman Ahmad**
GitHub: [@UsmanAhmad581](https://github.com/UsmanAhmad581)
