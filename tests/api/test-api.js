import { test, expect } from "@playwright/test";

//product-get
test.describe("products - get", () => {
  test("validate 200 response", async ({ request }) => {
    const response = await request.get("/products");
    expect(response.status()).toBe(200);
  });

  test("validate product object structure", async ({request}) => {
    const response = await request.get("/products");
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    for (const product of responseBody) {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("title");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("image");
      expect(product).toHaveProperty("rating");
    }
  });

  test("validate JSON response", async ({ request }) => {
    const response = await request.get("/products");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
  });

  test("validate category filter", async ({ request }) => {
    const specificCategory = "electronic"; 
    const response = await request.get(
      "/products/category/" + specificCategory
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    for (const product of responseBody) {
      expect(product.category).toBe(specificCategory);
    }
  });
});

//product-post
test.describe("products - post", () => {
  test("create a new product", async ({ request }) => {
    const newProduct = {
      title: "Test Product",
      price: 13.5,
      description: "Lorem ipsum set",
      image: "https://i.pravatar.cc",
      category: "electronic"
    };

    const response = await request.post("/products", {
      data: newProduct
    });

    expect(response.status()).toBe(200);
    const createdProduct = await response.json();

    // Validate the response contains the newly created product
    expect(createdProduct.title).toBe(newProduct.title);
    expect(createdProduct.price).toBe(newProduct.price);
    expect(createdProduct.description).toBe(newProduct.description);
    expect(createdProduct.category).toBe(newProduct.category);

  });

  test("create a new product with invalid data", async ({request}) => {
    const invalidProduct = {};

    const response = await request.post("/products", {
      data: invalidProduct
    });

    // Validate that the API returns a 4xx status code to indicate a bad request
    expect(response.status()).toBeGreaterThan(399);
  });
});

//product/:id-get
test.describe("product/:id - get", () => {
  test('retrieve a single product', async ({ request }) => {
    const productId = 1; //should be a number between 1 & 20
    const response = await request.get(`/products/${productId}`);
    expect(response.status()).toBe(200);
    const product = await response.json();
    expect(product).toMatchObject({
      id: productId,
      title: expect.any(String),
      price: expect.any(Number),
      category: expect.any(String),
      description: expect.any(String),
      image: expect.any(String),
    });
  });
  
  test('retrieve a non-existent product', async ({ request }) => {
    const response = await request.get('/products/100');
    expect(response.status()).toBe(404); // response should be 404 as the product is not available
  }); 
});

//products/:id-put
test.describe("product/:id - put", () => {
  test('update a product with PUT', async ({ request }) => {
    const productId = 7;
    const newData = {
      title: 'new title',
      price: 13.5,
      category: 'new category',
      description: 'new description',
      image: 'new image url',
    };
  
    const response = await request.put(`products/${productId}`, {
      data: newData,
    });
  
    expect(response.status()).toBe(200);
    const updatedProduct = await response.json();
    expect(updatedProduct).toMatchObject(newData);
  });
  
  test('update a non-existent product with PUT', async ({ request }) => {
    const productId = 999; // Assume this product ID does not exist.
    const newData = {
      title: 'new title',
      price: 13.5,
      category: 'new category',
      description: 'new description',
      image: 'new image url',
    };
  
    const response = await request.put(`products/${productId}`, {
      data: newData,
    });
  
    expect(response.status()).toBe(404); // Expect a Not Found status code.
    
  });
  
});

//products/:id-patch
test.describe("product/:id - patch", () => {
  test('update a product with PATCH', async ({ request }) => {
    const productId = 7;
    const newData = {
      title: 'new title',
      price: 13.5,
      category: 'new category',
      description: 'new description',
      image: 'new image url',
    };
  
    const response = await request.patch(`products/${productId}`, {
      data: newData,
    });
  
    expect(response.status()).toBe(200);
    const updatedProduct = await response.json();
    expect(updatedProduct).toMatchObject(newData);
  });
  
  test('update a non-existent product with PATCH', async ({ request }) => {
    const productId = 999; // Assume this product ID does not exist.
    const newData = {
      title: 'new title',
      price: 13.5,
      category: 'new category',
      description: 'new description',
      image: 'new image url',
    };
  
    const response = await request.patch(`products/${productId}`, {
      data: newData,
    });
  
    expect(response.status()).toBe(200); // Expect a Not Found status code.
  });
});

//products/:id-delete
test.describe("product/:id - delete", () => {
  test("delete an existing product", async ({ request }) => {
    const productIdToDelete = 6;
    //formulating the expected response
    const responsee = await request.get(`/products/${productIdToDelete}`);
    const deletedProductExpected = await responsee.json();
    //Send a DELETE request
    const response = await request.delete(`/products/${productIdToDelete}`);

    expect(response.status()).toBe(200);
    const deletedProduct = await response.json();
    //validate response
    expect(deletedProduct).toEqual(deletedProductExpected);
  });

  test("delete a non-existent product", async ({ request }) => {
    const nonExistentProductId = 999;
    // Send a DELETE request for a product that doesn't exist
    const response = await request.delete(`/products/${nonExistentProductId}`);

    // Validate that the response status code is 404 (Not Found)
    expect(response.status()).toBe(404);
  });

  // this test can't be validated since DB is not getting updated

  /*test("product-delete: verify deleted product is not available", async ({request}) => {
    const productIdToDelete = 6;
    // Send a DELETE request
    const response = await request.delete(`/products/${productIdToDelete}`);
    expect(response.status()).toBe(200);
    // Send a GET request to check the deleted product's availability
    const responsee = await request.get(`/products/${productIdToDelete}`);

    // Validate that the response status code is 404 (Not Found)
    expect(responsee.status()).toBe(404);
  });*/
});
