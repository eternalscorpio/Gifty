{
    "version": 2,
    "builds": [
      {
        "src": "*.html",
        "use": "@vercel/static"
      },
      {
        "src": "api/**/*.js",
        "use": "@vercel/node"
      }
    ],
    "routes": [
      {
        "src": "/gift/([a-zA-Z0-9]+)",
        "dest": "/gift.html"
      },
      {
        "src": "/api/(.*)",
        "dest": "/api/$1"
      },
      {
        "src": "/",
        "dest": "/index.html"
      }
    ]
  }