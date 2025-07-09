const FreelancingPlatform = artifacts.require("FreelancingPlatform");
const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network, accounts) {
  const [owner, user1, user2] = accounts;

  console.log("=".repeat(50));
  console.log("DEPLOYING FREELANCING PLATFORM");
  console.log("=".repeat(50));

  try {
    // Deploy contract
    console.log("\n1. Deploying FreelancingPlatform contract...");
    await deployer.deploy(FreelancingPlatform);
    const contract = await FreelancingPlatform.deployed();

    console.log("✅ Contract deployed at:", contract.address);

    // Verify deployment
    console.log("\n2. Verifying deployment...");
    const platformFee = await contract.platformFee();
    const owner_address = await contract.owner();

    console.log("✅ Platform fee:", platformFee.toString(), "basis points");
    console.log("✅ Owner address:", owner_address);
    console.log("✅ Contract is owned by deployer:", owner_address === owner);

    // Network-specific configurations
    console.log("\n3. Network-specific setup...");

    if (network === "development" || network === "test") {
      console.log("🔧 Setting up development environment...");

      // Register test users
      await setupTestUsers(contract, [user1, user2]);

      // Post test jobs
      await setupTestJobs(contract, user1, user2);

      console.log("✅ Development setup completed!");
    } else if (network === "sepolia") {
      console.log("🌐 Sepolia testnet deployment");
      console.log("Contract verification command:");
      console.log(`npx truffle verify FreelancingPlatform --network sepolia`);
    } else if (network === "mainnet") {
      console.log("🚀 Mainnet deployment");
      console.log("⚠️  IMPORTANT: Verify contract before announcing!");
      console.log("Contract verification command:");
      console.log(`npx truffle verify FreelancingPlatform --network mainnet`);
    }

    // Save deployment info
    saveDeploymentInfo(contract, network, owner);

    console.log("\n" + "=".repeat(50));
    console.log("DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error.message);

    if (error.receipt) {
      console.error("Gas used:", error.receipt.gasUsed);
    }

    throw error;
  }
};

// Helper function to set up test users
async function setupTestUsers(contract, users) {
  console.log("📝 Registering test users...");

  try {
    // Register first user as both client and freelancer
    await contract.registerUser(
      "Alice Johnson",
      "alice@example.com",
      "Full-stack developer with 5+ years experience",
      "JavaScript, React, Node.js, Solidity",
      "B:WorkSync 2clientspublicassetsimagesplaceholder-avatar.jpg",
      2, // Both client and freelancer
      { from: users[0] }
    );

    // Register second user as freelancer
    await contract.registerUser(
      "Bob Smith",
      "bob@example.com",
      "UI/UX designer specializing in web3 applications",
      "Figma, Adobe XD, Sketch, Prototyping",
      "B:WorkSync 2clientspublicassetsimagessuccess-celebration.jpg",
      1, // Freelancer only
      { from: users[1] }
    );

    console.log("✅ Test users registered successfully");
  } catch (error) {
    console.error("❌ Failed to register test users:", error.message);
  }
}

// Helper function to set up test jobs
async function setupTestJobs(contract, client, freelancer) {
  console.log("💼 Creating test jobs...");

  try {
    const web3 = require("web3");
    const oneEther = web3.utils.toWei("1", "ether");
    const halfEther = web3.utils.toWei("0.5", "ether");

    // Create test job 1
    await contract.postJob(
      "Build a DeFi Dashboard",
      "Create a comprehensive DeFi dashboard with wallet integration, portfolio tracking, and yield farming analytics.",
      ["React", "Web3.js", "Node.js", "Chart.js"],
      Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
      0, // Development category
      { from: client, value: oneEther }
    );

    // Create test job 2
    await contract.postJob(
      "Design NFT Marketplace UI",
      "Design a modern and intuitive user interface for an NFT marketplace with advanced filtering and discovery features.",
      ["Figma", "UI/UX", "Web Design", "Prototyping"],
      Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60, // 14 days from now
      1, // Design category
      { from: client, value: halfEther }
    );

    console.log("✅ Test jobs created successfully");
  } catch (error) {
    console.error("❌ Failed to create test jobs:", error.message);
  }
}

// Helper function to save deployment information
function saveDeploymentInfo(contract, network, owner) {
  const fs = require("fs");
  const path = require("path");

  const deploymentInfo = {
    network: network,
    contractAddress: contract.address,
    deployer: owner,
    deployedAt: new Date().toISOString(),
    contractABI: contract.abi,
  };

  // Save to file
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const filePath = path.join(deploymentDir, `${network}.json`);
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));

  console.log(`📄 Deployment info saved to: ${filePath}`);

  // Also save a frontend-compatible constants file
  const frontendConstants = `
// Auto-generated deployment constants for ${network}
export const CONTRACT_ADDRESS = "${contract.address}";
export const NETWORK = "${network}";
export const DEPLOYED_AT = "${deploymentInfo.deployedAt}";

// Copy this to your frontend constants file
`;

  const constantsPath = path.join(deploymentDir, `${network}-constants.js`);
  fs.writeFileSync(constantsPath, frontendConstants);

  console.log(`🔧 Frontend constants saved to: ${constantsPath}`);
}
