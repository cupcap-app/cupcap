// ERC1155
pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./IEventNFT.sol";
import "./POAP.sol";
import "./IBusinessCardDesign.sol";
import "./IBusinessCard.sol";

contract CupCap is Ownable, Pausable {
    using ECDSA for bytes32;

    // references
    IEventNFT public _eventNFT;
    IBusinessCardDesign public _businessCardDesign;
    IBusinessCard public _businessCard;

    constructor(
        IEventNFT eventNFT,
        IBusinessCardDesign businessCardDesign,
        IBusinessCard businessCard
    ) {
        _eventNFT = eventNFT;
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

        // TODO: なぜか動かない
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
    // XXX: 署名必要にするか？
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

    // イベントに参加する
    function attendEvent(uint256 eventID) external whenNotPaused {
        _eventNFT.attendEvent(eventID, msg.sender);
    }

    // 主催者が任意のアドレスをイベントを参加させる
    function attendEventByHost(uint256 eventID, address account)
        external
        whenNotPaused
    {
        require(
            _eventNFT.ownerOf(eventID) == msg.sender,
            "only event host can call"
        );

        _eventNFT.attendEvent(eventID, account);
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

    // 名刺を受け取る (受け取り主がガスコストを支払う)
    function takeBusinessCard(address from, bytes memory signature)
        external
        whenNotPaused
    {
        // XXX: 署名対象の内容が十分か
        // 複数個の名刺は作成できないため、ナンスはいらない...?
        bytes memory message = abi.encodePacked(
            "[",
            from,
            ",",
            msg.sender,
            "]"
        );

        require(_verify(message, signature, from), "signature is invalid");

        _businessCard.mint(from, msg.sender);
    }

    function _verify(
        bytes memory data,
        bytes memory signature,
        address account
    ) internal pure returns (bool) {
        return
            keccak256(data).toEthSignedMessageHash().recover(signature) ==
            account;
    }
}
