
from fastapi import FastAPI, HTTPException
from pathlib import Path

from Entities.product import Product
from Repositories.ProductRepository import ProductRepository


app = FastAPI(
    title="Product Catalog API",
    description="Product CRUD Operations using FastAPI",
    version="1.0.0"
)


# JSON File Path
BASE_DIR = Path(__file__).resolve().parent

filePath = str(BASE_DIR / "products.json")


# Repository Object
repo = ProductRepository(filePath)


# R - Get All Products
@app.get("/api/products")
def GetAll():

    return repo.GetAll()


# R - Get Product By Id
@app.get("/api/products/{id}")
def GetById(id: int):

    product = repo.GetById(id)

    if product is None:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# C - Create Product
@app.post("/api/products", status_code=201)
def Create(product: Product):

    status = repo.Create(product)

    if not status:

        raise HTTPException(
            status_code=409,
            detail="Product already exists or save failed"
        )

    return {
        "message": "Product added successfully",
        "product": product
    }


# U - Update Product
@app.put("/api/products/{id}")
def Update(id: int, product: Product):

    updatedProduct = product.model_copy(
        update={"Id": id}
    )

    status = repo.Update(updatedProduct)

    if not status:

        raise HTTPException(
            status_code=404,
            detail="Product not found or update failed"
        )

    return {
        "message": "Product updated successfully",
        "product": updatedProduct
    }


# D - Delete Product
@app.delete("/api/products/{id}")
def Delete(id: int):

    status = repo.Delete(id)

    if not status:

        raise HTTPException(
            status_code=404,
            detail="Product not found or delete failed"
        )

    return {
        "message": "Product deleted successfully"
    }
