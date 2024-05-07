import { gql } from "graphql-request";

export const listSuburbs = gql`
  query listSuburbs($state: String) {
    search_state_places(
      input: { filter: { place_filter: { state: $state } }, from: 0, size: 700 }
    ) {
      state_places {
        post_code
        city
      }
    }
  }
`;

export const placeFilters = gql`
  query placeFilters($slug: String, $postCode: String) {
    search_location_places(
      input: {
        filter: {
          location_filter: { type: "city", slug: $slug, post_code: $postCode }
        }
      }
    ) {
      place_listing {
        cuisine_style {
          description
          display_order
          name
        }
        business_type {
          description
          display_order
          name
        }
      }
    }
  }
`;

const searchLocationItemsQuery = gql`
  query searchLocationItemsQuery($input: SearchInput) {
    search_location_items(input: $input) {
      total_pages
      total_size
      location_data {
        code
        country_id
        country_name
        latitude
        location
        longitude
        name
        post_code
        slug
        state_name
      }
      item_listing {
        average_rating
        item_id
        place_id
        slug
        item_dictionary_id
        place_name
        status
        approval_status
        listing_approved
        item_review_place
        default_url
        display_order
        name
        slug
        star_count
        love_count
        tried_count
        share_count
        loved_percentage
        address_line_1
        address_line_2
        city
        state
        country
        post_code
        latitude
        longitude
        location
        default_image_url
        default_image_url_upload {
          name
        }
      }
      item_aggregation {
        aggregation_name
        aggregation_listing {
          name
          description
          count
        }
      }
    }
  }
`;

export default {};
