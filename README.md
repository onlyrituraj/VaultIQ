# CryptoFolio - Advanced Web3 Portfolio Management

A comprehensive cryptocurrency portfolio management platform built with React, featuring real-time tracking, DeFi integration, and advanced analytics.

## 🚀 Features

- **Web3 Integration** - Connect multiple wallets and track across chains
- **Real-time Portfolio Tracking** - Live price updates and portfolio valuation
- **DeFi Protocol Support** - Interact with Uniswap, Aave, Compound, and more
- **Transaction Analytics** - Comprehensive transaction history and analytics
- **Price Alerts** - Set custom price alerts for your favorite assets
- **Market Analysis** - Advanced market data and watchlist functionality
- **Responsive Design** - Optimized for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Web3**: Wagmi, Reown AppKit, Viem
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Charts**: Recharts, D3.js
- **State Management**: Redux Toolkit
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- WalletConnect Project ID

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd cryptofolio
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID

3. **Database Setup**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration script from `supabase/migrations/20241216120000_cryptofolio_portfolio_management.sql`

4. **Start Development Server**
   ```bash
   npm start
   ```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- `user_profiles` - User account information
- `portfolios` - User portfolio containers
- `assets` - Cryptocurrency asset metadata
- `portfolio_assets` - User holdings and positions
- `transactions` - Transaction history
- `price_alerts` - User-defined price alerts

## 🔐 Authentication

- Email/password authentication
- Google OAuth integration
- Secure session management with Supabase Auth

## 🌐 Web3 Features

- Multi-wallet support (MetaMask, WalletConnect, Coinbase Wallet)
- Multi-chain support (Ethereum, Polygon, Arbitrum, Optimism, Base)
- DeFi protocol integration
- Token swapping
- NFT gallery
- Transaction tracking

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Adaptive navigation
- Touch-friendly interactions
- Progressive Web App capabilities

## 🚀 Deployment

The application is configured for easy deployment on Netlify:

```bash
npm run build
```

The build artifacts will be in the `build/` directory, ready for deployment.

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the provided migration script
3. Configure authentication providers
4. Update environment variables

### WalletConnect Setup
1. Create a project at https://cloud.walletconnect.com
2. Get your project ID
3. Add to environment variables

## 📊 Features Overview

### Portfolio Management
- Real-time portfolio valuation
- Asset allocation visualization
- Performance tracking
- Profit/loss calculations

### Transaction Analytics
- Comprehensive transaction history
- Advanced filtering and search
- Export capabilities
- Visual analytics

### Market Data
- Real-time price feeds
- Market analysis tools
- Watchlist functionality
- Price alerts

### DeFi Integration
- Yield farming opportunities
- Liquidity pool management
- Staking rewards tracking
- Protocol interaction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the database setup instructions
- Ensure all environment variables are configured
- Verify Supabase project is active

## 🔗 Links

- [Live Demo](https://cryptofolio-demo.netlify.app)
- [Supabase Documentation](https://supabase.com/docs)
- [WalletConnect Documentation](https://docs.walletconnect.com)