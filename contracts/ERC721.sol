pragma solidity ^0.8.19;

import "./IERC721.sol";
import "./IERC721Receiver.sol";

contract ERC721 is IERC721 {
    string public name;
    string public symbol;
    address public owner;
    mapping(address => uint) private balances;
    mapping(uint => address) private owners;
    mapping(uint => address) private approvals;
    mapping(address => mapping(address => bool)) private approvalsForAll;

    constructor(string memory _name, string memory _symbol) {
        owner = msg.sender;
        name = _name;
        symbol = _symbol;
    }

    event Minted(address indexed to, uint indexed tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Access denied!");
        _;
    }

    modifier approvedOrOwner(address spender, uint tokenId) {
        address ownerOfToken = ownerOf(tokenId);
        require(spender == ownerOfToken || getApproved(tokenId) == spender || isApprovedForAll(ownerOfToken, spender), "Access denied!");
        _;
    }

    function ownerOf(uint tokenId) public view returns (address) {
        return owners[tokenId];
    }

    function balanceOf(address account) public view returns (uint) {
        return balances[account];
    }

    function approve(address to, uint tokenId) approvedOrOwner(msg.sender, tokenId) external {
        address _owner = ownerOf(tokenId);
        require(to != _owner, "Can't get approve to owner!");
        approvals[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }

    function safeMint(address to, uint tokenId) internal virtual {
        require(_checkOnERC721Receiver(msg.sender, to, tokenId), "Non ERC721 receiver!");
        _mint(to, tokenId);
    }

    function _mint(address to, uint tokenId) internal virtual {
        require(to != address(0), "Can't burn token!");
        balances[to]++;
        owners[tokenId] = to;
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return approvalsForAll[owner][operator];
    }

    function getApproved(uint tokenId) public view returns (address) {
        return approvals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        approvalsForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    function transferFrom(address from, address to, uint tokenId) approvedOrOwner(msg.sender, tokenId) external {
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint tokenId) approvedOrOwner(msg.sender, tokenId) external {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Receiver(from, to, tokenId), "Non ERC721 receiver!");
    }

    function _transfer(address from, address to, uint tokenId) internal {
        require(from == ownerOf(tokenId), "Not an owner!");
        require(to != address(0), "Wrong \"to\" address");
        _beforeTokenTransfer(from, to, tokenId);
        owners[tokenId] = to;
        balances[from]--;
        balances[to]++;
        emit Transfer(from, to, tokenId);
        _afterTokenTransfer(from, to, tokenId);
    }

    function _checkOnERC721Receiver(address from, address to, uint tokenId) internal returns (bool) {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, bytes("")) returns(bytes4 ans) {
                return ans == IERC721Receiver.onERC721Received.selector;
            } catch {
                return false;
            }
        }
        return true;
    }

    function _beforeTokenTransfer(address from, address to, uint tokenId) internal virtual {}

    function _afterTokenTransfer(address from, address to, uint tokenId) internal virtual {}
}
