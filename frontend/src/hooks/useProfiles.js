import React from "react";
import { GraphQLClient, gql } from "graphql-request";
import { useQuery } from "react-query";

const REACT_APP_PROFILE_API_URL = process.env.REACT_APP_PROFILE_API_URL;

const graphQLClient = new GraphQLClient(REACT_APP_PROFILE_API_URL, {
  headers: {
    "x-hasura-admin-secret": process.env.REACT_APP_HASURA_API_KEY,
    "content-type": "application/json",
  },
});

// イベントをクエリする
export const useProfiles = () => {
  return useQuery(["profiles"], () => {
    return graphQLClient.request(
      gql`
        query {
          profiles {
            address
            avatar
            com_discord
            com_github
            com_twitter
            created_at
            description
            design_card_id
            display_name
            email
            org_telegram
            updated_at
            url
          }
        }
      `
    );
  });
};

export const useProfileByAddress = (address) => {
  return useQuery(["profiles", address], () => {
    return graphQLClient.request(
      gql`
        query {
            profiles_by_pk(address: "${address}") {
                address
                avatar
                com_discord
                com_github
                com_twitter
                created_at
                description
                design_card_id
                display_name
                email
                org_telegram
                updated_at
                url
              }
          }
        `
    );
  });
};

export function writeProfile(record) {
  graphQLClient.request(
    gql`
    mutation {
        insert_profiles(objects: [{
            address: "${record.address}",
            avatar: "${record.avatar}",
            com_discord: "${record.discord}",
            com_github: "${record.github}",
            com_twitter: "${record.twitter}",
            description: "${record.description}",
            design_card_id: ${record.design_card_id},
            display_name: "${record.display_name}",
            email: "${record.email}",
            org_telegram: "${record.telegram}",
            url: "${record.url}"
        }]) {
            returning {
            address
            avatar
            com_discord
            com_github
            com_twitter
            created_at
            description
            design_card_id
            display_name
            email
            org_telegram
            updated_at
            url
            }
        }
    }
    `
  );
}

export function updateProfile(address, record) {
  graphQLClient.request(
    gql`
      mutation update_a_profile {
        update_profiles_by_pk (
            pk_columns: {address: "${address}"}
            _set: {
                avatar: "${record.avatar}",
                com_discord: "${record.discord}",
                com_github: "${record.github}",
                com_twitter: "${record.twitter}",
                description: "${record.description}",
                design_card_id: ${record.design_card_id},
                display_name: "${record.display_name}",
                email: "${record.email}",
                org_telegram: "${record.telegram}",
                url: "${record.url}"
            }
        ) {
            address
            avatar
            com_discord
            com_github
            com_twitter
            created_at
            description
            design_card_id
            display_name
            email
            org_telegram
            updated_at
            url
        }
      }
      `
  );
}
