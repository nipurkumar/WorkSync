# 🚀 WorkSync – Decentralized Job Coordination Platform

WorkSync is a Web3-powered decentralized application (DApp) designed to simplify job listings, candidate hiring, and profile management using blockchain technology. It enables secure, trustless hiring workflows through smart contracts and wallet-based authentication.

---

## 🌟 Features

- 🔐 *Web3 Wallet Integration* (MetaMask)
- 🧑‍💼 *Job Seeker and Recruiter Profiles*
- 📋 *Smart Contract-based Job Posting & Hiring*
- ✅ *Secure and Transparent Workflow*
- 📈 *Real-time Dashboard and User Stats*
- ⚙ *On-chain Data with Ethereum (via Web3.js)*

---

## 🛠 Tech Stack

| Layer        | Technologies                         |
|--------------|--------------------------------------|
| Frontend     | React.js, Tailwind CSS, Vite         |
| Blockchain   | Solidity, Truffle, Ethereum, Web3.js |
| Wallet       | MetaMask, WalletConnect              |
| State Logic  | React Hooks, Custom Hooks            |
| Dev Tools    | VS Code, Git, GitHub                 |

---

## 📁 Folder Structure

```bash
WorkSync/
│
├── contracts/               # Smart Contracts (Solidity)
├── migrations/              # Truffle migration scripts
├── src/                     # React source code
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React Hooks for Web3
│   ├── pages/               # Page-level views (Dashboard, JobList)
│   ├── styles/              # Tailwind CSS
│   ├── utils/               # Helper & encryption files
│   ├── web3/                # Web3 contract config
│   └── App.jsx              # Main App entry
├── .env                     # Environment variables (ignored)
├── .gitignore               # Git ignore rules
├── package.json             # Project metadata and scripts
├── tailwind.config.js       # Tailwind CSS config
└── README.md                # This file


⸻

⚙ Setup & Installation

1. Clone the Repository

git clone https://github.com/nipurkumar/WorkSync.git
cd WorkSync

2. Install Dependencies

npm install

3. Set Up Environment Variables

Create a .env file in the root directory and add:

REACT_APP_CONTRACT_ADDRESS=0xYourSmartContractAddress
REACT_APP_RPC_URL=https://your-ethereum-rpc-url

⚠ .env is included in .gitignore and will not be pushed to GitHub.

4. Compile Smart Contracts

If you’re using Truffle:

truffle compile

5. Start the Development Server

npm run dev

Your app will be running at http://localhost:5173.

⸻

🧪 Deployment Suggestions
	•	Frontend: Vercel, Netlify, or GitHub Pages
	•	Smart Contracts: Deploy via Truffle to Goerli, Sepolia, or Mainnet

⸻

🤝 Contributing

Contributions are welcome! To contribute:
	1.	Fork the repository
	2.	Create your feature branch (git checkout -b feature/YourFeature)
	3.	Commit your changes (git commit -m 'Add YourFeature')
	4.	Push to the branch (git push origin feature/YourFeature)
	5.	Open a pull request

⸻

📄 License

MIT License. See LICENSE file for details.

⸻

👨‍💻 Author

Made with 💙 by Team WorkSync

---

### 📌 Tips:
- Replace contract or RPC URLs with real values in .env, .env.local if you're sharing setup with others.
- Add a LICENSE file (MIT or other) if you plan to open-source it officially.
