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

    // BusinessCardDesignのトークンIDを保有し、現在使用しているデザインを表す
    mapping(address => uint256) _accountToDesignID;

    Counters.Counter private _designIDs;

    modifier designExists(uint256 designID) {
        require(designID <= _designIDs.current(), "design is not registered");
        _;
    }

    // ERC1155のURIはパスの末尾が連番であることを要求するためIPFSなどと相性が悪い
    // そのため、ERC1155のURIには空文字列をセットし、ERC1155URIStorageを使用する
    constructor(string memory baseURI) ERC1155("") {
        super._setBaseURI(baseURI);
    }

    // view functions
    function hasCardDesign(uint256 cardDesignID, address account)
        public
        view
        override
        returns (bool)
    {
        return balanceOf(account, cardDesignID) > 0;
    }

    function designID(address author) public view override returns (uint256) {
        return _accountToDesignID[author];
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
    function registerResource(string memory tokenURI)
        external
        override
        onlyOwner
        returns (uint256)
    {
        uint256 newDesignID = _getNewDesignID();

        super._setURI(newDesignID, tokenURI);

        return newDesignID;
    }

    function setDesignID(uint256 designID) external override {
        require(
            hasCardDesign(designID, msg.sender),
            "account doesn't have the design"
        );

        _accountToDesignID[msg.sender] = designID;
    }

    function mint(
        address to,
        uint256 designID,
        uint256 number
    ) external override onlyOwner designExists(designID) returns (uint256) {
        // XXX: Check the usecase of data argument
        _mint(to, designID, number, "");
    }

    // TODO: batch mint

    // private function
    // override
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
                "can't send all of selected design tokens"
            );
        }
    }

    function _getNewDesignID() private returns (uint256) {
        uint256 newDesignID = _designIDs.current();

        _designIDs.increment();

        // 1-indexed
        return newDesignID + 1;
    }
}
