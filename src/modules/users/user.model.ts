import mongoose, { Schema } from 'mongoose';
import { hashPassword, comparePasswordWithHash } from '../../utils/bcrypt';
import { IUserDocument, UserRoles } from './user.types';

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.CUSTOMER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await comparePasswordWithHash(password, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
