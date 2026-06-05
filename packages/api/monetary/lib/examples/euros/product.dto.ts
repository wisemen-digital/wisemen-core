import { EurosApiProperty, EurosDto, IsEuros } from "./euros.js";

// Example usage of EurosApiProperty, IsEuros and EurosDto
export class ProductDto {
  @EurosApiProperty({ nullable: true })
  @IsEuros({ minAmount: 0, maxAmount: 100*100 })
  price: EurosDto | null
}