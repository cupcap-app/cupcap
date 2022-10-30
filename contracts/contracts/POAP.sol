pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPOAP.sol";

// ERC1155
contract POAP is IPOAP, ERC1155, Ownable {
    constructor() ERC1155("") {}

    mapping(uint256 => uint256) _lastPOAPID;
    mapping(uint256 => mapping(address => uint256)) _poapID;

    function getID(uint256 eventID, address account)
        external
        view
        override
        returns (uint256)
    {
        return _getID(eventID, account);
    }

    function has(uint256 eventID, address account)
        external
        view
        override
        returns (bool)
    {
        return _has(eventID, account);
    }

    function mint(address to, uint256 eventID)
        external
        override
        onlyOwner
        returns (uint256)
    {
        require(
            !_has(eventID, to),
            "POAP has been issued to the account already"
        );

        uint256 poapID = _getNextPOAPID(eventID);

        _mint(to, eventID, 1, "");

        _poapID[eventID][to] = poapID;
    }

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
                "recipient has POAP already"
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

    function _getNextPOAPID(uint256 eventID) private returns (uint256) {
        uint256 nextID = _lastPOAPID[eventID] + 1;

        _lastPOAPID[eventID] = nextID;

        return nextID;
    }

    function _getID(uint256 eventID, address account)
        internal
        view
        returns (uint256)
    {
        return _poapID[eventID][account];
    }

    function _has(uint256 eventID, address account)
        internal
        view
        returns (bool)
    {
        return _getID(eventID, account) != 0;
    }
}
