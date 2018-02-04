# Shutter Samples

Sample use cases for shutter, written as unit tests using AVA.

## Setup

```sh
yarn
```

## Usage

Run the tests in `test/` as usual:

```sh
yarn test
```

Now try editing the snapshotted page content / component, so that it does not match the snapshot anymore. Then run `yarn test` again and watch the test fail.

Debugging information, including the latest screenshot, expected image and the diff, will be available in `test/.last-run/`. The directory path will also be shown by shutter's `does not match snapshot` error.
