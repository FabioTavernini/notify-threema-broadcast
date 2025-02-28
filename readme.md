<img height="100" width="100" src="https://cdn.simpleicons.org/threema" />

<br>

[![Release](https://github.com/FabioTavernini/notify-threema-broadcast/actions/workflows/release.yaml/badge.svg?branch=main)](https://github.com/FabioTavernini/notify-threema-broadcast/actions/workflows/release.yaml)
[![CodeQL](https://github.com/FabioTavernini/notify-threema-broadcast/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/FabioTavernini/notify-threema-broadcast/actions/workflows/github-code-scanning/codeql)

![Static Badge](https://img.shields.io/github/license/FabioTavernini/notify-threema-broadcast)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/FabioTavernini/notify-threema-broadcast)

# Send Alert to Threema Broadcast Group with Github actions

:bell: Send a custom message with repo infos to a Threema Broadcast Group using github actions.

## Inputs

| Name            | Required | Description                                                     |
|-----------------|----------|-----------------------------------------------------------------|
| THREEMA_URL     | yes      | Url to your Threema broadcast Group (POST will be sent to this) |
| THREEMA_XAPIKEY | yes      | Your Threema X-API-Key                                          |
| job             | yes      | Job data as json : `${{toJson(job)}}`                           |
| message         | yes      | The message text to send to the group                           |

## Example usage

Add two Secrets to your repo

- THREEMA_URL
  - Threema Group URL will look something like this:
`https://broadcast.threema.ch/api/v1/identities/{broadcastUid}/groups/{groupUid}/chat`
 
- THREEMA_XAPIKEY
  - X-API-Key can be generated at:
`Threema Broadcast > Settings > Your profile > API Keys.`
 
 To get more infos about threema API:
[API Docs](https://broadcast.threema.ch/en/api-doc)

Then create or edit an action at `.github/workflows/youraction.yaml`.

# Examples

## Basic Example:

```yaml
on: [push]

jobs:
  demojob:
    runs-on: ubuntu-latest
    name: Send Threema Alert
    steps:
      - name: Send Threema message
        id: alert
        if: always() # Always run the job, so failures are reported / alerted.
        uses: FabioTavernini/notify-threema-broadcast@v1
        with:
          THREEMA_URL: ${{ secrets.THREEMA_URL }}
          THREEMA_XAPIKEY: ${{ secrets.THREEMA_XAPIKEY }}
          job: ${{ toJson(job) }}
          message: 'Hello from github'
      - name: Get outputs
        run: |
          echo "response ${{ steps.Alert.outputs.response }}"
          echo "status ${{ steps.Alert.outputs.status }}"
```

## Alert with commit message

```yaml
on: [push]

jobs:
  demojob:
    runs-on: ubuntu-latest
    name: Send Threema Alert
    steps:
      - name: Send Threema message
        id: alert
        if: always() # Always run the job, so failures are reported / alerted.
        uses: FabioTavernini/notify-threema-broadcast@v1
        with:
          THREEMA_URL: ${{ secrets.THREEMA_URL }}
          THREEMA_XAPIKEY: ${{ secrets.THREEMA_XAPIKEY }}
          job: ${{ toJson(job) }}
          message: '${{ github.event.head_commit.message }}'
      - name: Get outputs
        run: |
          echo "response ${{ steps.Alert.outputs.response }}"
          echo "status ${{ steps.Alert.outputs.status }}"
```

## Alert only on failure

```yaml
on: [push]

jobs:
  demojob:
    runs-on: ubuntu-latest
    name: Send Threema Alert
    steps:
      - name: Send Threema message
        id: alert
        if: failure() # Only run if job has failed
        uses: FabioTavernini/notify-threema-broadcast@v1
        with:
          THREEMA_URL: ${{ secrets.THREEMA_URL }}
          THREEMA_XAPIKEY: ${{ secrets.THREEMA_XAPIKEY }}
          job: ${{ toJson(job) }}
          message: 'Hello from github'
      - name: Get outputs
        run: |
          echo "response ${{ steps.Alert.outputs.response }}"
          echo "status ${{ steps.Alert.outputs.status }}"
```

## Styling

If you want to style/customize your message further, have a look at the guide [here](https://threema.ch/en/faq/markup).

# Contribution

Feel free to contribute in any way, shape or form.

# Disclaimer

This project is not affiliated with [@Threema](https://github.com/Threema-ch). The Threema Broadcast API is used in this action as an external service, and the creator of this action is not responsible for any issues that arise from Threema’s service or changes to their API.

