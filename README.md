# Assessment Project

A Playwright-based testing framework for API testing. It validates various endpoints of the "fakestoreapi.com" API, covering GET, POST, PUT, PATCH, and DELETE operations.

## Prerequisites

- Node.js version >= 16
- Playwright

### Installation

1. Clone the repository.

2. Install dependencies:
   npm install

#### Running tests
   npm test

Test reports are generated in the my-report directory.

##### Test cases covered
Products - Get:
1.Validate 200 response.
2.Validate product object structure.
3.Validate JSON response.
4.Validate category filter.

Products - Post:
5.Create a new product.
6.Create a new product with invalid data.

Product/:id - Get:
7.Retrieve a single product.
8.Retrieve a non-existent product.

Product/:id - Put:
9.Update a product with PUT.
10.Update a non-existent product with PUT.

Product/:id - Patch:
11.Update a product with PATCH.
12.Update a non-existent product with PATCH.

Product/:id - Delete:
13.Delete an existing product.
14.Delete a non-existent product.
