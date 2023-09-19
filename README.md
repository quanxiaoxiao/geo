## Usage

```shell
$ geo --data '[121.486537, 29.884145]' --zoom 18 > location.png
```

![](./assets/images/location.png)


```shell
$ curl -s  -H "Cookie: $cookie" "https://60.190.56.95/trackapi/lastpoints"  \
| jq 'map(.coordinate)' \
| geo --data @- --zoom 12 --width 4800 --height 4800 > points.png
```

![](./assets/images/points.png)
