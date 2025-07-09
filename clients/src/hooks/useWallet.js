import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

export const useWallet = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [networkId, setNetworkId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is available
  const isWalletAvailable = useCallback(() => {
    return typeof window !== "undefined" && window.ethereum;
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isWalletAvailable()) {
      const error = "MetaMask is not installed";
      setError(error);
      toast.error(error);
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      setAccount(accounts[0]);
      setIsConnected(true);

      // Get balance and network
      await updateWalletInfo(accounts[0]);

      toast.success("Wallet connected successfully!");
      return true;
    } catch (error) {
      const errorMessage = error.message || "Failed to connect wallet";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isWalletAvailable]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount("");
    setBalance("0");
    setNetworkId(null);
    setIsConnected(false);
    setError(null);
    toast.success("Wallet disconnected");
  }, []);

  // Update wallet info (balance, network)
  const updateWalletInfo = useCallback(
    async (walletAddress = account) => {
      if (!isWalletAvailable() || !walletAddress) return;

      try {
        // Get balance
        const balanceWei = await window.ethereum.request({
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
        });

        const balanceEth = parseInt(balanceWei, 16) / Math.pow(10, 18);
        setBalance(balanceEth.toString());

        // Get network ID
        const netId = await window.ethereum.request({
          method: "net_version",
        });
        setNetworkId(parseInt(netId));
      } catch (error) {
        console.error("Error updating wallet info:", error);
      }
    },
    [account, isWalletAvailable]
  );

  // Switch network
  const switchNetwork = useCallback(
    async (chainId) => {
      if (!isWalletAvailable()) return false;

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return true;
      } catch (error) {
        if (error.code === 4902) {
          // Network not added to MetaMask
          toast.error("Please add this network to MetaMask");
        } else {
          toast.error("Failed to switch network");
        }
        return false;
      }
    },
    [isWalletAvailable]
  );

  // Add network to MetaMask
  const addNetwork = useCallback(
    async (networkConfig) => {
      if (!isWalletAvailable()) return false;

      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [networkConfig],
        });
        return true;
      } catch (error) {
        toast.error("Failed to add network");
        return false;
      }
    },
    [isWalletAvailable]
  );

  // Check if already connected
  const checkConnection = useCallback(async () => {
    if (!isWalletAvailable()) return;

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await updateWalletInfo(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  }, [isWalletAvailable, updateWalletInfo]);

  // Listen to account changes
  useEffect(() => {
    if (!isWalletAvailable()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        updateWalletInfo(accounts[0]);
        toast.info("Account changed");
      }
    };

    const handleChainChanged = (chainId) => {
      setNetworkId(parseInt(chainId, 16));
      toast.info("Network changed");
      // Reload the page on network change to avoid inconsistencies
      window.location.reload();
    };

    const handleConnect = (connectInfo) => {
      setNetworkId(parseInt(connectInfo.chainId, 16));
      toast.success("Wallet connected");
    };

    const handleDisconnect = () => {
      disconnectWallet();
    };

    // Add event listeners
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("connect", handleConnect);
    window.ethereum.on("disconnect", handleDisconnect);

    // Check if already connected on mount
    checkConnection();

    // Cleanup
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("connect", handleConnect);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [
    isWalletAvailable,
    account,
    disconnectWallet,
    updateWalletInfo,
    checkConnection,
  ]);

  return {
    account,
    balance,
    networkId,
    isConnected,
    isConnecting,
    error,
    isWalletAvailable: isWalletAvailable(),
    connectWallet,
    disconnectWallet,
    updateWalletInfo,
    switchNetwork,
    addNetwork,
  };
};

export default useWallet;
