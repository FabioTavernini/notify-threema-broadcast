<img height="32" width="32" src="https://cdn.simpleicons.org/threema" />

[![Release](https://github.com/FabioTavernini/notify-threema-broadcast/actions/workflows/release.yaml/badge.svg?branch=main)](https://github.com/FabioTavernini/notify-threema-broadcast/actions/workflows/release.yaml)

# Send Alert to Threema Broadcast Group with Github actions
:bell: Send a custom message with repo infos to a Threema Broadcast Group using github actions.

Threema Group URL will look like this:
`https://broadcast.threema.ch/api/v1/identities/{broadcastUid}/groups/{groupUid}/chat`

To get more infos about threema API:
[API Docs](https://broadcast.threema.ch/en/api-doc)

X-API-Key can be generated at:
`Threema Broadcast > Settings > Your profile > API Keys.`

## Inputs

| Name            | Required | Description                                                     |
|-----------------|----------|-----------------------------------------------------------------|
| THREEMA_URL     | yes      | url to your Threema broadcast Group (POST will be sent to this) |
| THREEMA_XAPIKEY | yes      | Your Threema X-API-Key                                          |
| job             | yes      | Job data as json : `${{toJson(job)}}`                        |
| message         | yes      | The message text to send to the group                           |

## Example usage
Add two Secrets to your repo

- THREEMA_URL
- THREEMA_XAPIKEY

Then create or edit an action at `.github/workflows/youraction.yaml`.

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: Send Threema Alert
    steps:
      - name: Send Threema message
        id: hello
        uses: FabioTavernini/notify-threema-broadcast@v1
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
# Contribution
Feel free to contribute in any way, shape or form.