{
    "version": 2,
    "builds": [
      {
        "src": "public/*.html",
        "use": "@vercel/static"
      },
      {
        "src": "public/*.css",
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
        "dest": "/public/gift.html"
      },
      {
        "src": "/api/(.*)",
        "dest": "/api/$1"
      },
      {
        "src": "/(.*)",
        "dest": "/public/$1"
      }
    ]
  }