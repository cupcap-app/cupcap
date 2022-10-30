pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IEventNFT.sol";

// ERC721
contract EventNFT is IEventNFT, ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    string public constant TOKEN_NAME = "CupcapEvent";
    string public constant TOKEN_SYMBOL = "CPE";

    Counters.Counter private _tokenIds;

    constructor() ERC721(TOKEN_NAME, TOKEN_SYMBOL) {}

    function tokenURI(uint256 tokenID)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage, IERC721Metadata)
        returns (string memory)
    {
        return super.tokenURI(tokenID);
    }

    function mint(address to, string memory tokenURI)
        external
        onlyOwner
        returns (uint256)
    {
        uint256 tokenID = _getNewTokenID();

        _safeMint(to, tokenID);
        _setTokenURI(tokenID, tokenURI);

        return tokenID;
    }

    function _getNewTokenID() private returns (uint256) {
        uint256 newItemID = _tokenIds.current();

        _tokenIds.increment();

        return newItemID;
    }

    function _burn(uint256 tokenID)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenID);
    }
}
