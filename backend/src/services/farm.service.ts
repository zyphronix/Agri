import FarmPlot from '../models/FarmPlot';
import { AppError } from '../middleware/errorHandler';

interface CreateFarmData {
  name: string;
  area: number;
  location: { lat: number; lon: number };
  soil: { nitrogen: number; phosphorus: number; potassium: number; pH: number };
}

class FarmService {
  async createFarm(userId: string, data: CreateFarmData) {
    const farm = await FarmPlot.create({
      userId,
      ...data,
    });

    return farm;
  }

  async getUserFarms(userId: string) {
    const farms = await FarmPlot.find({ userId }).sort({ createdAt: -1 });
    return farms;
  }

  async getFarmById(farmId: string, userId: string) {
    const farm = await FarmPlot.findOne({ _id: farmId, userId });
    if (!farm) {
      throw new AppError(404, 'Farm not found');
    }
    return farm;
  }

  async updateFarm(farmId: string, userId: string, data: Partial<CreateFarmData>) {
    const farm = await FarmPlot.findOneAndUpdate(
      { _id: farmId, userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!farm) {
      throw new AppError(404, 'Farm not found');
    }

    return farm;
  }

  async deleteFarm(farmId: string, userId: string) {
    const farm = await FarmPlot.findOneAndDelete({ _id: farmId, userId });
    if (!farm) {
      throw new AppError(404, 'Farm not found');
    }
    return { message: 'Farm deleted successfully' };
  }
}

export default new FarmService();
