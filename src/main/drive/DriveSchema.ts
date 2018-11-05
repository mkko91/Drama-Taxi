import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

interface DriveInterface extends mongoose.Document {
  requestId: Types.ObjectId;
  requestAt: Date;
  responseId: Types.ObjectId;
  responseAt: Date;
  status: Number;
  address: string;
}

const Drive = new mongoose.Schema({
  requestId: {
    type: Types.ObjectId,
    required: true
  },
  requestAt: {
    type: Date,
    required: true
  },
  responseId: {
    type: Types.ObjectId,
    required: false
  },
  responseAt: {
    type: Date,
    required: false
  },
  status: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true,

  }
});

Drive.path('address').validate(function (v) {
  return v.length <= 100;
});

const DriveSchema = mongoose.model<DriveInterface>('Drive', Drive);
export default DriveSchema;
