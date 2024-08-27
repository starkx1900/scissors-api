import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Query, Types } from 'mongoose';

@Schema({
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
})
export class Url extends Document {
  @Prop({ type: String, required: true })
  originalUrl: string;

  @Prop({ type: String, required: true, unique: true })
  shortenedUrl: string;

  @Prop({ type: Number, default: 0 })
  clicks: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Analytics' }] })
  analytics: Types.ObjectId[];
}

export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.pre<Query<any, Event>>(/^find/, function (next) {
  this.populate('createdBy', '_id, name');
  next();
});
