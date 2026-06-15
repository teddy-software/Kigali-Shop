# 🌿 KigaliStyle Shop

E-Commerce Web Application — UNILAK Final Exam Project
Course: EWA408510 | Academic Year 2025-2026
Student Reg: 23688/2024

## Live Demo
https://kigali-shop.onrender.com

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express.js
- Database: SQLite
- Container: Docker
- CI/CD: GitHub Actions
- Deployment: Render.com

## How to Run
git clone https://github.com/YOUR_USERNAME/kigali-shop.git
cd kigali-shop
npm install
npm start
Open http://localhost:3000

## Features
- Homepage with featured products
- Product listing with category filters and search
- Product detail page
- Shopping cart (add, remove, update)
- Checkout form
- Order confirmation
- Mobile responsive
- REST API backend
- SQLite database with 12 products
- Docker containerized
- GitHub Actions CI/CD pipeline

## API Endpoints
GET  /api/products
GET  /api/products/:id
GET  /api/categories
POST /api/cart
GET  /api/cart/:sessionId
PUT  /api/cart/:id
DELETE /api/cart/:id
POST /api/orders
GET  /api/orders/:id