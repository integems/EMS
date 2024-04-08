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
  }
});
