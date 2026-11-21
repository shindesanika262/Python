
from pydantic import BaseModel


class Product(BaseModel):

    Id: int
    Title: str
    Description: str
    Price: float
    StockAvailable: int
