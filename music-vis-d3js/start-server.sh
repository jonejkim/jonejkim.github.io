#/bin/bash

# simple http-server for testing on local area network or localhost

expose_to_lan() {
    # use this to expose webpage access to other computers in Local Area Network
    # as well as localhost
    python3 -m http.server 8000 --bind 0.0.0.0 --directory .
}

loopback_only() {
    # use this to access webpage only from the current computer (localhost).
    python3 -m http.server 8000 --bind 127.0.0.1 --directory .
}

# Start Server
expose_to_lan