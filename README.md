# ShopStore - Dropshipping E-commerce Platform

A modern, full-featured dropshipping e-commerce platform built with Next.js, TypeScript, MongoDB, and Tailwind CSS. Sell products from suppliers without holding inventory - orders are automatically tracked and managed.

## Features

### Customer-Facing Features
- **Product Catalog** - Browse products with search, filtering, and pagination
- **Product Details** - Detailed product pages with image galleries, pricing, and stock info
- **Shopping Cart** - Persistent cart with quantity management
- **Checkout** - Simple checkout flow with shipping address collection
- **Order Tracking** - View order status and tracking information

### Admin Features
- **Dashboard** - Overview of orders, revenue, and key metrics
- **Product Management** - Add, edit, and delete products with supplier information
- **Order Management** - View and update order statuses
- **Supplier Integration** - Import products from suppliers via API

### Dropshipping Features
- **Supplier Information** - Track supplier names, URLs, and costs per product
- **Profit Margin Tracking** - Know your cost vs. selling price
- **Order Fulfillment** - Manage supplier orders and tracking numbers
- **Inventory Sync** - Track stock levels from suppliers

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB
- **State Management**: Zustand
- **Icons**: Heroicons
- **Payment Processing**: Stripe (ready for integration)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd shopstore
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/dropshipping-store
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dropshipping-store

# Authentication (generate a random string)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Stripe (optional - for payment processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

4. **Start MongoDB** (if running locally)
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
shopstore/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── products/        # Product CRUD endpoints
│   │   ├── orders/          # Order management endpoints
│   │   └── suppliers/       # Supplier integration endpoints
│   ├── admin/               # Admin panel pages
│   ├── products/            # Product listing & detail pages
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout page
│   └── orders/              # Order confirmation pages
├── components/              # Reusable React components
├── lib/                     # Utility functions & configs
│   ├── models/             # Database models
│   ├── store/              # State management (Zustand)
│   └── mongodb.ts          # Database connection
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Usage Guide

### Adding Products

1. Navigate to `/admin` in your browser
2. Click "Add New Product"
3. Fill in product details:
   - Basic info (name, description, price)
   - Supplier info (name, URL, your cost)
   - Images (paste URLs, one per line)
   - Category and tags
4. Click "Create Product"

### Managing Orders

1. Navigate to `/admin/orders`
2. View all orders with customer details
3. Update order status from dropdown:
   - Pending → Processing → Shipped → Delivered
4. Click "View" to see full order details

### Supplier Integration

Import products from suppliers using the API:

```bash
curl -X POST http://localhost:3000/api/suppliers/import \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "name": "Product Name",
        "description": "Product Description",
        "price": 29.99,
        "supplierName": "Supplier Name",
        "supplierUrl": "https://supplier.com/product",
        "supplierPrice": 15.00,
        "images": ["https://example.com/image.jpg"],
        "category": "Electronics",
        "sku": "PROD-001",
        "stock": 100,
        "tags": ["electronics", "gadgets"]
      }
    ]
  }'
```

## API Endpoints

### Products
- `GET /api/products` - List all products (with filters & pagination)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status

### Suppliers
- `POST /api/suppliers/import` - Bulk import products
- `GET /api/suppliers/import` - Get integration info

## Deployment

### Deploy to Vercel

1. **Push code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Add environment variables

3. **Set up MongoDB Atlas** (recommended for production)
   - Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create cluster and get connection string
   - Add to Vercel environment variables

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- DigitalOcean
- AWS
- Any platform supporting Node.js

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for auth | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |

## Customization

### Changing Colors/Theme

Edit `app/globals.css` and Tailwind config for color scheme changes.

### Adding Payment Processing

1. Sign up for [Stripe](https://stripe.com)
2. Add Stripe keys to `.env.local`
3. Implement Stripe checkout in `app/checkout/page.tsx`

### Integrating with Suppliers

Common dropshipping suppliers you can integrate:
- **AliExpress** - Use AliExpress API
- **Printful** - Print-on-demand products
- **Spocket** - US/EU suppliers
- **Oberlo** - Shopify integration
- **CJ Dropshipping** - Global suppliers

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If connection fails, check your MONGODB_URI in .env.local
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for your own dropshipping business!

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the code comments for implementation details

## Roadmap

Future features planned:
- [ ] User authentication (NextAuth.js)
- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Automated supplier order placement
- [ ] Analytics dashboard
- [ ] Multi-currency support
- [ ] Inventory sync automation
- [ ] Return management system

---

Built with ❤️ for dropshipping entrepreneurs
