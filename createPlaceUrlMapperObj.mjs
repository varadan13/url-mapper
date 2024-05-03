import initClient from "./initClient.mjs";
import graphqlConfig from "./graphqlConfig.mjs";
import fetchSuburbList from "./requests/fetchSuburbList.mjs";
import fetchPlaceFilters from "./requests/fetchPlaceFilters.mjs";
import saveObject from "./saveObject.mjs";

const states = [
  "New South Wales",
  "Queensland",
  "South Australia",
  "Tasmania",
  "Victoria",
  "Western Australia",
  "Australian Capital Territory",
];

const main = async () => {
  const client = initClient(graphqlConfig.prod);
  let sblArray = [];
  for (let state of states) {
    const sbl = await fetchSuburbList(client, state);
    sblArray = [
      ...sblArray,
      ...sbl.map((ele) => ({
        city: [
          ...ele.city.toLowerCase().split(" "),
          ...state.toLowerCase().split(" "),
        ].join("-"),
        post_code: ele.post_code,
      })),
    ];
  }
  let placeFiltersObj = {};
  for (let sbl of sblArray) {
    try {
      console.log(sbl);
      const pf = await fetchPlaceFilters(
        client,
        sbl.city.toLowerCase().split(" ").join("-"),
        sbl.post_code
      );
      if (
        pf &&
        Array.isArray(pf.cuisine_style) &&
        Array.isArray(pf.business_type)
      ) {
        placeFiltersObj[`${sbl.city}-${sbl.post_code}`] = pf;
      }
    } catch (error) {
      console.log(error);
      // pass
    }
  }
  console.log(Object.keys(placeFiltersObj).length);

  const urls = {};

  for (let suburb of sblArray) {
    const key = `${suburb.city}-${suburb.post_code}`;
    if (placeFiltersObj[key]) {
      const value = placeFiltersObj[key];
      const { cuisine_style, business_type } = value;
      for (let cs of cuisine_style) {
        urls[
          `best-${cs.name.replace(/_/g, "-")}-restaurants-in-${suburb.city}`
        ] = `https://dev11.portal.kravein.com.au/places/${key}?cuisines=${cs.name}&page=1&productType=all&sort=LOCATION`;
      }

      for (let bt of business_type) {
        urls[
          `best-${bt.name.replace(/_/g, "-")}-in-${suburb.city}`
        ] = `https://dev11.portal.kravein.com.au/places/${key}?businessTypes=${bt.name}&page=1&productType=all&sort=LOCATION`;
      }
    }
  }

  console.log(Object.keys(urls).length);

  saveObject(JSON.stringify(urls));
};

main();
