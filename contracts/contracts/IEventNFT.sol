pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

interface IEventNFT is IERC721, IERC721Metadata {
    // external functions
    // 新しいイベントを作成する
    function mint(address to, string memory tokenURI)
        external
        returns (uint256);
}
