pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./IEventNFT.sol";
import "./IPOAP.sol";

interface IERC20OrERC721 {
    function balanceOf(address _owner) external view returns (uint256);
}

// ERC721
contract EventNFT is IEventNFT, ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // Types
    struct Event {
        uint256 startedAt; // 開始タイムスタンプ
        uint256 endedAt; // 終了タイムスタンプ
        uint256 limitOfParticipants; // トータルの参加できる数
        uint256 numberOfParticipants; // 参加予定者合計
        uint256 numberOfAttendance; // 出席者合計
        IEventNFT.ParticipantType participantType;
        address targetTokenAddress;
        uint256 targetTokenID;
    }

    // アカウントの参加ステータスを示すenum
    // NotParticipated: ゼロ値、参加登録をしていない
    // Participated: 参加登録をした
    // Attended: 実際に参加して、POAPを取得した
    // Canceled: 参加前にキャンセルした
    enum ParticipationStatus {
        NotParticipated,
        Participated,
        Attended,
        Canceled
    }

    // Events
    event EventCreated(
        uint256 eventID,
        address indexed createdBy,
        uint256 startedAt,
        uint256 endedAt,
        uint256 limitOfParticipants,
        string participantType,
        address targetTokenAddress,
        uint256 targetTokenID
    );

    event Participated(
        uint256 indexed eventID,
        address indexed participant,
        uint256 numberOfParticipants,
        uint256 numberOfAttendance
    );

    event Attended(
        uint256 indexed eventID,
        address indexed participant,
        uint256 poapID,
        uint256 numberOfParticipants,
        uint256 numberOfAttendance
    );

    // Constants
    string public constant TOKEN_NAME = "CupcapEvent";
    string public constant TOKEN_SYMBOL = "CPE";

    // Error Messages
    string public constant ERROR_EVENT_NOT_FOUND = "event not found";
    string public constant ERROR_PAST_ENDED_AT =
        "event end time must be after start time";
    string public constant ERROR_PARTICIPATED_ALREADY =
        "account has participated in already";
    string public constant ERROR_EVENT_ENDED_ALREADY =
        "event has ended already";
    string public constant ERROR_REACH_PARTICIPANTS_LIMIT =
        "total of participants has reached limit";
    string public constant ERROR_NOT_PARTICIPANTED =
        "account has not registered as participant";
    string public constant ERROR_ATTENDED_ALREADY =
        "account has attended already";

    // Fields
    IPOAP _poap;
    mapping(uint256 => Event) public _events;
    mapping(uint256 => mapping(address => ParticipationStatus)) _participations;
    Counters.Counter private _tokenIds;

    // Modifiers
    modifier eventExists(uint256 eventID) {
        require(_events[eventID].startedAt != 0, ERROR_EVENT_NOT_FOUND);
        _;
    }

    constructor(IPOAP poap) ERC721(TOKEN_NAME, TOKEN_SYMBOL) {
        _poap = poap;
    }

    // View functions
    function poap() public view override returns (IPOAP) {
        return _poap;
    }

    function tokenURI(uint256 tokenID)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage, IERC721Metadata)
        returns (string memory)
    {
        return super.tokenURI(tokenID);
    }

    function participantTypeToString(IEventNFT.ParticipantType e)
        public
        view
        returns (string memory)
    {
        if (e == IEventNFT.ParticipantType.Any) {
            return "any";
        }

        if (e == IEventNFT.ParticipantType.ERC20) {
            return "erc20";
        }

        if (e == IEventNFT.ParticipantType.ERC721) {
            return "erc721";
        }

        if (e == IEventNFT.ParticipantType.ERC1155) {
            return "erc1155";
        }
    }

    // External functions
    // イベントを作成する
    function createEvent(
        address host,
        string memory resourceURI,
        uint256 limitOfParticipants,
        uint256 startedAt,
        uint256 endedAt,
        IEventNFT.ParticipantType participantType,
        address targetTokenContract,
        uint256 targetTokenTypeID
    ) external override onlyOwner returns (uint256) {
        return
            _createEvent(
                host,
                resourceURI,
                limitOfParticipants,
                startedAt,
                endedAt,
                participantType,
                targetTokenContract,
                targetTokenTypeID
            );
    }

    // イベントに参加登録する
    function participateEvent(uint256 eventID, address account)
        external
        onlyOwner
        eventExists(eventID)
    {
        return _participateEvent(eventID, account);
    }

    // イベントに参加する
    function attendEvent(uint256 eventID, address account)
        external
        override
        onlyOwner
        eventExists(eventID)
    {
        return _attendEvent(eventID, account);
    }

    // Private functions
    function _getNewTokenID() private returns (uint256) {
        // 1 based index
        _tokenIds.increment();

        return _tokenIds.current();
    }

    function _burn(uint256 tokenID)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenID);
    }

    function _createEvent(
        address host, // 主催者兼NFT保有者
        string memory resourceURI,
        uint256 limitOfParticipants, // 0の場合は無制限
        uint256 startedAt, // 0の場合は現在時刻
        uint256 endedAt, // 0の場合は無制限
        IEventNFT.ParticipantType participantType,
        address targetTokenAddress,
        uint256 targetTokenTypeID
    ) private returns (uint256) {
        // 0の場合はブロックタイムスタンプを開始時刻とする
        if (startedAt == 0) {
            startedAt = block.timestamp;
        }

        require(
            // endedAtが指定されていない
            // または
            // 終了時刻が開始時刻の後である
            // ことを要求する
            endedAt == 0 || startedAt < endedAt,
            ERROR_PAST_ENDED_AT
        );

        if (participantType == IEventNFT.ParticipantType.Any) {
            require(
                targetTokenAddress == address(0x0),
                "targetTokenAddress must be zero"
            );

            require(targetTokenTypeID == 0, "targetTokenTypeID must be zero");
        } else {
            require(
                targetTokenAddress != address(0x0),
                "target token address is required"
            );

            if (
                participantType == IEventNFT.ParticipantType.ERC20 ||
                participantType == IEventNFT.ParticipantType.ERC721
            ) {
                // ERC1155ではないので, IDはゼロ
                require(
                    targetTokenTypeID == 0,
                    "targetTokenTypeID must be zero"
                );

                IERC20OrERC721 token = IERC20OrERC721(targetTokenAddress);

                // 呼び出しチェック
                require(
                    token.balanceOf(address(this)) >= 0,
                    "contract doesn't support balanecOf"
                );
            } else if (participantType == IEventNFT.ParticipantType.ERC1155) {
                IERC1155 token = IERC1155(targetTokenAddress);

                // 呼び出しチェック
                require(
                    token.balanceOf(address(this), targetTokenTypeID) >= 0,
                    "contract doesn't support balanceOf"
                );
            }
        }

        uint256 tokenID = _getNewTokenID();

        // NFT作成とリソースの登録
        _safeMint(host, tokenID);
        _setTokenURI(tokenID, resourceURI);

        // レコードの登録
        _events[tokenID] = Event({
            startedAt: startedAt,
            endedAt: endedAt,
            limitOfParticipants: limitOfParticipants,
            numberOfParticipants: 0,
            numberOfAttendance: 0,
            participantType: participantType,
            targetTokenAddress: targetTokenAddress,
            targetTokenID: targetTokenTypeID
        });

        emit EventCreated(
            tokenID,
            host,
            startedAt,
            endedAt,
            limitOfParticipants,
            participantTypeToString(participantType),
            targetTokenAddress,
            targetTokenTypeID
        );

        return tokenID;
    }

    // イベントに参加登録する
    function _participateEvent(
        uint256 eventID, // イベントID
        address account // 参加者のアドレス
    ) private {
        Event storage ev = _events[eventID];

        ParticipationStatus currentStatus = _participations[eventID][account];
        // 参加登録済みや参加済みは新たに参加できない
        require(
            currentStatus != ParticipationStatus.Participated &&
                currentStatus != ParticipationStatus.Attended,
            ERROR_PARTICIPATED_ALREADY
        );

        // トークン保有者専用の場合はチェック
        if (
            ev.participantType == IEventNFT.ParticipantType.ERC20 ||
            ev.participantType == IEventNFT.ParticipantType.ERC721
        ) {
            IERC20OrERC721 token = IERC20OrERC721(ev.targetTokenAddress);

            require(token.balanceOf(account) > 0, "account doesn't have token");
        } else if (ev.participantType == IEventNFT.ParticipantType.ERC1155) {
            IERC1155 token = IERC1155(ev.targetTokenAddress);

            require(
                token.balanceOf(account, ev.targetTokenID) > 0,
                "account doesn't have token"
            );
        }

        // イベント終了前かチェック
        require(
            ev.endedAt == 0 || block.timestamp <= ev.endedAt,
            ERROR_EVENT_ENDED_ALREADY
        );

        // アカウントを追加した場合の合計参加予定/参加者数
        uint256 newTotal = ev.numberOfParticipants + ev.numberOfAttendance + 1;
        require(
            newTotal <= ev.limitOfParticipants,
            ERROR_REACH_PARTICIPANTS_LIMIT
        );

        uint256 newNumberOfParticipants = ev.numberOfParticipants + 1;
        uint256 newNumberOfAttendance = ev.numberOfAttendance;
        ParticipationStatus newStatus = _participations[eventID][account];

        // 参加登録
        newStatus = ParticipationStatus.Participated;
        emit Participated(
            eventID,
            account,
            newNumberOfParticipants,
            newNumberOfAttendance
        );

        if (block.timestamp >= ev.startedAt) {
            // イベントが既に開始している場合は、参加済みとする
            newNumberOfParticipants -= 1;
            newNumberOfAttendance += 1;
            newStatus = ParticipationStatus.Attended;

            uint256 poapID = _issuePOAP(eventID, account);

            emit Attended(
                eventID,
                account,
                poapID,
                newNumberOfParticipants,
                newNumberOfAttendance
            );
        }

        ev.numberOfParticipants = newNumberOfParticipants;
        ev.numberOfAttendance = newNumberOfAttendance;
        _participations[eventID][account] = newStatus;
    }

    // イベントに参加する
    function _attendEvent(uint256 eventID, address account) private {
        // 参加登録をしていなかったり、参加済みかチェックする
        ParticipationStatus currentStatus = _participations[eventID][account];
        if (
            currentStatus == ParticipationStatus.NotParticipated ||
            currentStatus == ParticipationStatus.Canceled
        ) {
            revert(ERROR_NOT_PARTICIPANTED);
        } else if (currentStatus == ParticipationStatus.Attended) {
            revert(ERROR_ATTENDED_ALREADY);
        }

        Event storage ev = _events[eventID];
        ev.numberOfParticipants -= 1;
        ev.numberOfAttendance += 1;

        uint256 poapID = _issuePOAP(eventID, account);

        emit Attended(
            eventID,
            account,
            poapID,
            ev.numberOfParticipants,
            ev.numberOfAttendance
        );
    }

    function _issuePOAP(uint256 eventID, address account)
        private
        returns (uint256)
    {
        return _poap.mint(account, eventID);
    }
}
