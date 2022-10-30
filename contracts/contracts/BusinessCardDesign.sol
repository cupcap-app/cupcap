// ERC1155
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IBusinessCardDesign.sol";

// Transferable ERC1155 Semi-fungible
contract BusinessCardDeign is
    IBusinessCardDesign,
    ERC1155,
    ERC1155URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    // Events
    event DesignCreated(uint256 designID, string uri);
    event NewTokenIssued(
        uint256 indexed designID,
        address indexed to,
        uint256 amount
    );
    event DesignSelected(address indexed account, uint256 designID);

    // Error messages
    string public constant ERROR_DESIGN_NOT_FOUND = "design not found";
    string public constant ERROR_ACCOUNT_DOES_NOT_HAVE_DESIGN =
        "account doesn't have the design";
    string public constant ERROR_SELL_ALL_SELECTED_DESIGN =
        "can't send all of selected design tokens";

    // Fields
    // BusinessCardDesignのトークンIDを保有し、現在使用しているデザインを表す
    mapping(address => uint256) _accountToDesignID;

    Counters.Counter private _designIDs;

    modifier designExists(uint256 designID) {
        require(designID <= _designIDs.current(), ERROR_DESIGN_NOT_FOUND);
        _;
    }

    // ERC1155のURIはパスの末尾が連番であることを要求するためIPFSなどと相性が悪い
    // そのため、ERC1155のURIには空文字列をセットし、ERC1155URIStorageを使用する
    constructor(string memory baseURI) ERC1155("") {
        super._setBaseURI(baseURI);
    }

    // view functions
    // アカウントが指定のデザイントークンを持っているか返す
    function hasCardDesign(uint256 cardDesignID, address account)
        public
        view
        override
        returns (bool)
    {
        return balanceOf(account, cardDesignID) > 0;
    }

    // アカウントが選択しているデザインIDを返す
    function selectedDesignID(address author)
        public
        view
        override
        returns (uint256)
    {
        return _accountToDesignID[author];
    }

    // デザインのURIを返す
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
    // 新しいデザインを登録する
    function registerResource(string memory tokenURI)
        external
        override
        onlyOwner
        returns (uint256)
    {
        uint256 newDesignID = _getNextDesignID();

        super._setURI(newDesignID, tokenURI);

        emit DesignCreated(newDesignID, super.uri(newDesignID));

        return newDesignID;
    }

    // デザインsemi-fungibleトークンを新規発行する
    function mint(
        address to,
        uint256 designID,
        uint256 number
    ) external override onlyOwner designExists(designID) {
        _mint(to, designID, number, "");

        emit NewTokenIssued(designID, to, number);
    }

    // アカウントが使用するデザインIDを指定する
    function setDesignID(address to, uint256 designID) external override {
        require(
            hasCardDesign(designID, to),
            ERROR_ACCOUNT_DOES_NOT_HAVE_DESIGN
        );

        _accountToDesignID[to] = designID;

        emit DesignSelected(to, designID);
    }

    // TODO: batch mint

    // private function
    // トークンを送金できるかチェックする
    // 現在使用しているデザインのトークンは0にならないようにする
    function _beforeTokenTransfer(
        address _operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory _data
    ) internal override {
        uint256 currentSenderDesignID = _accountToDesignID[from];

        for (uint256 index = 0; index < ids.length; index++) {
            uint256 id = ids[index];

            if (id != currentSenderDesignID) {
                continue;
            }

            // 現在選択中のデザイントークンを送信する際に0にならないようにする
            require(
                balanceOf(from, id) - amounts[index] > 0,
                ERROR_SELL_ALL_SELECTED_DESIGN
            );
        }
    }

    function _getNextDesignID() private returns (uint256) {
        // 1 based index
        _designIDs.increment();

        return _designIDs.current();
    }
}
