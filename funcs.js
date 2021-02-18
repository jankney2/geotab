const axios = require("axios");

const GeotabApi = require("mg-api-js");
const { GT_E, GT_P, GT_DB, GT_SERV } = process.env;

//this is the POC- can we get the user and breadcrumb information. See MULTICALL on https://github.com/Geotab/mg-api-js

// i'll probably need the user data (for a join table)

//I will also need "exception event" data to recreate the report that josh gets.

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
            typeName: "EventSearch",
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

        for (let i = 0; i < result.length; i++) {
          console.log(result[i]);
        }
      }
    },
    function(error) {
      console.log(error, "user call error");
    }
  );
};

const thiccBoi = async () => {
  const api = await new GeotabApi({
    credentials: {
      database: GT_DB,
      userName: GT_E,
      password: GT_P
    },
    path: `https://${GT_SERV}.geotab.com`
  });

  let calls = [
    ['Get',
      {
        typeName: "ExceptionEvent",
        search: {
          fromDate: new Date("2021-01-01"),
          toDate: new Date("2021-01-15")
        }
      }
    ],
    [
      'Get',
      {
        typeName: "User",
        
      }
    ],
    [
      'Get',
      {
        typeName: "Trip",
        search: {
          fromDate:new Date('2021-01-01'),
          toDate:new Date('2021-01-31'),
        }
      }
    ],
  ];

  let myMultiCall = api.multiCall(calls);

  myMultiCall
    .then(data => console.log(`Server response: infraction length ${data[0].length} user length: ${data[1].length}, ${data[2].length} `)
    
    
    )
    .catch(error => console.log(error));
};

const infractions = async () => {
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
      typeName: "ExceptionEvent",
      search: {
        fromDate: new Date("2021-02-01"),
        toDate: new Date("2021-02-03")
      }
    },
    function(result) {
      console.log(result.length);

      if (result !== null && result.length > 0) {
        console.log(result.length, "user result");

        for (let i = 0; i < result.length; i++) {
          // console.log(result[i]);
        }
      }
    },
    function(error) {
      console.log(error, "user call error");
    }
  );
};

module.exports = {
  breadcrumb,
  users,
  infractions,
  thiccBoi
};
