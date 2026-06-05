import { EurosDtoBuilder } from "./euros.js";
import { ProductDto } from "./product.dto.js";
import { Product } from "./product.entity.js";

// Example of compatibility of EurosDto with Euros
function updateProduct (product: Product, dto: ProductDto) {
  product.price = dto.price?.parse() ?? null
}

function createProduct (amount: number, precision: number): Product {
  const product = new Product()

  const eurosDto = new EurosDtoBuilder()
    .withAmount(amount)
    .withPrecision(precision)
    .build()
    
  product.price = eurosDto.parse()

  return product
}
