// src/database/seeds/01_components.ts
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('components').del();

  // Inserts seed entries
  await knex('components').insert([
    {
      name: 'AMD Ryzen 9 5900X',
      type: 'cpu',
      manufacturer: 'AMD',
      model: 'Ryzen 9 5900X',
      specifications: JSON.stringify({
        cores: 12,
        threads: 24,
        baseClock: '3.7GHz',
        boostClock: '4.8GHz',
        socket: 'AM4',
      }),
      price: 549.99,
      stock: 15,
    },
    {
      name: 'NVIDIA GeForce RTX 3080',
      type: 'gpu',
      manufacturer: 'NVIDIA',
      model: 'RTX 3080',
      specifications: JSON.stringify({
        vram: '10GB GDDR6X',
        boostClock: '1710MHz',
        memoryInterface: '320-bit',
      }),
      price: 799.99,
      stock: 8,
    },
    {
      name: 'Corsair Vengeance RGB Pro 32GB',
      type: 'ram',
      manufacturer: 'Corsair',
      model: 'CMW32GX4M2C3200C16',
      specifications: JSON.stringify({
        capacity: '32GB',
        speed: '3200MHz',
        timings: 'CL16',
        modules: '2x16GB',
      }),
      price: 149.99,
      stock: 25,
    },
    {
      name: 'ASUS ROG Strix B550-F Gaming',
      type: 'motherboard',
      manufacturer: 'ASUS',
      model: 'ROG Strix B550-F',
      specifications: JSON.stringify({
        socket: 'AM4',
        chipset: 'B550',
        memorySlots: 4,
        maxMemory: '128GB',
      }),
      price: 179.99,
      stock: 12,
    },
  ]);
}
