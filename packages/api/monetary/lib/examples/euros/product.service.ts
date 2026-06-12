import { EurosDtoBuilder } from "./euros.js";
import { ProductDto } from "./product.dto.js";
import { Product } from "./product.entity.js";

// Example of compatibility of EurosDto with Euros
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateProduct (product: Product, dto: ProductDto) {
  product.price = dto.price?.parse() ?? null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createProduct (amount: number, precision: number): Product {
  const product = new Product()

  const eurosDto = new EurosDtoBuilder()
    .withAmount(amount)
    .withPrecision(precision)
    .build()
    
  product.price = eurosDto.parse()

  return product
}
