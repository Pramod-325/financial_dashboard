import type { User } from '../models/FinanceTypes';

export class DataService {
  public static async fetchUserData(userIndex: number = 0): Promise<User> {
    try {
      const response = await fetch('/mock-api/data.json');
      const data = await response.json();
      return data.user[userIndex]; // Easily switch between the admin and viewer mock profiles
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  }
}