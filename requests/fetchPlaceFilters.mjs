import { placeFilters } from "./queries.gql.mjs";

const fetchPlaceFilters = async (client, slug, postCode) => {
  const res = await client.request(placeFilters, { slug, postCode });

  return Array.isArray(res?.search_location_places?.place_listing)
    ? res.search_location_places.place_listing[0]
    : {};
};

export default fetchPlaceFilters;
