import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Medicine } from '@/lib/types';

const medicineFilePath = join(process.cwd(), 'public', 'data', 'medicines.json');

async function readMedicines(): Promise<Medicine[]> {
  const file = await fs.readFile(medicineFilePath, 'utf8');
  return JSON.parse(file) as Medicine[];
}

async function writeMedicines(medicines: Medicine[]) {
  await fs.writeFile(medicineFilePath, JSON.stringify(medicines, null, 2), 'utf8');
}

export async function GET() {
  const medicines = await readMedicines();
  return NextResponse.json(medicines);
}

export async function POST(request: Request) {
  const medicine = (await request.json()) as Medicine;
  const medicines = await readMedicines();
  const index = medicines.findIndex((item) => item.id === medicine.id);

  if (index === -1) {
    medicines.push(medicine);
  } else {
    medicines[index] = medicine;
  }

  await writeMedicines(medicines);
  return NextResponse.json(medicine);
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id: number };
  const medicines = await readMedicines();
  const filtered = medicines.filter((item) => item.id !== id);
  await writeMedicines(filtered);
  return NextResponse.json({ success: true });
}
