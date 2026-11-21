from fastapi import FastAPI
from app.api.routes.product_routes import router as product_router
from app.repositories.product_repository import ProductRepository
from app.services.product_service import ProductService


app = FastAPI(
    title="Product API",
    description="Product REST API",
    version="1.0"
)


# Create shared application dependencies
repository = ProductRepository()

app.state.product_service = ProductService(repository)


# Register API routes
app.include_router(product_router)

# When someone sends a GET request to /, execute the home() function.
@app.get("/")
def home():
    return {
        "application": "Product API",
        "message": "Welcome to Product REST API",
        "docs": "/docs"
    }