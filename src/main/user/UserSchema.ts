import * as mongoose from 'mongoose';

export interface UserInterface extends mongoose.Document {
  userType: string,
  email: string,
  password: string,
}

const User = new mongoose.Schema({
  userType: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserSchema = mongoose.model<UserInterface>('User', User);

export default UserSchema;
