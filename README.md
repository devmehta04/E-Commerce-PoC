# E-commerce PoC App

A minimalist e-commerce proof-of-concept built with React frontend and Node.js backend.

## Features

- **Admin Dashboard**: Product management with CRUD operations
- **Product Catalog**: Public-facing product display with images
- **Shopping Cart**: In-memory cart functionality
- **Image Upload**: File upload support for product images
- **Responsive Design**: Mobile-friendly black & white theme

## Tech Stack

- **Frontend**: React 18, React Router, CSS3
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: SQLite (for PoC simplicity)
- **File Storage**: Local file system with static serving

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

This will start:
- Backend API server on `http://localhost:5050`
- Frontend React app on `http://localhost:3000`

### Alternative Commands

- **Backend only:** `npm run backend`
- **Frontend only:** `npm run frontend`
- **Production build:** `npm run build`
- **Production start:** `npm start`

## Project Structure

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main app component
│   └── package.json
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── lib/            # Shared libraries
│   │   └── server.js       # Express server
│   ├── prisma/             # Database schema & migrations
│   └── uploads/            # Uploaded image files
└── package.json            # Root package with scripts
```

## API Endpoints

### Products
- `GET /api/products` - List products (admin, paginated)
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Public
- `GET /api/public/products` - List master products (public, paginated)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/clear` - Clear cart

### Upload
- `POST /api/upload` - Upload image file

## Database Schema

The app uses Prisma with SQLite and includes:
- **Product**: name, brand, size, pricing, stock, images
- **Category**: product categorization
- **Cart**: in-memory shopping cart

## Development

### Adding New Features
1. Create components in `frontend/src/components/`
2. Add pages in `frontend/src/pages/`
3. Create API routes in `backend/src/routes/`
4. Update database schema in `backend/prisma/schema.prisma`

### Database Changes
```bash
cd backend
npm run prisma:migrate    # Create migration
npm run prisma:generate   # Update Prisma client
npm run prisma:seed       # Seed sample data
```

### File Uploads
- Images are stored in `backend/uploads/`
- Served statically at `/uploads/` endpoint
- Supported formats: JPEG, PNG, GIF, WebP
- Max file size: 5MB

## Troubleshooting

### Images Not Displaying
1. Check backend is running on port 5050
2. Verify upload directory exists: `backend/uploads/`
3. Check browser console for CORS errors
4. Test image URL directly: `http://localhost:5050/uploads/filename`

### Cart Issues
- Cart is in-memory (resets on server restart)
- Use consistent `clientId` for persistent cart

### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

## License

ISC License
