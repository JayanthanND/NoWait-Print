# Printer Backend

A Node.js/Express backend for the Print Shop SaaS.

## Features
- **File Upload**: Analyzes PDFs and images for page counts.
- **Pricing Engine**: dynamic pricing based on database rules (Size, Color, Sides).
- **Order Management**: Creates orders and tracks status.
- **Admin Ready**: Database schema designed for future admin panel.

## Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   The project uses SQLite for development (configured in `prisma/schema.prisma`).
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. **Start Server**:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3001`.

## API Endpoints

### Shop
- `GET /api/shop/default`: Get default shop details.

### Upload
- `POST /api/upload`: Upload files.
  - Body: `files` (multipart/form-data)
  - Returns: `files: [{ originalName, pageCount, path, ... }]`

### Pricing
- `POST /api/calculate`: Get price breakdown.
  - Body: `{ works: [ { pageSize, colorType, printSide, copies, files: [...] } ] }`

### Order
- `POST /api/order`: Create order.
  - Body: `{ shopId, mobile, works, totalAmount }`

## Frontend Integration
To connect the frontend:
1. Update `utils/pricing.ts` to call `/api/calculate` instead of local logic.
2. Update file upload components to call `/api/upload` and store the server response.
3. Update `handlePaymentSuccess` to call `/api/order`.
