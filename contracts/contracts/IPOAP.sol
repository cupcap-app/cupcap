pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

interface IPOAP is IERC1155, IERC1155MetadataURI {
    // view functions
    // イベントのPOAPのIDを返す
    function getID(uint256 eventID, address account)
        external
        view
        returns (uint256);

    function has(uint256 eventID, address account) external returns (bool);

    // external functions
    // POAPを作成する
    function mint(address to, uint256 eventID) external returns (uint256);
}
