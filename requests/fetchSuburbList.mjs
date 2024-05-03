import { listSuburbs } from "./queries.gql.mjs";

const fetchSuburbList = async (client, state) => {
  const {
    search_state_places: { state_places },
  } = await client.request(listSuburbs, { state });

  return state_places;
};

export default fetchSuburbList;
