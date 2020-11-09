const axios = require("axios");

const GeotabApi = require("mg-api-js");
const { GT_E, GT_P, GT_DB, GT_SERV } = process.env;


//this is the POC- can we get the user and breadcrumb information. See MULTICALL on https://github.com/Geotab/mg-api-js

const breadcrumb = async () => {
  const api = await new GeotabApi({
    credentials: {
      database: GT_DB,
      userName: GT_E,
      password: GT_P
    },
    path: `https://${GT_SERV}.geotab.com`
  });

  let feed = (function() {
    var version = "0000000000000000";
    return {
      next: function(success) {
        api.call(
          "GetFeed",
          {
            typeName: "Trip",
            resultsLimit: 100,
            fromVersion: version,
            search: {
              toDate: new Date().toISOString(),
              fromDate: new Date(
                new Date().getTime() - 7 * 24 * 60 * 60 * 1000
              ).toISOString()
            }
          },
          function(result) {
            version = result.toVersion;
            success(result.data);
          }
        );
      },
      reset: function() {
        version = "0000000000000000";
      }
    };
  })();

  feed.next(function(trips) {
    console.log("First part: ", trips);
    feed.next(function(trips) {
      console.log(trips, "Second part")
    });
  });
};

module.exports = {
  breadcrumb
};
