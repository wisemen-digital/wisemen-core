import { Euros, EurosColumn } from "./euros.js";

// Example usage of EurosColumn and Euros type
export class Product {
  @EurosColumn({ type: 'int', nullable: true, default: new Euros(0, 2) })
  price: Euros | null
}
