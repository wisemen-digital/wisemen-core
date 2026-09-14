import { Euros, EurosApiProperty, EurosDto, IsEuros } from "./euros.js";

// Example usage of EurosApiProperty, IsEuros and EurosDto
export class ProductDto {
  @EurosApiProperty({ nullable: true })
  @IsEuros({ min: new Euros(0, 0), max: new Euros(100, 0)})
  price: EurosDto | null
}
