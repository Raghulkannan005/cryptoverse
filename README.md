# 🚀 CRYPTOVERSE

> A comprehensive cryptocurrency platform providing real-time prices, market data, and crypto news
<p align="center">
   <span style="background: linear-gradient(90deg, #FF9900, #8E2DE2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 2.5rem; font-weight: bold; text-shadow: 0px 2px 4px rgba(0,0,0,0.2);">CRYPTOVERSE DASHBOARD</span>
   <br>
   <span style="color: #3498db; font-size: 1.5rem;">📊 Track • Analyze • Invest 💰</span>
</p>

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Environment Setup](#-environment-setup)
- [Technologies](#-technologies)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Introduction

Cryptoverse is your one-stop solution for tracking the cryptocurrency market. It provides real-time cryptocurrency prices, market cap rankings, detailed coin information, and the latest crypto news. Built with a modern tech stack featuring Node.js and Express on the backend, with React and Vite powering the frontend.

## ✨ Features

### 🔐 User Authentication
- Create a new account with secure registration
- Login to access personalized features
- JWT-based authentication for security

### 📊 Cryptocurrency Data
- **Real-time tracking** of cryptocurrency prices
- Comprehensive market capitalization metrics
- In-depth trading volume information

### 📈 Detailed Coin Analytics
- Interactive historical price charts
- Complete market statistics for each cryptocurrency
- Performance metrics and historical data

### 🌐 Global Market Overview
- Total cryptocurrency count and market cap
- Exchange platform metrics and statistics
- 24-hour global trading volume

### 📰 Latest Crypto News
- Categorized news from trusted sources
- AI-powered sentiment analysis on articles
- Regularly updated content

### 📞 Contact Support
- Easy-to-use inquiry submission system
- Direct communication channels

## 🔗 Live Link

Check out the live application [here](https://cryptoverse-bca.vercel.app)

## 💻 Installation

### Prerequisites
- Node.js 14.x or higher
- MongoDB instance
- API keys for CoinLayer and NewsData

### Step-by-step Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/Raghulkannan005/cryptoverse.git
    cd cryptoverse
    ```

2. **Install dependencies**
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3. **Configure environment variables**
    - Create `.env` files in both backend and frontend directories
    - Backend `.env` example:
       ```
       MONGO_URI=mongodb://localhost:27017/cryptoverse
       PORT=5000
       COINLAYER_API_KEY=your_api_key
       NEWSDATA_API_KEY=your_api_key
       JWT_SECRET=your_secret_key
       ```
    - Frontend `.env` example:
       ```
       VITE_BACKEND_URL=http://localhost:5000/api
       ```

4. **Start development servers**
    ```bash
    # Start backend server
    cd backend
    npm run dev

    # In a new terminal, start frontend
    cd frontend
    npm run dev
    ```

5. **Access the application**  
    Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## 🛠️ Technologies

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **Axios** - API requests
- **Node-cache** - Performance optimization

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **React Router** - Navigation
- **Axios** - API client

## 📁 Project Structure

<details>
<summary>Backend Structure</summary>

```
backend/
├── controllers/
│   ├── authController.js
│   └── cryptoController.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── cacheMiddleware.js
│   └── errorMiddleware.js
├── models/
│   └── userModel.js
├── routes/
│   ├── authRoutes.js
│   └── cryptoRoutes.js
├── utils/
│   └── db.js
├── .env.example
├── package.json
├── server.js
└── vercel.json
```
</details>

<details>
<summary>Frontend Structure</summary>

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Homepage.jsx
│   │   ├── Cryptocurrencies.jsx
│   │   ├── CryptoDetails.jsx
│   │   ├── News.jsx
│   │   ├── Contact.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Navbar.jsx
│   │   └── Spinner.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── services/
│   │   ├── axiosConfig.js
│   │   ├── cryptoApi.js
│   │   └── newsApi.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
├── vite.config.js
└── tailwind.config.js
```
</details>

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
   Made with ❤️ by Raghul kannan
</p>
