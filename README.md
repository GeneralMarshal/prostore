# Packt Commerce

A modern e-commerce platform built with Next.js 15, TypeScript, Prisma, and Tailwind CSS. Features product catalog, dark mode, responsive design, and server-side rendering.

## 🚀 Features

- **Modern Stack**: Next.js 15 with App Router and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Dark Mode**: Theme switching with next-themes
- **Responsive Design**: Mobile-first approach
- **Server-Side Rendering**: Optimized for SEO and performance
- **Product Management**: Full CRUD operations for products
- **Image Gallery**: Product image carousel
- **Shopping Cart**: Add to cart functionality
- **Stock Management**: Real-time stock tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, CSS Variables
- **Database**: PostgreSQL, Prisma ORM
- **Deployment**: Neon Database (Serverless PostgreSQL)
- **Icons**: Lucide React
- **Validation**: Zod
- **Theme**: next-themes

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/packt-commerce.git
   cd packt-commerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your database URL:

   ```env
   DATABASE_URL="your_postgresql_connection_string"
   NEXT_PUBLIC_APP_NAME="Packt Commerce"
   NEXT_PUBLIC_APP_DESCRIPTION="A modern e-commerce platform"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

```prisma
model Product {
  id          String   @id @default(dbgenerated("gen_random_uuid()"))
  name        String
  slug        String   @unique
  category    String
  images      String[]
  brand       String
  description String
  stock       Int
  price       Decimal  @db.Decimal(12, 2)
  rating      Decimal  @db.Decimal(3, 2)
  numReviews  Int      @default(0)
  isFeatured  Boolean  @default(false)
  banner      String?
  createdAt   DateTime @default(now())
}
```

## 📁 Project Structure

```
packt-commerce/
├── app/                    # Next.js App Router
│   ├── (root)/            # Route group
│   │   ├── layout.tsx     # Layout with Header/Footer
│   │   ├── page.tsx       # Home page
│   │   └── product/       # Product routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── shared/           # Shared components
│   │   ├── header/       # Header components
│   │   └── product/      # Product components
│   └── ui/               # Base UI components
├── lib/                  # Utilities and actions
│   ├── actions/          # Server actions
│   ├── constants/        # App constants
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🎨 Components

### Core Components

- **ProductList**: Grid layout for displaying products
- **ProductCard**: Individual product card with image, name, price
- **ProductPrice**: Formatted price display with superscript styling
- **ProductImages**: Image gallery with carousel functionality
- **Header**: Navigation with theme toggle and responsive menu
- **Badge**: Status indicators for stock and categories

### UI Components

- **Button**: Multiple variants (default, ghost, outline, etc.)
- **Card**: Container component for content sections
- **Badge**: Status and category indicators
- **Sheet**: Mobile navigation drawer

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run database migrations
npx prisma generate  # Generate Prisma client
npx prisma db seed   # Seed database with sample data
```

## 🌙 Dark Mode

The application supports dark mode with automatic system detection:

- **Light Mode**: Clean, bright interface
- **Dark Mode**: Dark theme with proper contrast
- **System**: Automatically follows system preference
- **Toggle**: Manual theme switching in header

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl responsive design
- **Grid Layout**: CSS Grid for product listings
- **Flexible Components**: Components adapt to screen size

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 🔐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/packt_commerce"

# App Configuration
NEXT_PUBLIC_APP_NAME="Packt Commerce"
NEXT_PUBLIC_APP_DESCRIPTION="A modern e-commerce platform"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

# Optional
LATEST_PRODUCTS_LIMIT=4
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Happy coding! 🎉**
