// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./ERC721.sol";

contract Shop is ERC721 {
  enum Gem { none, white, green, blue, red }
  enum Rarity { common, rare, epic, legendary, mystery }
  enum Property { common, enchanted, cursed, magic }

  event Bought(address indexed buyer, uint indexed id);
  event BoughtFromSeller(address indexed seller, address indexed buyer, uint price, uint indexed id);
  event Placed(address indexed seller, uint indexed price, uint indexed id);

  struct Weapon {
    Gem[3] gems;
    Rarity rarity;
    Property property;
  }

  struct PlacedItem {
    address owner;
    uint price;
    uint id;
  }

  uint private nonce = 0;
  mapping(uint => Weapon) public weapons;
  uint public price = 100000;
  uint public lastTokenId = 0;
  mapping(uint => PlacedItem) public placedItems;

  constructor() ERC721("MyToken", "My") {}

  function buy() external payable {
    require(msg.value >= price, "Not enough funds!");

    _mint(msg.sender, lastTokenId);

    Weapon memory weapon;
    uint8 rarityChance = random();
    if (rarityChance <= 58) {
      weapon.rarity = Rarity.common;
    } else if (rarityChance <= 84) {
      weapon.rarity = Rarity.rare;
    } else if (rarityChance <= 93) {
      weapon.rarity = Rarity.epic;
    } else if (rarityChance <= 98) {
      weapon.rarity = Rarity.legendary;
    } else {
      weapon.rarity = Rarity.mystery;
    }

    uint8 propertyChance = random();
    if (propertyChance <= 59) {
      weapon.property = Property.common;
    } else if (propertyChance <= 79) {
      weapon.property = Property.enchanted;
    } else if (propertyChance <= 89) {
      weapon.property = Property.cursed;
    } else {
      weapon.property = Property.magic;
    }

    uint gemCountChance = random();
    uint8 gemCount;
    if (gemCountChance <= 49) {
      gemCount = 0;
    } else if (gemCountChance <= 74) {
      gemCount = 1;
    } else if (gemCountChance <= 89) {
      gemCount = 2;
    } else {
      gemCount = 3;
    }

    for (uint8 i; i < gemCount; i++) {
      uint8 gemQuality = random();
      Gem gem;
      if (gemQuality <= 49) {
        gem = Gem.white;
      } else if (gemCountChance <= 74) {
        gem = Gem.green;
      } else if (gemCountChance <= 89) {
        gem = Gem.blue;
      } else {
        gem = Gem.red;
      }
      weapon.gems[i] = gem;
    }

    weapons[lastTokenId] = weapon;
    emit Bought(msg.sender, lastTokenId);
    lastTokenId++;
  }

  function getWeapon(uint id) public view returns(Weapon memory) {
    return weapons[id];
  }

  function getPlacedItem(uint id) public view returns(PlacedItem memory) {
    return placedItems[id];
  }

  function placeToMarket(uint tokenId, uint _price) external {
    approve(address(this), tokenId);
    placedItems[tokenId] = PlacedItem(msg.sender, _price, tokenId);
    emit Placed(msg.sender, _price, tokenId);
  }

  function buyFromSeller(uint tokenId) payable external {
    PlacedItem memory placedItem = getPlacedItem(tokenId);
    if (ownerOf(tokenId) != placedItem.owner) {
      revert("Owner of item changed!");
    }
    require(msg.value >= placedItem.price, "Not enough funds!");
    _transfer(placedItem.owner, msg.sender, tokenId);
    delete placedItems[tokenId];
    payable(placedItem.owner).transfer(placedItem.price);
    if (msg.value - placedItem.price > 0) {
      payable(msg.sender).transfer(msg.value - placedItem.price);
    }
    emit BoughtFromSeller(placedItem.owner, msg.sender, placedItem.price, tokenId);
  }

  function random() private returns (uint8) {
    nonce++; // Increase nonce with each call to prevent the same result when called within the same block by the same sender
    return uint8(uint(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1), msg.sender, nonce))) % 100);
  }
}
