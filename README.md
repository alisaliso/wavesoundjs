# wavesoundjs

![SoundWaweformJS example](media/screenshot.png)

## Usage

Create container:

```html
<style>
  .container {
    width: 500px;
    height: 100px;
    position: relative;
  }
</style>

<div class="container">
  <audio
    class="current_audio"
    src="http://www.archive.org/download/aliceinwonderland_1102_librivox/aliceinwonderland_00_carroll.mp3"
    type="audio/mpeg"
    preload="metadata"
  ></audio>
</div>
```

```js
const player_container = document.querySelector('.container');

WaveSoundjs.create({
  container: player_container,
  points: [-29, 20, ...]
})
```

## Development

```sh
# Terminal 1
$ docker-compose up

# Terminal 2
$ docker-compose exec app bash

# > Build Project
$ tsc

# > Run Project
$ npm run start
```
