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
                new Date().getTime() - 2 * 24 * 60 * 60 * 1000
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
    //this is probably where you'd do the db Add
    console.log("First part: ", trips.length);
    feed.next(function(trips) {
      console.log(trips.length, "Second part");
    });
  });
};

const users = async () => {
  const api = await new GeotabApi({
    credentials: {
      database: GT_DB,
      userName: GT_E,
      password: GT_P
    },
    path: `https://${GT_SERV}.geotab.com`
  });

  api.call(
    "Get",
    {
      typeName: "User"
    },
    function(result) {
      if (result !== null && result.length > 0) {
        console.log(result.length, "user result");

        for(let i=0;i<result.length;i++){
            console.log(result[i].name)
        }
      }
    }, 
    function(error){
        console.log(error, 'user call error')
    }
  );
};

module.exports = {
  breadcrumb, 
  users
};
