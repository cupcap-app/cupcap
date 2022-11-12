import React from "react";
import { request, gql } from "graphql-request";
import { useQuery } from "react-query";

const GRAPH_URL = process.env.REACT_APP_GRAPH_URL;

// イベントをクエリする
export const useEvents = (queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "startedAt", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["events", queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
        {
          events(skip: ${offset}, limit: ${limit} orderBy: ${orderBy}, orderDirection: ${orderDirection}) {
            id
            createdBy
            startedAt
            endedAt
            limitOfParticipants
            numberOfParticipants
            numberOfAttendance
            participantType
            targetTokenAddress
            targetTokenID
          }
        }
      `
    );
  });
};

// イベントを日付で絞ってクエリする
// 時刻は秒単位のUNIXタイム
// XXX: 現状だとandで条件をつなげる方法が分からない
export const useEventInTimeRange = (from, to, queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "startedAt", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["events", from, to, queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
          {
            events(
                skip: ${offset},
                limit: ${limit},
                orderBy: ${orderBy},
                orderDirection: ${orderDirection},
                where: { startedAt_gte: "${from}" } }
            ) {
              id
              createdBy
              startedAt
              endedAt
              limitOfParticipants
              numberOfParticipants
              numberOfAttendance
              participantType
              targetTokenAddress
              targetTokenID
            }
          }
        `
    );
  });
};

// イベント参加者
// eventIDは数字
export const useParticipantsByEventID = (eventID, queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "eventID", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["participants", queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
          {
            participants(
                skip: ${offset},
                limit: ${limit},
                orderBy: ${orderBy},
                orderDirection: ${orderDirection},
                where: {eventID: "${eventID}"}
            ) {
              id
              eventID
              account
              status
              poapID
            }
          }
        `
    );
  });
};

// アカウント毎の参加情報
export const useParticipantsByAccount = (account, queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "eventID", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["participants", account, queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
            {
            participants(
                skip: ${offset},
                limit: ${limit},
                orderBy: ${orderBy},
                orderDirection: ${orderDirection},
                where: {account: "${account}"}
            ) {
                id
                eventID
                account
                status
                poapID
              }
            }
          `
    );
  });
};

// イベント毎のPOAP
// eventIDは数字
export const usePOAPsByEventID = (eventID, queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "index", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["poaps", queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
      {
            poaps(
                skip: ${offset},
                limit: ${limit},
                orderBy: ${orderBy},
                orderDirection: ${orderDirection},
                where: {eventID: "${eventID}"}
            ) {
                  id
                  eventID
                  index
                  holder
                }
              }
        `
    );
  });
};

// アカウント毎のPOAP
export const usePOAPsByAccount = (account, queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "index", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["poaps", queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
                {
                poaps(
                    skip: ${offset},
                    limit: ${limit},
                    orderBy: ${orderBy},
                    orderDirection: ${orderDirection},
                    where: {holder: "${account}"}
                ) {
                    id
                    eventID
                    index
                    holder
                  }
                }
          `
    );
  });
};

// 名刺デザインのリスト
export const useBusinessCardDesigns = () => {
  return useQuery(["business_card_designs"], () => {
    return request(
      GRAPH_URL,
      gql`
        {
          businessCardDesigns {
            id
            uri
          }
        }
      `
    );
  });
};

// 保有者でフィルターした
export const useBusinessCardByOwner = (ownerAddress, queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "id", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["business_cards", queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
        {
            businessCards(
                skip: ${offset},
                limit: ${limit},
                orderBy: ${orderBy},
                orderDirection: ${orderDirection},
                where: {to: "${ownerAddress}"}
            ) {
                id
                from
                to
                tokenID
            }
        }
        `
    );
  });
};

export const useBusinessCardBySender = (senderAddress, queryOptions) => {
  const {
    limit = 100, // 数
    offset = 0, // シフト
    orderBy = "id", // ソートに使うフィールド
    orderDirection = "asc", //ソート方向
  } = queryOptions ?? {};

  return useQuery(["business_cards", queryOptions], () => {
    return request(
      GRAPH_URL,
      gql`
          {
            businessCards(
                skip: ${offset},
                limit: ${limit},
                orderBy: ${orderBy},
                orderDirection: ${orderDirection},
                where: {from: "${senderAddress}"}
            ) {
                  id
                  from
                  to
                  tokenID
              }
          }
          `
    );
  });
};
