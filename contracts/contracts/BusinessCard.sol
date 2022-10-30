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
    function tokenID(address author) public view override returns (uint256) {
        return _accountToTokenID[author];
    }

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
    function setProfileResource(string memory resourceURI) external override {
        uint256 tokenID = _obtainTokenID(msg.sender);

        _setURI(tokenID, resourceURI);
    }

    function mint(address to) external override returns (uint256) {
        uint256 tokenID = _obtainTokenID(msg.sender);

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
        require(
            from == address(0) || to == address(0),
            "only mint/burn is allowed"
        );

        // (2) 受け取り主が名刺を既に保有しているかチェックする
        for (uint256 index = 0; index < ids.length; index++) {
            require(
                balanceOf(to, ids[index]) == 0,
                "recipient has token already"
            );
        }

        // (3) 2個以上同じトークンを送信(mint/burn)していないかチェック
        for (uint256 index = 0; index < amounts.length; index++) {
            require(
                amounts[index] <= 1,
                "2 of more tokens of a type can't be sent"
            );
        }
    }

    // private
    // 名刺の発行主のトークンIDを取得する
    // まだ、無い場合はトークンIDを割り振って記録する
    function _obtainTokenID(address author) private returns (uint256) {
        if (_accountToTokenID[author] > 0) {
            return _accountToTokenID[author];
        }

        uint256 tokenID = _tokenIds.current();

        _tokenIds.increment();

        // 1-indexed
        _accountToTokenID[author] = tokenID + 1;

        return tokenID;
    }
}
