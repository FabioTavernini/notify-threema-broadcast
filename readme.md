# Send Alert to Threema Broadcast Group with Github actions

Send a message and repo infos to a Threema Broadcast Group using github actions.

Threema Group URL will look like this:
`https://broadcast.threema.ch/api/v1/identities/{broadcastUid}/groups/{groupUid}/chat`

To get more infos about threema API:
[API Docs](https://broadcast.threema.ch/en/api-doc)

X-API-Key can be generated at:
`Threema Broadcast > Settings > Your profile > API Keys.`

## Example usage

Add two Secrets to your repo

- THREEMA_URL
- THREEMA_XAPIKEY

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: Send Threema Alert
    steps:
      - name: Send Threema message
        id: hello
        uses: FabioTavernini/notify-threema-broadcast@HEAD
        with:
          THREEMA_URL: ${{ secrets.THREEMA_URL }}
          THREEMA_XAPIKEY: ${{ secrets.THREEMA_XAPIKEY }}
          job: ${{ toJson(job) }}
          message: 'Hello from github'
      - name: Get outputs
        run: |
          echo "response ${{ steps.hello.outputs.response }}"
          echo "status ${{ steps.hello.outputs.status }}"
```