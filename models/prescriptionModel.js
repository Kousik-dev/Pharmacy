import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    createdAt: { 
      type: Date,
      expires: 86400,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Prescriptions', prescriptionSchema);
