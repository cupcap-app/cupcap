// ERC1155
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

// Transferable ERC1155 Semi-fungible
interface IBusinessCardDesign is IERC1155, IERC1155MetadataURI {
    // view functions
    // アカウントが特定のデザインのトークンを保有しているか
    function hasCardDesign(uint256 cardDesignID, address account)
        external
        view
        returns (bool);

    // アカウントが現在使用しているデザインIDを返す
    function selectedDesignID(address author) external view returns (uint256);

    // external functions
    // 新規のデザインを登録する
    function registerResource(string memory tokenURI)
        external
        returns (uint256);

    // デザインセミファンジブルトークンを作成する
    // 事前にデザインが登録されている必要がある
    function mint(
        address to,
        uint256 designID,
        uint256 number
    ) external;

    // アカウントが使用したいデザインIDを指定する
    function setDesignID(address to, uint256 designID) external;
}
