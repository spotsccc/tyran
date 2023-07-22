pragma solidity ^0.8.19;

interface IERC721 {
    function balanceOf(address account) external returns(uint);
    function ownerOf(uint itemId) external returns(address);
    function safeTransferFrom(address from, address to, uint tokenId) external;
    function transferFrom(address from, address to, uint tokenId) external;
    function approve(address to, uint tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
    function getApproved(uint tokenId) external view returns(address);
    function isApprovedForAll(address owner, address operator) external returns(bool);

    event Transfer(address indexed from, address indexed to, uint indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}

contract ERC721 is IERC721 {
    address public owner;
    mapping(address => uint) private balances;
    mapping(uint => address) private owners;
    mapping(uint => address) private approvals;
    mapping(address => mapping(address => bool)) private approvalsForAll;

    constructor() {
        owner = msg.owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Access denied!");
        _;
    }

    modifier ownerOfToken(address account, uint tokenId) {
        require(ownerOf(tokenId) == account, "Access denied!");
        _;
    }

    function ownerOf(uint tokenId) public view returns (address) {
        return owners[tokenId];
    }

    function balanceOf(address account) public view returns (uint) {
        return balances[account];
    }

    function approve(address to, uint tokenId) ownerOfToken(msg.sender, tokenId) external {
        approvals[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return approvalsForAll[owner][operator];
    }

    function getApproved(uint tokenId) public view returns (address) {
        return approvals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        approvalsForAll[msg.sender][operator] = bool;
        emit ApprovalForAll(owner, operator, approved);
    }

    function transferFrom(address from, address to, uint tokenId) external {
        require(getApproved(tokenId) == to || isApprovedForAll(from, to), "You have not approve to do this!");

        owners[tokenId] = to;
        balances[from]--;
        balances[to]++;

        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint tokenId) external {
        require(getApproved(tokenId) == to || isApprovedForAll(from, to), "You have not approve to do this!");
    }
}
