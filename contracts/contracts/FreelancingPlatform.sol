// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(msg.sender);
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

library Counters {
    struct Counter {
        uint256 _value;
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract FreelancingPlatform is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _jobIdCounter;
    Counters.Counter private _userIdCounter;
    
    // Platform fee in basis points (250 = 2.5%)
    uint256 public platformFee = 250;
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10% max
    
    struct User {
        uint256 id;
        address userAddress;
        string name;
        string email;
        string bio;
        string skills;
        string avatar;
        uint256 reputation;
        uint256 totalJobs;
        uint256 totalEarned;
        uint256 totalSpent;
        bool isRegistered;
        UserType userType;
        uint256 createdAt;
    }
    
    struct Job {
        uint256 id;
        address client;
        string title;
        string description;
        string[] skills;
        uint256 budget;
        uint256 deadline;
        address assignedFreelancer;
        bool isCompleted;
        bool isPaid;
        string encryptedWork;
        string decryptionKey;
        uint256 createdAt;
        uint256 completedAt;
        JobStatus status;
        JobCategory category;
    }
    
    struct Application {
        uint256 id;
        uint256 jobId;
        address freelancer;
        string proposal;
        uint256 bidAmount;
        uint256 deliveryTime;
        uint256 appliedAt;
        bool isSelected;
        ApplicationStatus status;
    }
    
    struct Review {
        uint256 jobId;
        address reviewer;
        address reviewee;
        uint8 rating;
        string comment;
        uint256 createdAt;
    }
    
    enum UserType { Client, Freelancer, Both }
    enum JobStatus { Posted, InProgress, Submitted, Completed, Cancelled, Disputed }
    enum JobCategory { Development, Design, Writing, Marketing, DataScience, Other }
    enum ApplicationStatus { Pending, Accepted, Rejected }
    
    // Mappings
    mapping(uint256 => Job) public jobs;
    mapping(address => User) public users;
    mapping(uint256 => Application[]) public jobApplications;
    mapping(uint256 => mapping(address => bool)) public hasApplied;
    mapping(address => uint256[]) public userJobs;
    mapping(address => uint256[]) public freelancerJobs;
    mapping(uint256 => Review[]) public jobReviews;
    mapping(address => uint256) public userRatings;
    mapping(address => uint256) public userRatingCount;
    
    // Events
    event UserRegistered(address indexed user, string name, UserType userType);
    event JobPosted(uint256 indexed jobId, address indexed client, string title, uint256 budget);
    event JobApplied(uint256 indexed jobId, address indexed freelancer, uint256 bidAmount);
    event FreelancerSelected(uint256 indexed jobId, address indexed freelancer);
    event WorkSubmitted(uint256 indexed jobId, string encryptedWork);
    event JobCompleted(uint256 indexed jobId, address indexed freelancer, uint256 payment);
    event JobCancelled(uint256 indexed jobId, address indexed client);
    event DisputeRaised(uint256 indexed jobId, address indexed initiator);
    event ReviewSubmitted(uint256 indexed jobId, address indexed reviewer, uint8 rating);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    event PaymentReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    modifier onlyJobClient(uint256 _jobId) {
        require(jobs[_jobId].client == msg.sender, "Only job client can perform this action");
        _;
    }
    
    modifier onlyAssignedFreelancer(uint256 _jobId) {
        require(jobs[_jobId].assignedFreelancer == msg.sender, "Only assigned freelancer can perform this action");
        _;
    }
    
    modifier jobExists(uint256 _jobId) {
        require(_jobId > 0 && _jobId <= _jobIdCounter.current(), "Job does not exist");
        _;
    }
    
    constructor() {
        // Initialize counters
        _jobIdCounter.increment(); // Start from 1
        _userIdCounter.increment();
    }
    
    function registerUser(
        string memory _name,
        string memory _email,
        string memory _bio,
        string memory _skills,
        string memory _avatar,
        UserType _userType
    ) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        _userIdCounter.increment();
        uint256 userId = _userIdCounter.current();
        
        users[msg.sender] = User({
            id: userId,
            userAddress: msg.sender,
            name: _name,
            email: _email,
            bio: _bio,
            skills: _skills,
            avatar: _avatar,
            reputation: 1000, // Start with 1000 reputation points
            totalJobs: 0,
            totalEarned: 0,
            totalSpent: 0,
            isRegistered: true,
            userType: _userType,
            createdAt: block.timestamp
        });
        
        emit UserRegistered(msg.sender, _name, _userType);
    }
    
    function postJob(
        string memory _title,
        string memory _description,
        string[] memory _skills,
        uint256 _deadline,
        JobCategory _category
    ) external payable onlyRegistered nonReentrant {
        require(msg.value > 0, "Budget must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(
            users[msg.sender].userType == UserType.Client || 
            users[msg.sender].userType == UserType.Both, 
            "Only clients can post jobs"
        );
        
        _jobIdCounter.increment();
        uint256 jobId = _jobIdCounter.current();
        
        jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            title: _title,
            description: _description,
            skills: _skills,
            budget: msg.value,
            deadline: _deadline,
            assignedFreelancer: address(0),
            isCompleted: false,
            isPaid: false,
            encryptedWork: "",
            decryptionKey: "",
            createdAt: block.timestamp,
            completedAt: 0,
            status: JobStatus.Posted,
            category: _category
        });
        
        userJobs[msg.sender].push(jobId);
        
        emit JobPosted(jobId, msg.sender, _title, msg.value);
    }
    
    function applyForJob(
        uint256 _jobId,
        string memory _proposal,
        uint256 _bidAmount,
        uint256 _deliveryTime
    ) external onlyRegistered jobExists(_jobId) {
        require(jobs[_jobId].status == JobStatus.Posted, "Job is not available for applications");
        require(!hasApplied[_jobId][msg.sender], "Already applied for this job");
        require(jobs[_jobId].client != msg.sender, "Cannot apply to own job");
        require(
            users[msg.sender].userType == UserType.Freelancer || 
            users[msg.sender].userType == UserType.Both, 
            "Only freelancers can apply"
        );
        require(bytes(_proposal).length > 0, "Proposal cannot be empty");
        require(_bidAmount > 0, "Bid amount must be greater than 0");
        require(_deliveryTime > 0, "Delivery time must be greater than 0");
        
        Application memory newApp = Application({
            id: jobApplications[_jobId].length + 1,
            jobId: _jobId,
            freelancer: msg.sender,
            proposal: _proposal,
            bidAmount: _bidAmount,
            deliveryTime: _deliveryTime,
            appliedAt: block.timestamp,
            isSelected: false,
            status: ApplicationStatus.Pending
        });
        
        jobApplications[_jobId].push(newApp);
        hasApplied[_jobId][msg.sender] = true;
        
        emit JobApplied(_jobId, msg.sender, _bidAmount);
    }
    
    function selectFreelancer(uint256 _jobId, address _freelancer) 
        external 
        onlyJobClient(_jobId) 
        jobExists(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Posted, "Job is not in posted status");
        require(hasApplied[_jobId][_freelancer], "Freelancer has not applied for this job");
        
        jobs[_jobId].assignedFreelancer = _freelancer;
        jobs[_jobId].status = JobStatus.InProgress;
        freelancerJobs[_freelancer].push(_jobId);
        
        // Update application status
        Application[] storage applications = jobApplications[_jobId];
        for (uint256 i = 0; i < applications.length; i++) {
            if (applications[i].freelancer == _freelancer) {
                applications[i].isSelected = true;
                applications[i].status = ApplicationStatus.Accepted;
            } else {
                applications[i].status = ApplicationStatus.Rejected;
            }
        }
        
        emit FreelancerSelected(_jobId, _freelancer);
    }
    
    function submitWork(uint256 _jobId, string memory _encryptedWork) 
        external 
        onlyAssignedFreelancer(_jobId) 
        jobExists(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.InProgress, "Job is not in progress");
        require(bytes(_encryptedWork).length > 0, "Encrypted work cannot be empty");
        
        jobs[_jobId].encryptedWork = _encryptedWork;
        jobs[_jobId].status = JobStatus.Submitted;
        
        emit WorkSubmitted(_jobId, _encryptedWork);
    }
    
    function shareDecryptionKey(uint256 _jobId, string memory _decryptionKey) 
        external 
        onlyAssignedFreelancer(_jobId) 
        jobExists(_jobId) 
    {
        require(jobs[_jobId].status == JobStatus.Submitted, "Work not submitted yet");
        require(bytes(_decryptionKey).length > 0, "Decryption key cannot be empty");
        
        jobs[_jobId].decryptionKey = _decryptionKey;
    }
    
    function completeJob(uint256 _jobId) 
        external 
        onlyJobClient(_jobId) 
        jobExists(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].status == JobStatus.Submitted, "Work not submitted yet");
        require(!jobs[_jobId].isPaid, "Job already paid");
        
        jobs[_jobId].isCompleted = true;
        jobs[_jobId].isPaid = true;
        jobs[_jobId].status = JobStatus.Completed;
        jobs[_jobId].completedAt = block.timestamp;
        
        // Calculate payments
        uint256 platformFeeAmount = (jobs[_jobId].budget * platformFee) / 10000;
        uint256 freelancerPayment = jobs[_jobId].budget - platformFeeAmount;
        
        // Update user statistics
        users[jobs[_jobId].assignedFreelancer].totalJobs++;
        users[jobs[_jobId].assignedFreelancer].totalEarned += freelancerPayment;
        users[msg.sender].totalJobs++;
        users[msg.sender].totalSpent += jobs[_jobId].budget;
        
        // Transfer payment to freelancer
        (bool success, ) = payable(jobs[_jobId].assignedFreelancer).call{value: freelancerPayment}("");
        require(success, "Payment transfer failed");
        
        emit JobCompleted(_jobId, jobs[_jobId].assignedFreelancer, freelancerPayment);
        emit PaymentReleased(_jobId, jobs[_jobId].assignedFreelancer, freelancerPayment);
    }
    
    function cancelJob(uint256 _jobId) 
        external 
        onlyJobClient(_jobId) 
        jobExists(_jobId) 
        nonReentrant 
    {
        require(
            jobs[_jobId].status == JobStatus.Posted || 
            jobs[_jobId].status == JobStatus.InProgress, 
            "Job cannot be cancelled"
        );
        
        jobs[_jobId].status = JobStatus.Cancelled;
        
        // Refund client
        (bool success, ) = payable(jobs[_jobId].client).call{value: jobs[_jobId].budget}("");
        require(success, "Refund transfer failed");
        
        emit JobCancelled(_jobId, msg.sender);
    }
    
    function submitReview(
        uint256 _jobId,
        address _reviewee,
        uint8 _rating,
        string memory _comment
    ) external onlyRegistered jobExists(_jobId) {
        require(jobs[_jobId].status == JobStatus.Completed, "Job must be completed");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(
            msg.sender == jobs[_jobId].client || 
            msg.sender == jobs[_jobId].assignedFreelancer, 
            "Only job participants can review"
        );
        require(
            _reviewee == jobs[_jobId].client || 
            _reviewee == jobs[_jobId].assignedFreelancer, 
            "Can only review job participants"
        );
        require(msg.sender != _reviewee, "Cannot review yourself");
        
        Review memory newReview = Review({
            jobId: _jobId,
            reviewer: msg.sender,
            reviewee: _reviewee,
            rating: _rating,
            comment: _comment,
            createdAt: block.timestamp
        });
        
        jobReviews[_jobId].push(newReview);
        
        // Update user rating
        uint256 currentRating = userRatings[_reviewee];
        uint256 currentCount = userRatingCount[_reviewee];
        
        userRatings[_reviewee] = (currentRating * currentCount + _rating * 100) / (currentCount + 1);
        userRatingCount[_reviewee]++;
        
        // Update reputation based on rating
        if (_rating >= 4) {
            users[_reviewee].reputation += 50;
        } else if (_rating >= 3) {
            users[_reviewee].reputation += 10;
        } else {
            if (users[_reviewee].reputation >= 20) {
                users[_reviewee].reputation -= 20;
            }
        }
        
        emit ReviewSubmitted(_jobId, msg.sender, _rating);
        emit ReputationUpdated(_reviewee, users[_reviewee].reputation);
    }
    
    // View functions
    function getAllJobs() external view returns (Job[] memory) {
        uint256 totalJobs = _jobIdCounter.current();
        Job[] memory allJobs = new Job[](totalJobs);
        
        for (uint256 i = 1; i <= totalJobs; i++) {
            allJobs[i - 1] = jobs[i];
        }
        
        return allJobs;
    }
    
    function getJobsByStatus(JobStatus _status) external view returns (Job[] memory) {
        uint256 totalJobs = _jobIdCounter.current();
        uint256 count = 0;
        
        // Count jobs with the specified status
        for (uint256 i = 1; i <= totalJobs; i++) {
            if (jobs[i].status == _status) {
                count++;
            }
        }
        
        Job[] memory statusJobs = new Job[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= totalJobs; i++) {
            if (jobs[i].status == _status) {
                statusJobs[index] = jobs[i];
                index++;
            }
        }
        
        return statusJobs;
    }
    
        function getUserJobs(address _user) external view returns (Job[] memory) {
        uint256[] memory jobIds = userJobs[_user];
        Job[] memory jobs_ = new Job[](jobIds.length);
        
        for (uint256 i = 0; i < jobIds.length; i++) {
            jobs_[i] = jobs[jobIds[i]];
        }
        
        return jobs_;
    }
    
    function getFreelancerJobs(address _freelancer) external view returns (Job[] memory) {
        uint256[] memory jobIds = freelancerJobs[_freelancer];
        Job[] memory jobs_ = new Job[](jobIds.length);
        
        for (uint256 i = 0; i < jobIds.length; i++) {
            jobs_[i] = jobs[jobIds[i]];
        }
        
        return jobs_;
    }
    
    function getJobApplications(uint256 _jobId) external view returns (Application[] memory) {
        return jobApplications[_jobId];
    }
    
    function getJobReviews(uint256 _jobId) external view returns (Review[] memory) {
        return jobReviews[_jobId];
    }
    
    function getUserRating(address _user) external view returns (uint256 rating, uint256 count) {
        return (userRatings[_user], userRatingCount[_user]);
    }
    
    function getJobsByCategory(JobCategory _category) external view returns (Job[] memory) {
        uint256 totalJobs = _jobIdCounter.current();
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalJobs; i++) {
            if (jobs[i].category == _category && jobs[i].status == JobStatus.Posted) {
                count++;
            }
        }
        
        Job[] memory categoryJobs = new Job[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= totalJobs; i++) {
            if (jobs[i].category == _category && jobs[i].status == JobStatus.Posted) {
                categoryJobs[index] = jobs[i];
                index++;
            }
        }
        
        return categoryJobs;
    }
    
    function getTotalJobs() external view returns (uint256) {
        return _jobIdCounter.current();
    }
    
    function getTotalUsers() external view returns (uint256) {
        return _userIdCounter.current();
    }
    
    // Owner functions
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= MAX_PLATFORM_FEE, "Fee cannot exceed maximum");
        platformFee = _newFee;
    }
    
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
    
    // Fallback function to receive Ether
    receive() external payable {}
}