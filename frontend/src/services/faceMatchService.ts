import { db } from "../config/db";
import { Encodings, Occupants } from "../types/db.types";

function euclideanDistance(descriptor1: number[], descriptor2: number[]): number {
    if (descriptor1.length !== descriptor2.length) {
      throw new Error('Descriptors must have the same length');
    }
  
    return Math.sqrt(
      descriptor1.reduce((sum, val, idx) => sum + Math.pow(val - descriptor2[idx], 2), 0)
    );
}

export async function findBestMatch(userDescriptor: number[]): Promise<Occupants | null> {
    const users = await db.encodings.toArray(); // Retrieve all face records
    let bestMatch: Encodings | null = null;
    let bestDistance = Number.MAX_VALUE;
  
    users.forEach((user) => {
      const distance = euclideanDistance(userDescriptor, user.encoding);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = user;
      }
    });
  
    // Define a threshold for matching
    const THRESHOLD = 0.5; // Adjust based on accuracy needs
    return bestDistance <= THRESHOLD ? bestMatch : null;
}

export async function findBestMatchBySchoolId(
  userDescriptor: number[], 
  schoolId: string
): Promise<Encodings | null> {
  const schoolUsers = await db.encodings
    .where('school_id')
    .equals(schoolId)
    .toArray();

  if (schoolUsers.length === 0) {
    return null;
  }

  let bestMatch: Encodings | null = null;
  let bestDistance = Number.MAX_VALUE;

  schoolUsers.forEach((user) => {
    const distance = euclideanDistance(userDescriptor, user.encoding);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = user;
    }
  });

  const THRESHOLD = 0.5;
  return bestDistance <= THRESHOLD ? bestMatch : null;
}