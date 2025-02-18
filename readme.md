# Send Alert to Threema Broadcast Group with Github actions

## Example usage

```yaml
name: Send Threema Message

on:
  push:
    branches:
      - main

jobs:
  send-threema-message:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Send message to Threema group
      uses: yourusername/sendmessageoverthreema@main
      with:
        group: "your_group_id"
        identity: "your_identity"
        message: "This is a test message from GitHub Actions!"
```
