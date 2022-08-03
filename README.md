# Api recorder and mock plugin for playwright

## Why this tool?

Why not use playwright native `recordHar` option?

The `recordHar` function of playwright use exact match of url,body,headers content for mock data.

This tool will record api data by order, and mock them with the same order.

## Install

```sh
yarn add -D playwright-record-and-mock
```

## Usage

In your playwright test case file.

```typescript

import { factory } from "playwright-record-and-mock"

const { record, mock } = factory({
  urlMatcher: /\/api\//, // which response should be recorded
  mockFilePath: 'e2e/responseMap.json', // where to save the record data
})

/**
* record api data while run `playwright test` only when record data file not exists.
*/
record()

test('test1', async ({ page }) => {
  mock(page)
  ...
})

```

Then, run first time `playwright test`, it will record the api data.

Rerun `playwright test`, the recorded api data will be used.
