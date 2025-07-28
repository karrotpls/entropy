// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint amount) external returns (bool);
    function burn(uint amount) external;
    function mint(address to, uint amount) external;
}

contract KarrotFusionEngine {
    IERC20 public karrot;
    address public owner;

    event EntropyDecay(address indexed user, uint decayAmount);
    event HyperNovaBlast(address indexed triggeredBy, uint novaAmount, bool minted);

    constructor(address _karrot) {
        karrot = IERC20(_karrot);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sigma Mother says no.");
        _;
    }

    function triggerEntropy(uint userBalance) external returns (uint) {
        // Decay 1-5% randomly (simulate entropy)
        uint decayRate = (block.timestamp % 5) + 1;
        uint decayAmount = (userBalance * decayRate) / 100;

        karrot.burn(decayAmount);
        emit EntropyDecay(msg.sender, decayAmount);

        return decayAmount;
    }

    function triggerHyperNova(bool mintInstead) external onlyOwner {
        uint novaAmount = block.timestamp % 1000 + 1000; // Randomized amount
        if (mintInstead) {
            karrot.mint(owner, novaAmount);
        } else {
            karrot.burn(novaAmount);
        }

        emit HyperNovaBlast(msg.sender, novaAmount, mintInstead);
    }

    function updateKarrot(address _newKarrot) external onlyOwner {
        karrot = IERC20(_newKarrot);
    }
}
