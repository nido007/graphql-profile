graphql-profile/
├── index.html              # Login page
├── profile.html            # Profile page (protected)
├── styles/
│   ├── auth.css           # Login page styles
│   └── profile.css        # Profile page styles
├── js/
│   ├── auth/
│   │   ├── auth.js        # JWT storage, logout, redirect logic
│   │   └── login.js       # Login form handler, Basic auth
│   ├── api/
│   │   ├── client.js      # GraphQL fetch wrapper (Bearer token)
│   │   └── queries.js     # All GraphQL query strings
│   ├── utils/
│   │   ├── jwt.js         # Decode JWT, extract userId
│   │   └── transforms.js  # Raw API data → graph-ready data
│   └── graphs/
│       ├── xp-over-time.js    # SVG line graph
│       └── pass-fail-ratio.js # SVG bar/pie chart
└── tests/
    ├── auth.test.js       # Test base64 encoding, JWT decode
    ├── transforms.test.js # Test data transformations
    └── setup.js           # Test environment setup



    