import mongoose, { Schema } from 'mongoose';
import { IFarmPlot } from '../types';

const FarmPlotSchema = new Schema<IFarmPlot>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
    area: {
      type: Number,
      required: true,
      default: 0,
    },
    soil: {
      nitrogen: {
        type: Number,
        required: true,
      },
      phosphorus: {
        type: Number,
        required: true,
      },
      potassium: {
        type: Number,
        required: true,
      },
      pH: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user queries
FarmPlotSchema.index({ userId: 1 });

export default mongoose.model<IFarmPlot>('FarmPlot', FarmPlotSchema);
