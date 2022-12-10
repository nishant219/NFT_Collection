// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    string _baseTokenURI; //base url
    IWhitelist whitelist; //WhiteList contract instance

    bool public presaleStarted; //to know presale started or not
    uint256 public presaleEnded; //timestamp for presale

    uint256 public maxTokenIds = 20; //max tokens
    uint256 public tokenId; //counter for token

    uint public _price = 0.01 ether;

    bool public _paused;
    modifier onlyWhenNotPaused() {
        require(!_paused, "contract currently paused");
        _;
    }

    //constructor(baseURL,address)ERC721(name,symbol of NFT)
    constructor( string memory _baseURI, address whiteListContractAddress) ERC721("Crypto Devs", "CD") {
        _baseTokenURI = _baseURI;
        whitelist = IWhitelist(whiteListContractAddress);
    }

    //presale fun
    //onlyOwner is modifier from Ownable.sol --> only owner can call the fun
    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 5 minutes; //current time+5min then presale ends
    }

    // for addresses that whiktelisted during presale period
    function presaleMint() public payable onlyWhenNotPaused {
        //check presale started && time is valid
        require(presaleStarted && block.timestamp < presaleEnded,"Presale Ended" );
        //check whether current user is in whitelist
        require(whitelist.whitelistedAddresses(msg.sender),"You are not in whitelist"); //whitelistedAddresses = from interface
        //check max mint
        require(maxTokenIds < tokenId, "Limit exceeded");
        //pay eth for mint
        require(msg.value >= _price, "Enter correct amount of eth");

        tokenId++;
        _safeMint(msg.sender, tokenId); //minting NFT's to sender
        // _safeMint function --> from ERC721
    }

    //function for public minting //after presale
    function mint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp >= presaleEnded, "Presale has not ended yet");
        //check max mint
        require(maxTokenIds < tokenId, "Limit exceeded");
        //pay eth for mint
        require(msg.value >= _price, "Enter correct amount of eth");

        tokenId++;
        _safeMint(msg.sender, tokenId); //minting NFT's to sender
    }

    //to pause the contract --we control it via bool value val
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    //to send back all/remaining ethers to owner
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
