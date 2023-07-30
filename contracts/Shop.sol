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

  uint private nonce = 0;
  mapping(uint => Weapon) public weapons;
  uint public price = 100000;
  uint public lastTokenId = 0;

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

  function random() private returns (uint8) {
    nonce++; // Increase nonce with each call to prevent the same result when called within the same block by the same sender
    return uint8(uint(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1), msg.sender, nonce))) % 100);
  }
}
