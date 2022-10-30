// ERC1155
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

// Transferable ERC1155 Semi-fungible
interface IBusinessCard is IERC1155, IERC1155MetadataURI {
    // view functions
    // アカウントの名刺IDを返す
    function tokenID(address author) external view returns (uint256);

    // external functions
    // プロフィール情報のリソースを保存している場所をセットする
    // ipfs://...
    // ens://...など
    function setProfileResource(string memory resourceURI) external;

    // 名刺を作成する
    function mint(address to) external returns (uint256);
}
