# Send Alert to Threema Broadcast Group with Github actions

## Example usage

```yaml
name: Send Threema Message

on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: A job to say hello
    steps:
      - name: Hello world action step
        id: hello
        uses: FabioTavernini/notify-threema-broadcast
        with:
          threemaUrl: ${{ secrets.THREEMA_URL }}
          X-API-Key: ${{ secrets.X-API-Key }}
          message: 'Hello from git'
      - name: Get the output time
        run: echo "The time was ${{ steps.hello.outputs.time }}"
```
