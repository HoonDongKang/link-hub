import type { Link, Folder } from '../types';

export interface AppData {
  links: Link[];
  folders: Folder[];
}

export const fetchData = async (): Promise<AppData> => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty state if fetch fails to avoid breaking UI entirely
    return { links: [], folders: [] };
  }
};

export const saveData = async (data: AppData): Promise<void> => {
  try {
    const response = await fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save data: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
