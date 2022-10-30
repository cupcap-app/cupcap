pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

interface IEventNFT is IERC721, IERC721Metadata {
    // external functions
    // 新しいイベントを作成する
    function createEvent(
        address host,
        string memory resourceURI, // JSONリソースのURI
        uint256 numberOfParticipants, // 0の場合は無制限
        uint256 startedAt, // 開始タイムスタンプ, 0の場合は作成時間を開始時刻とする
        uint256 endedAt // 終了タイムスタンプ, 0の場合は無制限
    ) external returns (uint256);

    // イベントに参加登録する
    function participateEvent(
        uint256 eventID, // イベントID
        address account // 参加登録をするアカウント
    ) external;
}
