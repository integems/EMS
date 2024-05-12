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
  }
});
