{
    "version": 2,
    "routes": [
      {
        "src": "/gift/(.*)",
        "dest": "/gift.html",
        "headers": {
          "Cache-Control": "no-cache"
        }
      },
      {
        "src": "/api/.*",
        "dest": "/api"
      },
      {
        "src": "/(.*)",
        "dest": "/index.html"
      }
    ]
  }