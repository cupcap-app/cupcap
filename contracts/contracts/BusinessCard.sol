// ERC1155
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IBusinessCard.sol";

// ERC1155 Soul Bound Semi Fungible Token
contract BusinessCard is IBusinessCard, ERC1155, ERC1155URIStorage, Ownable {
    using Counters for Counters.Counter;

    // Errors
    string public constant ERROR_TRANSFER = "Can't transfer token";
    string public constant ERROR_BUSINESS_CARD_SENT_ALREADY =
        "recipient has token already";
    string public constant ERROR_SENDING_MULTIPLE_BUSINESS_CARDS =
        "2 of more tokens of a type can't be sent";

    Counters.Counter private _tokenIds;

    // アカウントごとのトークンIDを保有するマッピング
    // １つのアカウントは単一のトークンIDを持つ
    mapping(address => uint256) _accountToTokenID;

    constructor() ERC1155("") {
        // プロフィールの保存場所がENSとarweaveの2通り以上があるため
        // URIの共通なプレフィックは指定できない
        _setBaseURI("");
    }

    // view functions
    // アカウントの名刺IDを返す
    function tokenID(address author) public view override returns (uint256) {
        return _accountToTokenID[author];
    }

    // アカウントの名刺URIを返す
    function uri(uint256 tokenID)
        public
        view
        virtual
        override(ERC1155, ERC1155URIStorage, IERC1155MetadataURI)
        returns (string memory)
    {
        return super.uri(tokenID);
    }

    // external functions
    // アカウントのリソースURIをセットする
    function setProfileResource(address account, string memory resourceURI)
        external
        override
    {
        uint256 tokenID = _obtainTokenID(account);

        _setURI(tokenID, resourceURI);
    }

    // アカウントの名刺を新たに発行する
    function mint(address from, address to) external override {
        uint256 tokenID = _obtainTokenID(from);

        _mint(to, tokenID, 1, "");
    }

    // override
    // 名刺コントラクトの性質を満たすためのチェックを実装する
    function _beforeTokenTransfer(
        address _operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory _data
    ) internal override {
        // (1) SBTにするための制約, mint/burnしかできないようにする
        require(from == address(0) || to == address(0), ERROR_TRANSFER);

        // (2) 受け取り主が名刺を既に保有しているかチェックする
        for (uint256 index = 0; index < ids.length; index++) {
            require(
                balanceOf(to, ids[index]) == 0,
                ERROR_BUSINESS_CARD_SENT_ALREADY
            );
        }

        // (3) 2個以上同じトークンを送信(mint/burn)していないかチェック
        for (uint256 index = 0; index < amounts.length; index++) {
            require(amounts[index] <= 1, ERROR_SENDING_MULTIPLE_BUSINESS_CARDS);
        }
    }

    // private
    // 名刺の発行主のトークンIDを取得する
    // まだ、無い場合はトークンIDを割り振って記録する
    function _obtainTokenID(address author) private returns (uint256) {
        if (_accountToTokenID[author] > 0) {
            return _accountToTokenID[author];
        }

        // 1 based index
        _tokenIds.increment();

        // 1-indexed
        _accountToTokenID[author] = _tokenIds.current();

        return _accountToTokenID[author];
    }
}
