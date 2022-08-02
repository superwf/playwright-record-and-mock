# Api recorder and mock plugin for playwright

## Install

```sh
yarn add -D @superwf/playwright-record-mock
```

## Usage

In your playwright test case file.

```typescript

import { factory } from "@superwf/playwright-record-mock"

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
