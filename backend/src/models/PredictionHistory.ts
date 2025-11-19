import mongoose, { Schema } from 'mongoose';

const PredictionHistorySchema = new Schema(
  {
    farmId: { type: String, required: true, ref: 'FarmPlot' },
    input: { type: Schema.Types.Mixed, required: true },
    response: { type: Schema.Types.Mixed },
    success: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PredictionHistorySchema.index({ farmId: 1 });

export default mongoose.model('PredictionHistory', PredictionHistorySchema);
