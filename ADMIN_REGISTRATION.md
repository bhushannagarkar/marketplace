API Documentation
This document outlines the Admin and Seller endpoints for the project, including request formats, authentication requirements, and success responses. All endpoints use JSON for data exchange unless specified otherwise. Authentication is handled via JWT tokens set in HTTP-only cookies where required.
Admin Endpoints
1. Register Admin (One-Time Only)

Method: POST
Endpoint: /admin/register
Authentication: None (only works if no admin exists)
Request Body:{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "adminpassword",
  "confirmPassword": "adminpassword"
}


Success Response (200):{
  "message": "Admin registered successfully",
  "admin": {
    "id": 1,
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin"
  }
}



2. Admin Login

Method: POST
Endpoint: /admin/login
Authentication: None
Request Body:{
  "email": "admin@example.com",
  "password": "adminpassword"
}


Success Response (200):{
  "message": "Login successful",
  "role": "admin"
}


A JWT token is set in an HTTP-only cookie.



3. Create Seller

Method: POST
Endpoint: /admin/sellers
Authentication: Admin (via JWT cookie)
Request Body:{
  "name": "Seller Name",
  "email": "seller@example.com",
  "mobile": "9876543210",
  "country": "Country",
  "state": "State",
  "skills": "Skill1, Skill2",
  "password": "sellerpassword"
}


Success Response (200):{
  "message": "Seller created",
  "seller": {
    "id": 1,
    "name": "Seller Name",
    "email": "seller@example.com",
    "mobile": "9876543210",
    "country": "Country",
    "state": "State",
    "skills": "Skill1, Skill2"
  }
}



4. List Sellers (Paginated)

Method: GET
Endpoint: /admin/sellers?page=1&limit=10
Authentication: Admin (via JWT cookie)
Success Response (200):{
  "total": 2,
  "page": 1,
  "pageSize": 10,
  "sellers": [
    {
      "id": 1,
      "name": "Seller Name",
      "email": "seller@example.com",
      "mobile": "9876543210",
      "country": "Country",
      "state": "State",
      "skills": "Skill1, Skill2"
    }
  ]
}



Seller Endpoints
5. Seller Login

Method: POST
Endpoint: /seller/login
Authentication: None
Request Body:{
  "email": "seller@example.com",
  "password": "sellerpassword"
}


Success Response (200):{
  "message": "Login successful",
  "role": "seller"
}


A JWT token is set in an HTTP-only cookie.



6. Create Product

Method: POST
Endpoint: /seller/products
Authentication: Seller (via JWT cookie)
Request Body:{
  "name": "Product Name",
  "description": "A detailed description of the product."
}


Success Response (200):{
  "message": "Product created successfully",
  "product": {
    "id": 1,
    "name": "Product Name",
    "description": "A detailed description of the product.",
    "sellerId": 1
  }
}



7. Add Brands to Product (with Images)

Method: POST
Endpoint: /seller/products/:id/brands
Authentication: Seller (via JWT cookie)
Request Type: multipart/form-data
Request Fields:
brands (text): JSON array of brand objects[
  {
    "productId": 1,
    "name": "Brand A",
    "detail": "Brand A details",
    "price": 99.99
  },
  {
    "productId": 1,
    "name": "Brand B",
    "detail": "Brand B details",
    "price": 149.99
  }
]


brandImages (file, multiple): Images for each brand, matching the order of brands in the array.


Success Response (200):{
  "message": "Brands added successfully",
  "brandsCount": 2
}



8. List Products (Paginated)

Method: GET
Endpoint: /seller/products?page=1&limit=10
Authentication: Seller (via JWT cookie)
Success Response (200):{
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "A detailed description of the product.",
      "sellerId": 1,
      "Brands": [
        {
          "id": 1,
          "productId": 1,
          "name": "Brand A",
          "detail": "Brand A details",
          "image": "brandA.jpg",
          "price": 99.99
        }
      ]
    }
  ]
}



9. Delete Product

Method: DELETE
Endpoint: /seller/products/:id
Authentication: Seller (via JWT cookie)
Success Response (200):{
  "message": "Product deleted successfully"
}


