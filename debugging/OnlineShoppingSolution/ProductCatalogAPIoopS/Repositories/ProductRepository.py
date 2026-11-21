
from Helpers.persist_manager import PersistManager
from Entities.product import Product


class ProductRepository:

    def __init__(self, filePath):

        self.filePath = filePath


    # R - Get All Products
    def GetAll(self):

        print("GetAll method invoked")

        return PersistManager.Load(self.filePath)


    # R - Get Product By Id
    def GetById(self, id):

        print("GetById method invoked")

        products = self.GetAll()

        theProduct = None

        for product in products:

            if product.Id == id:

                theProduct = product

                return theProduct

        return theProduct


    # C - Create Product
    def Create(self, product):

        print("Create method invoked")

        products = self.GetAll()

        for existingProduct in products:

            if existingProduct.Id == product.Id:

                return False

        products.append(product)

        return PersistManager.Dump(
            self.filePath,
            products
        )


    # U - Update Product
    def Update(self, productToUpdate):

        print("Update method invoked")

        products = self.GetAll()

        existingProduct = self.GetById(productToUpdate.Id)

        if existingProduct is not None:

            for index in range(len(products)):

                if products[index].Id == productToUpdate.Id:

                    products[index] = productToUpdate

                    return PersistManager.Dump(
                        self.filePath,
                        products
                    )

        return False


    # D - Delete Product
    def Delete(self, id):

        print("Delete method invoked")

        products = self.GetAll()

        existingProduct = self.GetById(id)

        if existingProduct is not None:

            products.remove(existingProduct)

            return PersistManager.Dump(
                self.filePath,
                products
            )

        return False
