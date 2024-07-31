dmx.config({
  "resetpassword": {
    "query": [
      {
        "type": "text",
        "name": "user"
      },
      {
        "type": "text",
        "name": "token"
      }
    ]
  },
  "noise": {
    "query": [
      {
        "type": "array",
        "name": "mappedData"
      }
    ]
  },
  "noiseinsights": {
    "query": [
      {
        "type": "text",
        "name": "Offset"
      },
      {
        "type": "text",
        "name": "m_location"
      },
      {
        "type": "text",
        "name": "year"
      }
    ]
  },
  "waterdata": {
    "query": [
      {
        "type": "text",
        "name": "offset"
      }
    ]
  },
  "portal_layout": {
    "query": [
      {
        "type": "text",
        "name": "m_location"
      }
    ]
  },
  "noisedata": {
    "query": [
      {
        "type": "text",
        "name": "sort"
      },
      {
        "type": "text",
        "name": "dir"
      }
    ]
  }
});
