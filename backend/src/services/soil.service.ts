import axios from 'axios';
import config from '../config/env';
import { SoilData } from '../types';
import { mockSoilData } from '../mock/soil';

class SoilService {
  async fetchSoilHealthCard(lat: number, lon: number): Promise<SoilData | null> {
    // TODO: Integrate with Government Soil Health Card API
    /*
    try {
      const response = await axios.get(
        `https://soilhealth.dac.gov.in/api/getdata`,
        {
          params: { lat, lon, apiKey: config.soilApiKey },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Soil Health Card API error:', error);
      return null;
    }
    */

    console.log(`🌱 Fetching Soil Health Card for: ${lat}, ${lon}`);
    return null; // Return null to simulate data not found
  }

  async fetchSoilGridsData(lat: number, lon: number): Promise<SoilData | null> {
    // TODO: Integrate with ISRIC SoilGrids API
    /*
    try {
      const response = await axios.get(
        `https://rest.isric.org/soilgrids/v2.0/properties/query`,
        {
          params: { lat, lon, property: ['nitrogen', 'phh2o', 'soc'] },
        }
      );
      return this.transformSoilGridsData(response.data);
    } catch (error) {
      console.error('SoilGrids API error:', error);
      return null;
    }
    */

    console.log(`🌍 Fetching SoilGrids data for: ${lat}, ${lon}`);
    return null; // Return null to simulate data not found
  }

  async getSoilDataForFarm(farmId: string): Promise<SoilData> {
    const FarmPlot = require('../models/FarmPlot').default;
    const farm = await FarmPlot.findById(farmId);
    
    if (!farm) {
      throw new Error('Farm not found');
    }

    // Try Soil Health Card first
    let soilData = await this.fetchSoilHealthCard(
      farm.location.lat,
      farm.location.lon
    );

    // If not found, try SoilGrids
    if (!soilData) {
      soilData = await this.fetchSoilGridsData(
        farm.location.lat,
        farm.location.lon
      );
    }

    // If still not found, return farm's existing soil data or mock
    if (!soilData) {
      if (farm.soil) {
        return {
          ...farm.soil.toObject(),
          source: 'User Input',
        };
      }
      return mockSoilData;
    }

    return soilData;
  }
}

export default new SoilService();
