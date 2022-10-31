pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPOAP.sol";

// ERC1155
contract POAP is IPOAP, ERC1155, Ownable {
    // Events
    event Issued(uint256 indexed eventID, address indexed account, uint256 index);

    // Constants
    string public constant ERROR_TRANSFER_POAP = "transfer POAP is not allowed";
    string public constant ERROR_POAP_ISSUED_ALREADY =
        "recipient has POAP already";
    string public constant ERROR_ISSUE_MULTIPLE_POAP =
        "2 or more POAPs for one event can't be issued";

    // Fields
    mapping(uint256 => uint256) _lastPOAPID; // event ID => last POAP ID
    mapping(uint256 => mapping(address => uint256)) _poapIDs;

    constructor() ERC1155("") {}

    // イベントのPOAPのIDを返す。持っていない場合は0を返す
    function getID(uint256 eventID, address account)
        external
        view
        override
        returns (uint256)
    {
        return _getPOAPID(eventID, account);
    }

    // イベントのPOAPを持っているか
    function has(uint256 eventID, address account)
        external
        view
        override
        returns (bool)
    {
        return _has(eventID, account);
    }

    // イベントのPOAPを発行する
    function mint(address to, uint256 eventID)
        external
        override
        onlyOwner
        returns (uint256)
    {
        require(!_has(eventID, to), ERROR_POAP_ISSUED_ALREADY);

        uint256 poapID = _getNextPOAPID(eventID);

        _mint(to, eventID, 1, "");

        _poapIDs[eventID][to] = poapID;

        emit Issued(eventID, to, poapID);

        return poapID;
    }

    // POAPを送信できるかチェックする
    function _beforeTokenTransfer(
        address _operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory _data
    ) internal view override {
        // (1) SBTにするための制約, mint/burnしかできないようにする
        require(from == address(0) || to == address(0), ERROR_TRANSFER_POAP);

        // (2) 受け取り主がを既に保有しているかチェックする
        for (uint256 index = 0; index < ids.length; index++) {
            require(balanceOf(to, ids[index]) == 0, ERROR_POAP_ISSUED_ALREADY);
        }

        // (3) 2個以上同じトークンを送信(mint/burn)していないかチェック
        for (uint256 index = 0; index < amounts.length; index++) {
            require(amounts[index] <= 1, ERROR_ISSUE_MULTIPLE_POAP);
        }
    }

    // 次のPOAPのIDを返す。POAP IDは1-based
    function _getNextPOAPID(uint256 eventID) private returns (uint256) {
        uint256 nextID = _lastPOAPID[eventID] + 1;

        _lastPOAPID[eventID] = nextID;

        return nextID;
    }

    // アカウントのPOAP IDを返す
    function _getPOAPID(uint256 eventID, address account)
        internal
        view
        returns (uint256)
    {
        return _poapIDs[eventID][account];
    }

    // アカウントが指定したイベントのPOAPを持っているか返す
    function _has(uint256 eventID, address account)
        internal
        view
        returns (bool)
    {
        return _getPOAPID(eventID, account) != 0;
    }
}
