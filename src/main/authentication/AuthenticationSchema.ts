import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

interface AuthenticationInterface extends mongoose.Document {
  userId: Types.ObjectId;
  userType: string;
  accessToken: string;
  accessTokenExpiresIn: Date;
}

const Authentication = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  accessTokenExpiresIn: {
    type: Date,
    required: true
  }
});

const AuthenticationSchema = mongoose.model<AuthenticationInterface>('Authentication', Authentication);
export default AuthenticationSchema;
