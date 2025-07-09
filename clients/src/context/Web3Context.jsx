// context/Web3Context.js
import React, { createContext, useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { toast } from "react-hot-toast";

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkId, setNetworkId] = useState(null);

  // For development - we'll simulate contract interactions
  const MOCK_MODE = process.env.REACT_APP_MOCK_MODE === "true" || true;

  // Mock contract ABI
  const CONTRACT_ABI = [
    {
      inputs: [
        { internalType: "string", name: "_name", type: "string" },
        { internalType: "string", name: "_email", type: "string" },
        { internalType: "string", name: "_bio", type: "string" },
        { internalType: "string", name: "_skills", type: "string" },
        { internalType: "string", name: "_avatar", type: "string" },
        { internalType: "uint8", name: "_userType", type: "uint8" },
      ],
      name: "registerUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_jobId", type: "uint256" },
        { internalType: "string", name: "_proposal", type: "string" },
      ],
      name: "applyForJob",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const CONTRACT_ADDRESS =
    process.env.REACT_APP_CONTRACT_ADDRESS ||
    "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    initWeb3();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const initWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const chainId = await web3Instance.eth.getChainId();
        setNetworkId(chainId);

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await loadContract(web3Instance, accounts[0]);
        } else {
          await setupContract(web3Instance);
        }
      } catch (error) {
        console.error("Web3 initialization error:", error);
        toast.error("Failed to initialize Web3");
      }
    } else {
      toast.error("Please install MetaMask to use this application");
    }
    setLoading(false);
  };

  // Create mock contract methods
  const createMockContract = () => {
    return {
      methods: {
        registerUser: (...args) => ({
          send: async ({ from }) => {
            console.log("Mock registerUser called with:", args, "from:", from);
            return {
              success: true,
              transactionHash: "0x" + Math.random().toString(16),
            };
          },
        }),
        postJob: (...args) => ({
          send: async ({ from, value }) => {
            console.log(
              "Mock postJob called with:",
              args,
              "from:",
              from,
              "value:",
              value
            );
            return {
              success: true,
              transactionHash: "0x" + Math.random().toString(16),
            };
          },
        }),
        applyForJob: (...args) => ({
          send: async ({ from }) => {
            console.log("Mock applyForJob called with:", args, "from:", from);
            return {
              success: true,
              transactionHash: "0x" + Math.random().toString(16),
            };
          },
        }),
        getUser: (address) => ({
          call: async () => {
            console.log("Mock getUser called for:", address);
            return {
              name: "",
              email: "",
              bio: "",
              skills: "",
              avatar: "",
              userType: "0",
              isRegistered: false,
            };
          },
        }),
        getAllJobs: () => ({
          call: async () => {
            console.log("Mock getAllJobs called");
            return [];
          },
        }),
      },
    };
  };

  const setupContract = async (web3Instance) => {
    try {
      if (MOCK_MODE) {
        setContract(createMockContract());
        return;
      }

      if (
        CONTRACT_ADDRESS &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ) {
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      }
    } catch (error) {
      console.error("Contract setup error:", error);
    }
  };

  const loadContract = async (web3Instance, account) => {
    try {
      if (MOCK_MODE) {
        setContract(createMockContract());
        await loadUserData(null, account);
        return;
      }

      if (
        CONTRACT_ADDRESS &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000"
      ) {
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
        await loadUserData(contractInstance, account);
      } else {
        setContract(createMockContract());
        await loadUserData(null, account);
      }
    } catch (error) {
      console.error("Contract loading error:", error);
      await loadUserData(null, account);
    }
  };

  const loadUserData = async (contractInstance, account) => {
    try {
      if (MOCK_MODE || !contractInstance) {
        const storedUser = localStorage.getItem(`user_${account}`);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({ isRegistered: false, address: account });
        }
        return;
      }

      const userData = await contractInstance.methods.getUser(account).call();
      if (userData.isRegistered) {
        setUser({
          name: userData.name,
          email: userData.email,
          bio: userData.bio,
          skills: userData.skills,
          avatar: userData.avatar,
          userType: userData.userType,
          isRegistered: true,
          address: account,
        });
      } else {
        setUser({ isRegistered: false, address: account });
      }
    } catch (error) {
      console.error("User data loading error:", error);
      setUser({ isRegistered: false, address: account });
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setUser(null);
    } else {
      setAccount(accounts[0]);
      if (contract) {
        loadUserData(contract, accounts[0]);
      }
    }
  };

  const handleChainChanged = (chainId) => {
    setNetworkId(parseInt(chainId, 16));
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await loadContract(web3, accounts[0]);
        toast.success("Wallet connected successfully");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      if (error.code === 4001) {
        toast.error("Please connect to MetaMask");
      } else {
        toast.error("Failed to connect wallet");
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setUser(null);
    toast.success("Wallet disconnected");
  };

  const registerUser = async (userData) => {
    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    try {
      if (MOCK_MODE) {
        const newUser = {
          ...userData,
          isRegistered: true,
          address: account,
        };

        localStorage.setItem(`user_${account}`, JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
      }

      if (!contract || !contract.methods.registerUser) {
        throw new Error("Contract not available");
      }

      const tx = await contract.methods
        .registerUser(
          userData.name,
          userData.email,
          userData.bio,
          userData.skills,
          userData.avatar,
          parseInt(userData.userType)
        )
        .send({ from: account });

      await refreshUserData();
      return tx;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const postJob = async (jobData) => {
    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    try {
      if (MOCK_MODE) {
        const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
        const newJob = {
          ...jobData,
          id: Date.now(),
          client: account,
          status: "0",
          createdAt: Math.floor(Date.now() / 1000),
          applicants: [],
          budget: jobData.budget,
        };

        jobs.push(newJob);
        localStorage.setItem("jobs", JSON.stringify(jobs));

        return { success: true, jobId: newJob.id };
      }

      if (!contract || !contract.methods.postJob) {
        throw new Error("Contract not available");
      }

      const budgetWei = web3.utils.toWei(jobData.budget, "ether");
      const deadlineTimestamp = Math.floor(
        new Date(jobData.deadline).getTime() / 1000
      );

      const tx = await contract.methods
        .postJob(
          jobData.title,
          jobData.description,
          jobData.skills,
          deadlineTimestamp,
          parseInt(jobData.category)
        )
        .send({
          from: account,
          value: budgetWei,
        });

      return tx;
    } catch (error) {
      console.error("Post job error:", error);
      throw error;
    }
  };

  const applyForJob = async (jobId, proposal) => {
    if (!account) {
      throw new Error("Please connect your wallet first");
    }

    try {
      if (MOCK_MODE) {
        // Store application in localStorage
        const applications = JSON.parse(
          localStorage.getItem("applications") || "[]"
        );
        const newApplication = {
          id: Date.now(),
          jobId: jobId,
          freelancerId: account,
          freelancerName: user?.name || "Unknown",
          proposal: proposal,
          appliedAt: Math.floor(Date.now() / 1000),
          status: "pending",
        };

        applications.push(newApplication);
        localStorage.setItem("applications", JSON.stringify(applications));

        // Update job with new applicant
        const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
        const updatedJobs = jobs.map((job) => {
          if (job.id === jobId) {
            return {
              ...job,
              applicants: [...(job.applicants || []), newApplication],
            };
          }
          return job;
        });
        localStorage.setItem("jobs", JSON.stringify(updatedJobs));

        return { success: true, applicationId: newApplication.id };
      }

      if (!contract || !contract.methods.applyForJob) {
        throw new Error("Contract not available");
      }

      const tx = await contract.methods
        .applyForJob(jobId, proposal)
        .send({ from: account });

      return tx;
    } catch (error) {
      console.error("Apply for job error:", error);
      throw error;
    }
  };

  const getAllJobs = async () => {
    try {
      if (MOCK_MODE) {
        return JSON.parse(localStorage.getItem("jobs") || "[]");
      }

      if (!contract || !contract.methods.getAllJobs) {
        return [];
      }

      return await contract.methods.getAllJobs().call();
    } catch (error) {
      console.error("Get jobs error:", error);
      return [];
    }
  };

  const refreshUserData = async () => {
    if (account) {
      await loadUserData(contract, account);
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error("Network switch error:", error);
      toast.error("Failed to switch network");
    }
  };

  const value = {
    web3,
    account,
    contract,
    user,
    loading,
    networkId,
    connectWallet,
    disconnectWallet,
    refreshUserData,
    switchNetwork,
    registerUser,
    postJob,
    applyForJob,
    getAllJobs,
    isConnected: !!account,
    isRegistered: user?.isRegistered || false,
    mockMode: MOCK_MODE,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
