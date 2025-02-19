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
      - name: Hello world action step
        id: hello
        uses: FabioTavernini/notify-threema-broadcast@v1
        with:
          THREEMA_URL: ${{ secrets.THREEMA_URL }}
          THREEMA_XAPIKEY: ${{ secrets.THREEMA_XAPIKEY }}
          message: 'Hello from github'
      - name: Get the output time
        run: echo "The time was ${{ steps.hello.outputs.time }}"
```