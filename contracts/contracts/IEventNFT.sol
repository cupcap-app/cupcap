pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./IPOAP.sol";

interface IEventNFT is IERC721, IERC721Metadata {
    enum ParticipantType {
        Any,
        ERC20,
        ERC721,
        ERC1155
    }

    // POAPコントラクトを返す
    function poap() external view returns (IPOAP);

    // external functions
    // 新しいイベントを作成する
    function createEvent(
        address host,
        string memory resourceURI, // JSONリソースのURI
        uint256 numberOfParticipants, // 0の場合は無制限
        uint256 startedAt, // 開始タイムスタンプ, 0の場合は作成時間を開始時刻とする
        uint256 endedAt, // 終了タイムスタンプ, 0の場合は無制限
        ParticipantType participantType, // 参加可能な人のタイプ, any, erc20, erc721, erc1155
        address targetTokenContract, // 参加可能な人が持っているトークンのコントラクトアドレス
        uint256 targetTokenTypeID // トークンID (ERC1155のみ)
    ) external returns (uint256);

    // イベントに参加登録する
    function participateEvent(
        uint256 eventID, // イベントID
        address account // 参加登録をするアカウント
    ) external;

    // イベントに参加する
    function attendEvent(uint256 eventID, address account) external;
}
