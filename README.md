# Vayara

Vayara is a library for smooth scrolling in web projects. It enhances user experience by adding inertia and smooth scrolling with
customizable parameters.

## Installation

Install the library using npm or yarn:

```sh
npm install vayara
```

or

```sh
yarn add vayara
```

## Usage

### Import and Initialization

```ts
import createSmoothScroll from 'vayara';

const smoothScroll = createSmoothScroll({
	wrapper: window, // Scroll container
	content: document.documentElement, // Content inside the container
	smooth: 0.1, // Smoothness level (from 0 to 1)
	direction: 'vertical', // Scrolling direction ('vertical' | 'horizontal')
	smoothWheel: true, // Enable smooth scrolling with the mouse wheel
	maxScrollSpeed: 100, // Maximum scrolling speed
	normalizeSmooth: true, // Normalize smoothness
	subPixelControl: 5, // Subpixel movement control
});
```

### Methods

#### `start()`

Starts the smooth scrolling animation.

```ts
smoothScroll.start();
```

#### `stop()`

Stops smooth scrolling.

```ts
smoothScroll.stop();
```

#### `destroy()`

Completely removes event handlers and disables smooth scrolling.

```ts
smoothScroll.destroy();
```

#### `on('scroll', callback)`

Allows subscribing to the scroll event.

```ts
smoothScroll.on('scroll', (event) => {
	console.log('Current position:', event.scroll);
	console.log('Scroll velocity:', event.velocity);
	console.log('Direction:', event.direction);
});
```

#### `off('scroll', callback)`

Unsubscribes from the scroll event.

```ts
smoothScroll.off('scroll', callback);
```

## Options

| Option            | Type           | Description                                             |
| ----------------- | -------------- | ------------------------------------------------------- | ------------------------------------- |
| `wrapper`         | `HTMLElement   | Window`                                                 | The container where scrolling occurs. |
| `content`         | `HTMLElement`  | The element containing the content.                     |
| `smooth`          | `number` (0-1) | Smoothness coefficient.                                 |
| `direction`       | `'vertical'    | 'horizontal'`                                           | Scrolling direction.                  |
| `smoothWheel`     | `boolean`      | Enables/disables smooth scrolling with the mouse wheel. |
| `maxScrollSpeed`  | `number`       | Maximum scrolling speed.                                |
| `normalizeSmooth` | `boolean`      | Normalizes animation smoothness.                        |
| `subPixelControl` | `number`       | Subpixel movement control.                              |

## License

Vayara is distributed under the MIT license.
