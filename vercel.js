{
    "rewrites": [
      {
        "source": "/gift/:giftId",
        "destination": "/gift.html"
      },
      {
        "source": "/api/:path*",
        "destination": "/api/:path*"
      },
      {
        "source": "/:path*",
        "destination": "/index.html"
      }
    ]
  }