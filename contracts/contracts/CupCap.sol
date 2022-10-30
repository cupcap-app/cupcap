// ERC1155
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IEventNFT.sol";
import "./POAP.sol";
import "./IBusinessCardDesign.sol";
import "./IBusinessCard.sol";

contract CupCap is Ownable, Pausable {
    // references
    IEventNFT public _eventNFT;
    IPOAP public _poap;
    IBusinessCardDesign public _businessCardDesign;
    IBusinessCard public _businessCard;

    constructor(
        IEventNFT eventNFT,
        IPOAP poap,
        IBusinessCardDesign businessCardDesign,
        IBusinessCard businessCard
    ) {
        _eventNFT = eventNFT;
        _poap = poap;
        _businessCardDesign = businessCardDesign;
        _businessCard = businessCard;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // イベントを作成する
    // 作成されたイベントNFTのIDを返す
    function createEvent(
        address host, // 主催者
        string memory resourceURI, // JSONリソースのURI
        uint256 limitOfParticipants, // 参加者の上限
        uint256 startedAt,
        uint256 endedAt,
        bool shouldHostInclude
    ) external whenNotPaused returns (uint256) {
        uint256 eventID = _eventNFT.createEvent(
            host,
            resourceURI,
            limitOfParticipants,
            startedAt,
            endedAt
        );

        if (shouldHostInclude) {
            _eventNFT.participateEvent(eventID, host);
        }

        return eventID;
    }

    // イベントに参加登録をする
    function participateEvent(uint256 eventID) external whenNotPaused {
        _eventNFT.participateEvent(eventID, msg.sender);
    }

    // 主催者が任意のアドレスをイベントに参加登録させる
    function participateEventByHost(uint256 eventID, address account)
        external
        whenNotPaused
    {
        require(
            _eventNFT.ownerOf(eventID) == msg.sender,
            "only event host can call"
        );

        _eventNFT.participateEvent(eventID, account);
    }

    // 新しい名刺デザインを作成する
    function createBusinessCardDesign(string memory resourceURI)
        external
        onlyOwner
        whenNotPaused
        returns (uint256)
    {
        return _businessCardDesign.registerResource(resourceURI);
    }

    // 名刺デザイントークンを新規発行する
    function mintDesignToken(
        address to,
        uint256 designID,
        uint256 number
    ) external whenNotPaused {
        _businessCardDesign.mint(to, designID, number);
    }

    // アカウントが使用するデザインを選択する
    function selectDesign(uint256 designID) external whenNotPaused {
        _businessCardDesign.setDesignID(msg.sender, designID);
    }

    // 名刺の情報のリソースURIを保存する
    // 例
    // ipfs://[hash]
    // ens://[domain]
    // XXX: これが必要か検討中
    function setBusinessCardResource(string memory resourceURI)
        external
        whenNotPaused
    {
        _businessCard.setProfileResource(msg.sender, resourceURI);
    }

    // 名刺を送る
    function sendBusinessCard(address to) external whenNotPaused {
        _businessCard.mint(msg.sender, to);
    }
}
